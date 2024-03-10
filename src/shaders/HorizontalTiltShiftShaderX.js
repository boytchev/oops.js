// Oops.js
//
// HorizontalTiltShiftShaderX.js
//
// Based on Three.js HorizontalTiltShiftShader.js
//
// Modifications: different parameters


const HorizontalTiltShiftShaderX = {

	name: 'HorizontalTiltShiftShaderX',

	uniforms: {

		'tDiffuse': { value: null },
		'h': { value: 1.0 / 512.0 },
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
		uniform float h;
		uniform float position;
		uniform float span;
		uniform float amount;

		varying vec2 vUv;

		void main() {

			vec4 sum = vec4( 0.0 );

			float hh = abs( vUv.y - position );
			
			hh = 3.0 * h * smoothstep( 0.0, 1.0, amount*(hh-span) );

			sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * hh, vUv.y ) ) * 0.051;
			sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * hh, vUv.y ) ) * 0.0918;
			sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * hh, vUv.y ) ) * 0.12245;
			sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * hh, vUv.y ) ) * 0.1531;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
			sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * hh, vUv.y ) ) * 0.1531;
			sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * hh, vUv.y ) ) * 0.12245;
			sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * hh, vUv.y ) ) * 0.0918;
			sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * hh, vUv.y ) ) * 0.051;

			gl_FragColor = sum;

		}`

};

export { HorizontalTiltShiftShaderX };
