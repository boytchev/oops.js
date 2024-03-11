﻿/*	class Effects:EffectComposer( renderer, options={} )
	
		.addEffect( effect, bakedParameters={} )
		.render( scene, camera, deltaTime )
		
		.addEffect( NameOfShader, {...} )
		.addEffect( NameOfPass, {...} )
		.addEffect( new NameOfPass(...), {...} )
*/

import { Vector2, Vector3, Color } from 'three';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import { isShader, isPass, isPassClass, isString, bakeUniform, renameWord, getGlobalNames, showShaders, hasSimpleShader, mergeSimplePasses, defaultTextureName } from './oops.utils.js';
import { KB } from './oops.kb.js';



console.log( `

     :
 '.  _  .'
-=  (~)  =-     OOPS.JS
 .'  #  '.
 
` )




class Effects extends EffectComposer
{

	constructor( renderer, options={} )
	{
		super( renderer );

		this.renderPass = new RenderPass( /*scene, camera*/ );
		
		this.addPass( this.renderPass );
		this.addPass( new OutputPass() );
		
		this.parameters = {};
		this.options = options;
		this.sizeUniforms = [];
		this.sizeXUniforms = [];
		this.sizeYUniforms = [];
		this.sizeInverseUniforms = [];
		this.sizeXInverseUniforms = [];
		this.sizeYInverseUniforms = [];
		this.timeUniforms = [];
		
		this.statistics = {
			'removed uniforms': 0,
			'removed varyings': 0,
			'removed passes': 0,
		}
		
		this.needsUpdate = true;
		
	} // Effects.constructor
	
	

	addEffect( effect, bakedParameters={} )
	{
		this.needsUpdate = true;

		var name, pass;
		
		if( isShader(effect) )
		{
			// .addEffect( ShaderInstance, {...} )
			name = effect.name;
			pass = new ShaderPass( effect, defaultTextureName(effect) );
		}
		else
		if( isPass(effect) )
		{
			// .addEffect( PassInstance, {...} )
			// .addEffect( new PassClass(...), {...} )
			name = effect.constructor.name;
			pass = effect;
		}
		else
		if( isPassClass(effect) )
		{
			// .addEffect( PassClass, {...} )
			name = effect.name;
			pass = new effect( );
		}
		else
		{
			throw new Error( `OOPS. The first parameter to addEffect(...) is not a Three.js shader, post-processing pass or pass class. It cannot be processed.` );
		}

		if( this.options.verbose ) console.log(`effect '${name}'`);
		
		pass.name = name;
		pass.id = this.passes.length;
			
		// preprocess fragment shader if needed
		// this is usually done to fix bugs
		if( KB[name] )
		if( KB[name].onLoad )
			KB[name].onLoad( pass, effect );
		
		for( var uniformName of Object.keys(bakedParameters) )
			pass.uniforms[uniformName].value = bakedParameters[uniformName];
			
		//console.log( getGlobalNames( pass, 'fragmentShader', true ) );
			
		this.insertPass( pass, this.passes.length-1 );
		
		return this; // for chaining
		
	} // Effects.addEffect



	addParameter( param1, param2=null, param3=null )
	{
		// case 1: addParameter( uniformName )
		// case 2: addParameter( uniformName, value )
		// case 3: addParameter( publicName, uniformName )
		// case 4: addParameter( publicName, uniformName, value )
		
		let publicName = param1;

		var uniformName, value;
		if( isString(param2?.name) )
		{
			// cases 3 and 4
			uniformName = param2;
			value = param3;
		}
		else
		{
			// cases 1 and 2
			uniformName = param1;
			value = param2;
		}
		
		if( this.options.verbose ) console.log(`\tparameter '${publicName}' (internally '${uniformName}')`);

		if( this.parameters[publicName] )
		{
			throw new Error( `Parameter '${publicName}' is already defined. Use another name or alias for this parameter.` );
		}
		
		var pass = this.passes[this.passes.length-2];
		
		if( !pass.uniforms[uniformName] )
		{
			throw new Error( `There is no parameter '${publicName}' in '${pass.material.name}'.` );
		}
			
		
		this.parameters[publicName] = pass.uniforms[uniformName];
		this.parameters[publicName].oopsParameter = true; // protect from baking


		Object.defineProperty (this, publicName,
			{
				get: function( )
				{ 
					return this.parameters[publicName].value;
				},
				set: function( value )
				{
					this.parameters[publicName].value = value;
				}
			});
		
		if( value !== null )
			this[publicName] = value;
		
		return this; // for chaining
		
	} // Effects.addParameter



