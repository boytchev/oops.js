// Oops.js
//
// ColorifyShaderX.js
//
// Based on Three.js ColorifyShaderX.js
//
// Modification: added opacity


import {
	Color
} from 'three';

/**
 * Colorify shader
 */

const ColorifyShaderX = {

	name: 'ColorifyShaderX',

	uniforms: {

		'tDiffuse': { value: null },
		'color': { value: new Color( 0xffffff ) },
		'opacity': { value: 1.0 }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform vec3 color;
		uniform float opacity;
		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );
			float v = dot( texel.xyz, luma );

			gl_FragColor = mix( texel, vec4( v * color, texel.w ), opacity );

		}`

};

export { ColorifyShaderX };
