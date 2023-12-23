﻿/**
 *
 */


const FooterShader = {

	name: 'FooterShader',

	vertexShader: /* glsl */`
	
		varying vec2 vUv;

		void main()	{
			
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( $$(position), 1.0 );
			
		}`,

	fragmentShader: /* glsl */`
	
		void main() {
			
			gl_FragColor = $$( vUv );
			
		}`
		
};


export { FooterShader };