	render( scene, camera, deltaTime )
	{
		if( this.needsUpdate ) this.update( );
		
		this.renderPass.scene = scene;
		this.renderPass.camera = camera;
		
		// pass new time to time uniforms
		var time = (Date.now() % (24*60*60))/1000;
		for( var uniform of this.timeUniforms )
		{
			uniform.value = time;
//			console.log(uniform === this.passes[1].uniforms.time_2);
		}
		
		//this.passes[1].uniforms.time_2.value = Math.random();
		
		super.render( deltaTime );

	} // Effects.render
	

	
	// update passes and shaders before renderings
	update( )
	{
		
		if( !this.needsUpdate ) return;
		this.needsUpdate = false;

		this.updateBakeUniforms( );
		this.updateRenameGlobals( );
		this.updateMergePasses( );

		if( this.options.verbose )
		{
			console.group( 'Statistics' );
			for( var [key, value] of Object.entries(this.statistics) )
				console.log( `${value}\t${key}` );
			console.groupEnd( 'Statistics' );
		}
		
		if( this.options.shaders || this.options.uniforms ) showShaders( this );
		
	} // Effects.update	// update passes and shaders before renderings
	
	
	
	// bake all static uniforms that are not textures
	updateBakeUniforms( )
	{
		// process all passes - bake uniforms
		for( var pass of this.passes )
		{
			// bake all static uniforms that are not textures (i.e. null values)
			if( pass.uniforms && pass instanceof ShaderPass )
				for( var uniformName of Object.keys(pass.uniforms) )
				{
					// skip parameters
					if( pass.uniforms[uniformName].oopsParameter ) continue;

					// skip hidden uniforms
					if( KB[pass.material.name] )
					{
						if( KB[pass.material.name].frameSizeName == uniformName ) continue;
						if( KB[pass.material.name].frameSizeXName == uniformName ) continue;
						if( KB[pass.material.name].frameSizeYName == uniformName ) continue;
						if( KB[pass.material.name].frameSizeInverseName == uniformName ) continue;
						if( KB[pass.material.name].frameSizeXInverseName == uniformName ) continue;
						if( KB[pass.material.name].frameSizeYInverseName == uniformName ) continue;
						if( KB[pass.material.name].timeName == uniformName ) continue;
					}
										
					var uniformValue = pass.uniforms[uniformName].value;
					
					// skip parameters with null value, they are textures
					if( uniformValue === null ) continue;
					
					// bake all rest parameters
					if( bakeUniform( pass, 'fragmentShader', uniformName, uniformValue ) )
					{
						renameWord( pass, 'fragmentShader', uniformName, `${uniformName}_${pass.id}` );
						if( this.options.verbose ) console.log( `\tbake '${uniformName}' (internally '${uniformName}_${pass.id}')` );
						this.statistics['removed uniforms']++;
					}
					else
					if( KB[pass.material.name] &&
						KB[pass.material.name].ignoreUniformBaking &&
						KB[pass.material.name].ignoreUniformBaking.indexOf(uniformName)>=-1 )
					{
						// this uniform is known to be unbakeable
						// so ignore the fact that it cannot be baked
					}
					else
					{
						if( this.options.warning ) console.warn( `\twarning '${uniformName}' in ${pass.material.name} cannot be baked` );
					}	
					
				} // for uniformName
		} // for pass
				
	} // Effects.updateBakeUniforms
	
	
	
