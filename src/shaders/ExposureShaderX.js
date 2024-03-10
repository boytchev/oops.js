// Oops.js
//
// ExposureShaderX.js
//
// Based on Three.js ExposureShaderX.js
//
// Modifications: exposure has a different domain and impact


/**
 * Exposure shader
 */

const ExposureShaderX = {

	name: 'ExposureShaderX',

	uniforms: {

		'tDiffuse': { value: null },
		'exposure': { value: 0.0 }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform float exposure;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );
			gl_FragColor.rgb *= exp( exposure );

		}`

};

export { ExposureShaderX };
