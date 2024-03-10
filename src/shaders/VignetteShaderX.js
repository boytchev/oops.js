/**
 *
 * Oops.js alternative implementation of Vignette Shader
 *
 */
 

import { Color } from 'three';


const VignetteShaderX = {

	name: 'VignetteShaderX',

	uniforms: {

		'tDiffuse': { value: null },
		'radius': { value: 1.0 },
		'blur': { value: 1.0 },
		'color': { value: new Color(0,0,0) },

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform float radius;
		uniform float blur;
		uniform vec3 color;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			// Boytchev's vignette

			vec4 texel = texture2D( tDiffuse, vUv );
			
			float dist = 1.0 - length( 2.0*vUv - vec2(1) );
			float k = smoothstep( 1.0-radius, 1.0-radius+blur, dist);
			
			gl_FragColor = vec4( mix( color, texel.rgb, k) , texel.a );

		}`

};

export { VignetteShaderX };
