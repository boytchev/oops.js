// Oops.js
//
// FilmShaderX.js
//
// Based on Three.js FilmShader.js
//
// Modifications: change noise granulation


const FilmShaderX = {

	name: 'FilmShaderX',

	uniforms: {

		'tDiffuse': { value: null },
		'time': { value: 0.0 },
		'intensity': { value: 0.5 },
		'grayscale': { value: false }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		#include <common>

		uniform float intensity;
		uniform bool grayscale;
		uniform float time;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 base = texture2D( tDiffuse, vUv );

			float noise = rand( fract( vUv + time ) ) + 1.0;

			vec3 color = base.rgb * noise * ( 1.0 - intensity/10.0 );

			color = mix( base.rgb, color, 5.0*intensity );

			if ( grayscale ) {

				color = vec3( luminance( color ) ); // assuming linear-srgb

			}

			gl_FragColor = vec4( color, base.a );

		}`,

};

export { FilmShaderX };