	// rename all global definitions (before merging)
	updateRenameGlobals( )
	{
		var ident, newIdent;
		
		// process all passes
		for( var pass of this.passes )
		{
			// rename all globals
			for( ident of getGlobalNames( pass, 'fragmentShader', true ) )
			{
				newIdent = `${ident}_${pass.id}`;
				
				// rename global ident
				renameWord( pass, 'fragmentShader', ident, newIdent );
				if( this.options.verbose ) console.log( `\trename '${ident}' to '${newIdent}'` );
			} // for ident
			
			// rename frame size uniforms (if any)
			if( pass.material )
			if( KB[pass.material.name] )
			if( KB[pass.material.name].frameSizeName )
			{
				ident = KB[pass.material.name].frameSizeName;
				newIdent = `${ident}_${pass.id}`;

				// rename ident
				pass.uniforms[newIdent] = pass.uniforms[ident]; // dubplicate uniform
				delete pass.uniforms[ident]; // remove old name
				
				pass.uniforms[newIdent].value.set( this._width, this._height );
				
				this.sizeUniforms.push( pass.uniforms[newIdent] );
				
				renameWord( pass, 'fragmentShader', ident, newIdent );
				
				if( this.options.verbose ) console.log( `\trename '${ident}' to '${newIdent}'` );
			}

			// rename frame inverse size uniforms (if any)
			if( pass.material )
			if( KB[pass.material.name] )
			if( KB[pass.material.name].frameSizeInverseName )
			{
				ident = KB[pass.material.name].frameSizeInverseName;
				newIdent = `${ident}_${pass.id}`;

				// rename ident
				pass.uniforms[newIdent] = pass.uniforms[ident]; // dubplicate uniform
				delete pass.uniforms[ident]; // remove old name
				
				pass.uniforms[newIdent].value.set( 1/this._width, 1/this._height );
				
				this.sizeInverseUniforms.push( pass.uniforms[newIdent] );
				
				renameWord( pass, 'fragmentShader', ident, newIdent );
				
				if( this.options.verbose ) console.log( `\trename '${ident}' to '${newIdent}'` );
			}

			// rename frame size-x uniforms (if any)
			if( pass.material )
			if( KB[pass.material.name] )
			if( KB[pass.material.name].frameSizeXName )
			{
				ident = KB[pass.material.name].frameSizeXName;
				newIdent = `${ident}_${pass.id}`;

				// rename ident
				pass.uniforms[newIdent] = pass.uniforms[ident]; // dubplicate uniform
				delete pass.uniforms[ident]; // remove old name

				pass.uniforms[newIdent].value = this._width;

				this.sizeXUniforms.push( pass.uniforms[newIdent] );
				
				renameWord( pass, 'fragmentShader', ident, newIdent );
				
				if( this.options.verbose ) console.log( `\trename '${ident}' to '${newIdent}'` );
			}

			// rename frame size-y uniforms (if any)
			if( pass.material )
			if( KB[pass.material.name] )
			if( KB[pass.material.name].frameSizeYName )
			{
				ident = KB[pass.material.name].frameSizeYName;
				newIdent = `${ident}_${pass.id}`;

				// rename ident
				pass.uniforms[newIdent] = pass.uniforms[ident]; // dubplicate uniform
				delete pass.uniforms[ident]; // remove old name

				pass.uniforms[newIdent].value = this._height;
				
				this.sizeYUniforms.push( pass.uniforms[newIdent] );
				
				renameWord( pass, 'fragmentShader', ident, newIdent );
				
				if( this.options.verbose ) console.log( `\trename '${ident}' to '${newIdent}'` );
			}

			// rename frame inverse size-x uniforms (if any)
			if( pass.material )
			if( KB[pass.material.name] )
			if( KB[pass.material.name].frameSizeXInverseName )
			{
				ident = KB[pass.material.name].frameSizeXInverseName;
				newIdent = `${ident}_${pass.id}`;

				// rename ident
				pass.uniforms[newIdent] = pass.uniforms[ident]; // dubplicate uniform
				delete pass.uniforms[ident]; // remove old name

				pass.uniforms[newIdent].value = 1/this._width;

				this.sizeXInverseUniforms.push( pass.uniforms[newIdent] );
				
				renameWord( pass, 'fragmentShader', ident, newIdent );
				
				if( this.options.verbose ) console.log( `\trename '${ident}' to '${newIdent}'` );
			}

			// rename frame inverse size-y uniforms (if any)
			if( pass.material )
			if( KB[pass.material.name] )
			if( KB[pass.material.name].frameSizeYInverseName )
			{
				ident = KB[pass.material.name].frameSizeYInverseName;
				newIdent = `${ident}_${pass.id}`;

				// rename ident
				pass.uniforms[newIdent] = pass.uniforms[ident]; // dubplicate uniform
				delete pass.uniforms[ident]; // remove old name

				pass.uniforms[newIdent].value = 1/this._height;
				
				this.sizeYInverseUniforms.push( pass.uniforms[newIdent] );
				
				renameWord( pass, 'fragmentShader', ident, newIdent );
				
				if( this.options.verbose ) console.log( `\trename '${ident}' to '${newIdent}'` );
			}

// TO DO: optimize the next ifs with the previous ifs

			// rename time uniforms (if any)
			if( pass.material )
			if( KB[pass.material.name] )
			if( KB[pass.material.name].timeName )
			{
				ident = KB[pass.material.name].timeName;
				newIdent = `${ident}_${pass.id}`;

				// rename ident
				pass.uniforms[newIdent] = pass.uniforms[ident]; // dubplicate uniform
				delete pass.uniforms[ident]; // remove old name

				this.timeUniforms.push( pass.uniforms[newIdent] );
				
				renameWord( pass, 'fragmentShader', ident, newIdent );
				
				if( this.options.verbose ) console.log( `\trename '${ident}' to '${newIdent}'` );
			}


		} // for pass
				
	} // Effects.updateRenameGlobals
	
	
	
