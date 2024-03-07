/*
	class Effects:EffectComposer( renderer, options={} )
	
		.addEffect( effect, bakedParameters={} )
		.render( scene, camera, deltaTime )
*/

import { Vector2, Vector3, Color } from 'three';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import { isShader, bakeUniform, renameWord, getGlobalNames, showShaders, hasSimpleShader, mergeSimplePasses } from './oops.utils.js';
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
		
		this.statistics = {
			reducedUniforms: 0,
		}
		
		this.needsUpdate = true;
		
	} // Effects.constructor
	
	

	addEffect( effect, bakedParameters={} )
	{
		this.needsUpdate = true;
		
		if( isShader(effect) )
		{
			if( this.options.verbose ) console.log(`effect '${effect.name}'`);
			
			var pass = new ShaderPass( effect );
			pass.id = this.passes.length;
			
			// preprocess fragment shader if needed
			// this is usually done to fix bugs
			if( KB[effect.name] )
			if( KB[effect.name].fragmentPreprocessing )
				KB[effect.name].fragmentPreprocessing( pass );
			
			for( var uniformName of Object.keys(bakedParameters) )
				pass.uniforms[uniformName].value = bakedParameters[uniformName];
			
			//console.log( getGlobalNames( pass, 'fragmentShader', true ) );
				
			this.insertPass( pass, this.passes.length-1 );
			
			return this; // for chaining
		}
		
		throw new Error( `OOPS. The first parameter to addEffect(...) is not a classic Three.js shader. It cannot be processed.` );
		
	} // Effects.addEffect



	addParameter( param1, param2=null, param3=null )
	{
		// case 1: addParameter( uniformName )
		// case 2: addParameter( uniformName, value )
		// case 3: addParameter( publicName, uniformName )
		// case 4: addParameter( publicName, uniformName, value )
		
		let publicName = param1;

		var uniformName, value;
		if( param2?.constructor.name === 'String' )
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
		
		this.parameters[publicName] = this.passes[this.passes.length-2].uniforms[uniformName];
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

		if( this.options.verbose ) console.log( 'updateEffects', this.statistics );
		
		if( this.options.shaders || this.options.uniforms ) showShaders( this );
		
		
	} // Effects.update	// update passes and shaders before renderings
	
	
	
	// bake all static uniforms that are not textures
	updateBakeUniforms( )
	{
		// process all passes - bake uniforms
		for( var pass of this.passes )
		{
			// bake all static uniforms that are not textures (i.e. null values)
			if( pass.uniforms )
				for( var uniformName of Object.keys(pass.uniforms) )
				{
					// skip parameters
					if( pass.uniforms[uniformName].oopsParameter ) continue;
					
					var uniformValue = pass.uniforms[uniformName].value;
					
					// skip parameters with null value, they are textures
					if( uniformValue === null ) continue;
					
					// bake all rest parameters
					if( bakeUniform( pass, 'fragmentShader', uniformName, uniformValue ) )
					{
						renameWord( pass, 'fragmentShader', uniformName, `${uniformName}_${pass.id}` );
						if( this.options.verbose ) console.log( `\tbake '${uniformName}' (internally '${uniformName}_${pass.id}')` );
						this.statistics.reducedUniforms++;
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
	
	
	
	// rename all global definitions
	updateRenameGlobals( )
	{
		// process all passes
		for( var pass of this.passes )
		{
			// rename all globals
			for( var ident of getGlobalNames( pass, 'fragmentShader', true ) )
			{
				// rename global ident
				renameWord( pass, 'fragmentShader', ident, `${ident}_${pass.id}` );
				if( this.options.verbose ) console.log( `\trename '${ident}' to '${ident}_${pass.id}'` );
			} // for ident
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
			
			if( mergeSimplePasses( thisPass, thatPass, this.options ) )
			{
				if( this.options.verbose ) console.log('merged pass',i+1,'into',i);
				//console.log('@@@@oldpasses',this.passes)
				this.removePass( thatPass );
				//console.log('@@@@newpasses',this.passes)
			}
		} // for i
				
	} // Effects.updateMergePasses
	
	
} // Effects




export { Effects };
