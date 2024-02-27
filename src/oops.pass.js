import {
	ShaderMaterial,
	UniformsUtils
} from 'three';
import { Pass, FullScreenQuad } from './Pass.js';

class OOPSPass extends Pass {

	constructor( shader, textureID ) {

		super();

		this.textureID = ( textureID !== undefined ) ? textureID : 'tDiffuse';
		this.shader = shader;

		if ( shader ) {

			this.uniforms = UniformsUtils.clone( shader.uniforms );

			this.material = new ShaderMaterial( {

				name: ( shader.name !== undefined ) ? shader.name : 'unspecified',
				defines: Object.assign( {}, shader.defines ),
				uniforms: this.uniforms,
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader

			} );

		}

		this.fsQuad = new FullScreenQuad( this.material );

		this.renderList = [];
		for( var sh of shader.shaders )
		{
			if( sh.onRender )
				this.renderList.push( sh.onRender );
		}

	} // OOPSPass.constructor
	
	

	render( renderer, writeBuffer, readBuffer, deltaTime, maskActive ) {


		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer.texture;

		}

		this.fsQuad.material = this.material;

		for( var renderFunc of this.renderList )
			renderFunc( renderer, writeBuffer, readBuffer, deltaTime, maskActive, this );
		
		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			this.fsQuad.render( renderer );

		} else {

			renderer.setRenderTarget( writeBuffer );
			if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
			this.fsQuad.render( renderer );

		}

	} // OOPSPass.render
	
	

	dispose() {

		this.material.dispose();

		this.fsQuad.dispose();

	} // OOPSPass.dispose



} // OOPSPass



export { OOPSPass };