	// attempt to merge passes
	updateMergePasses( )
	{
		if( this.options.merging === false ) return;
		
		// process all passes
		for( var i = this.passes.length-2; i>0; i-- )
		{
			// this = this+that;
			var thisPass = this.passes[i];
			var thatPass = this.passes[i+1];
			
			// currently only simple passes can be handled
			if( !hasSimpleShader( thisPass ) ) continue;
			if( !hasSimpleShader( thatPass ) ) continue;
			
			// are passes compatible
			if( thisPass.material.name == thatPass.material.name )
				if( KB[thisPass.material.name].cannotSelfMerge )
					continue;
			
			if( mergeSimplePasses( thisPass, thatPass, this.options ) )
			{
				if( this.options.verbose ) console.log('merged pass',i+1,'into',i);
				//console.log('@@@@oldpasses',this.passes)
				this.removePass( thatPass );
				this.statistics['removed passes']++;
				this.statistics['removed uniforms']++; // tDiffuse
				this.statistics['removed varyings']++; // vUv
				//console.log('@@@@newpasses',this.passes)
			}
		} // for i
		
	} // Effects.updateMergePasses
	
	
	
	// capture and process resizes
	setSize( width, height )
	{
		// default resize of frames
		super.setSize( width, height );

		// pass new sizes to size uniforms
		for( var uniform of this.sizeUniforms )
			uniform.value.set( width, height );
		for( var uniform of this.sizeXUniforms )
			uniform.value = width;
		for( var uniform of this.sizeYUniforms )
			uniform.value = height;
		for( var uniform of this.sizeInverseUniforms )
			uniform.value.set( 1/width, 1/height );
		for( var uniform of this.sizeXInverseUniforms )
			uniform.value = 1/width;
		for( var uniform of this.sizeYInverseUniforms )
			uniform.value = 1/height;
		
	} // Effects.resize
	
	
} // Effects




export { Effects };
