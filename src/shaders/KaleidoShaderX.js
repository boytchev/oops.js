// Oops.js
//
// KaleidoShaderX.js
//
// Based on Three.js KaleidoShader.js
//
// Modification: fixed aspect


/**
 * Kaleidoscope Shader
 * Radial reflection around center point
 * Ported from: http://pixelshaders.com/editor/
 * by Toby Schachman / http://tobyschachman.com/
 *
 * sides: number of reflections
 * angle: initial angle in radians
 */


import { Vector2 } from 'three';


const KaleidoShaderX = {

	name: 'KaleidoShaderX',

	uniforms: {

		'tDiffuse': { value: null },
		'sides': { value: 6.0 },
		'angle': { value: 0.0 },
		'resolution': { value: new Vector2( 1024, 1024 ) },

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;
		uniform float sides;
		uniform float angle;
		uniform vec2 resolution;

		varying vec2 vUv;

		void main() {

			vec2 p = vUv - 0.5;
			p.x *= resolution.x / resolution.y;
			
			float r = length(p);
			float a = atan(p.y, p.x) + angle;
			float tau = 2. * 3.1416 ;
			
			a = mod(a, tau/sides);
			a = abs(a - tau/sides/2.) ;
			
			p = r * vec2(cos(a), sin(a));
			
			vec4 color = texture2D(tDiffuse, p + 0.5);
			gl_FragColor = color;

		}`

};

export { KaleidoShaderX };
