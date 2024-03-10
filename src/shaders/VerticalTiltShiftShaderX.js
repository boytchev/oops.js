// Oops.js
//
// HorizontalTiltShiftShaderX.js
//
// Based on Three.js HorizontalTiltShiftShader.js
//
// Modifications: different parameters


const VerticalTiltShiftShaderX = {

	name: 'VerticalTiltShiftShaderX',

	uniforms: {

		'tDiffuse': { value: null },
		'v': { value: 1.0 / 512.0 },
		'position': { value: 0.5 },
		'span': { value: 0 },
		'amount': { value: 1.5 },

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;
		uniform float v;
		uniform float position;
		uniform float span;
		uniform float amount;

		varying vec2 vUv;

		void main() {

			vec4 sum = vec4( 0.0 );

			float vv = abs( vUv.y - position );
			
			vv = 3.0 * v * smoothstep( 0.0, 1.0, amount*(vv-span) );

			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * vv ) ) * 0.051;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * vv ) ) * 0.0918;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * vv ) ) * 0.12245;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * vv ) ) * 0.1531;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * vv ) ) * 0.1531;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * vv ) ) * 0.12245;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * vv ) ) * 0.0918;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * vv ) ) * 0.051;

			gl_FragColor = sum;

		}`

};

export { VerticalTiltShiftShaderX };
