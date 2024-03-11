// Oops.js
//
// MotionBlurShaderX.js
//
// Based on Three.js AfterimageShader.js
//
// Modifications: different blending of old and new frames


const MotionBlurShaderX = {

	name: 'MotionBlurShaderX',

	uniforms: {

		'damp': { value: 0.96 },
		'tOld': { value: null },
		'tNew': { value: null }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform float damp;

		uniform sampler2D tOld;
		uniform sampler2D tNew;

		varying vec2 vUv;

		vec4 when_gt( vec4 x, float y ) {

			return max( sign( x - y ), 0.0 );

		}

		void main() {

			vec4 texelOld = texture2D( tOld, vUv );
			vec4 texelNew = texture2D( tNew, vUv );

			gl_FragColor = mix(texelNew, texelOld, damp);

		}`

};

export { MotionBlurShaderX };
