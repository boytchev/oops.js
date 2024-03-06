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

import { isShader, bakeUniform, renameWord, showShaders } from './oops.utils.js';



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
			
			for( var uniformName of Object.keys(bakedParameters) )
				pass.uniforms[uniformName].value = bakedParameters[uniformName];
				
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
			throw new Error( `Parameter '${publicName}' is already defined. Use another name with .addParameter('...','${publicName}',...)` );
		}
		
		this.parameters[publicName] = this.passes[this.passes.length-2].uniforms[uniformName];
		this.parameters[publicName].oopsParameter = true; // protect from baking

//console.log(this.parameters[publicName])

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

		// bake all static uniforms that are not textures (i.e. null values)
		for( var pass of this.passes )
		{
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
					{
						if( this.options.warning ) console.warn( `\twarning '${uniformName}' in ${pass.material.name} cannot be baked` );
					}	
					
				} // for uniformName
		} // for pass
		

		if( this.options.verbose ) console.log( 'updateEffects', this.statistics );
		
		if( this.options.shaders || this.options.uniforms ) showShaders( this );
		
		
	} // Effects.update
	
	
} // Effects




export { Effects };
