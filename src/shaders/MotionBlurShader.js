/**
 *
 * Ported and modified from examples/jsm/shaders/AfterimageShader.js
 *
 */
 
 
import {
	Vector2,
	Vector3,
	HalfFloatType,
	MeshBasicMaterial,
	NearestFilter,
	ShaderMaterial,
	UniformsUtils,
	WebGLRenderTarget
} from 'three';
import { Pass, FullScreenQuad } from '../Pass.js';


class MotionBlurPass extends Pass {

	constructor( shader ) {

		super();

		//this.shader = AfterimageShader;
		this.shader = shader;

		this.uniforms = UniformsUtils.clone( this.shader.uniforms );

		this.textureComp = new WebGLRenderTarget( window.innerWidth, window.innerHeight, {
			magFilter: NearestFilter,
			type: HalfFloatType
		} );

		this.textureOld = new WebGLRenderTarget( window.innerWidth, window.innerHeight, {
			magFilter: NearestFilter,
			type: HalfFloatType
		} );

		this.compFsMaterial = new ShaderMaterial( {

			uniforms: this.uniforms,
			vertexShader: this.shader.vertexShader,
			fragmentShader: this.shader.fragmentShader

		} );

		this.compFsQuad = new FullScreenQuad( this.compFsMaterial );

		this.copyFsMaterial = new MeshBasicMaterial();
		this.copyFsQuad = new FullScreenQuad( this.copyFsMaterial );

		this.renderList = [];
		for( var sh of shader.shaders )
		{
			if( sh.onRender )
				this.renderList.push( sh.onRender );
		}
	}

	render( renderer, writeBuffer, readBuffer/*, deltaTime, maskActive*/ ) {

		this.uniforms[ 'tOld' ].value = this.textureOld.texture;
		this.uniforms[ 'tDiffuse' ].value = readBuffer.texture; // originally tDiffuse was tNew

		renderer.setRenderTarget( this.textureComp );
		this.compFsQuad.render( renderer );

		this.copyFsQuad.material.map = this.textureComp.texture;

		for( var renderFunc of this.renderList )
			renderFunc( renderer, writeBuffer, readBuffer, deltaTime, maskActive, this );
		
		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			this.copyFsQuad.render( renderer );

		} else {

			renderer.setRenderTarget( writeBuffer );

			if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );

			this.copyFsQuad.render( renderer );

		}

		// Swap buffers.
		const temp = this.textureOld;
		this.textureOld = this.textureComp;
		this.textureComp = temp;
		// Now textureOld contains the latest image, ready for the next frame.

	}

	setSize( width, height ) {

		this.textureComp.setSize( width, height );
		this.textureOld.setSize( width, height );

	}

	dispose() {

		this.textureComp.dispose();
		this.textureOld.dispose();

		this.compFsMaterial.dispose();
		this.copyFsMaterial.dispose();

		this.compFsQuad.dispose();
		this.copyFsQuad.dispose();

	}

}


const MotionBlurShader = {
	
	type: 'S',
	
	weight: 2,

	uniforms: {
		
		damp: { value: 0.9 },
		tOld: { value: null },
		//tNew: { value: null },  reuse tDiffuse as tNew
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {

			vec4 texelOld = texture2D( tOld, vUv );
			vec4 texelNew = $$( vUv );

			return mix(texelNew, texelOld, damp_$);
			
		}`,
		
	onLoad: /* js */ function( shader, oopsShader )
		{
			oopsShader.addUniform( 'tOld' );
		},
		
	onPass: MotionBlurPass,

};



export { MotionBlurShader };