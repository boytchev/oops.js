﻿/**
 *
 * Ported from examples/jsm/shaders/FreiChenShader.js
 *
 */
 
 
import { Vector2 } from 'three';


const FreiChenShader = {
	
	type: 'O',
	
	weight: 10,

	uniforms: {
		
		resolution: { value: new Vector2(innerWidth,innerHeight) },
		opacity:  { value: 1.0 },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv )
		{
			mat3 G[9];

			// hard coded matrix values!!!! as suggested in https://github.com/neilmendoza/ofxPostProcessing/blob/master/src/EdgePass.cpp#L45

			const mat3 g0 = mat3( 0.3535533845424652, 0, -0.3535533845424652, 0.5, 0, -0.5, 0.3535533845424652, 0, -0.3535533845424652 );
			const mat3 g1 = mat3( 0.3535533845424652, 0.5, 0.3535533845424652, 0, 0, 0, -0.3535533845424652, -0.5, -0.3535533845424652 );
			const mat3 g2 = mat3( 0, 0.3535533845424652, -0.5, -0.3535533845424652, 0, 0.3535533845424652, 0.5, -0.3535533845424652, 0 );
			const mat3 g3 = mat3( 0.5, -0.3535533845424652, 0, -0.3535533845424652, 0, 0.3535533845424652, 0, 0.3535533845424652, -0.5 );
			const mat3 g4 = mat3( 0, -0.5, 0, 0.5, 0, 0.5, 0, -0.5, 0 );
			const mat3 g5 = mat3( -0.5, 0, 0.5, 0, 0, 0, 0.5, 0, -0.5 );
			const mat3 g6 = mat3( 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.6666666865348816, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204 );
			const mat3 g7 = mat3( -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, 0.6666666865348816, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408 );
			const mat3 g8 = mat3( 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408 );

			vec2 texel = vec2( 1.0 / resolution_$.x, 1.0 / resolution_$.y );

			G[0] = g0,
			G[1] = g1,
			G[2] = g2,
			G[3] = g3,
			G[4] = g4,
			G[5] = g5,
			G[6] = g6,
			G[7] = g7,
			G[8] = g8;

			mat3 I;
			float cnv[9];
			vec3 sampleRGB;

		/* fetch the 3x3 neighbourhood and use the RGB vector's length as intensity value */
			for (float i=0.0; i<3.0; i++) {
				for (float j=0.0; j<3.0; j++) {
					sampleRGB = $$( vUv + texel * vec2(i-1.0,j-1.0) ).rgb;
					I[int(i)][int(j)] = length(sampleRGB);
				}
			}

		/* calculate the convolution values for all the masks */
			for (int i=0; i<9; i++) {
				float dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);
				cnv[i] = dp3 * dp3;
			}

			float M = (cnv[0] + cnv[1]) + (cnv[2] + cnv[3]);
			float S = (cnv[4] + cnv[5]) + (cnv[6] + cnv[7]) + (cnv[8] + M);

			return mix( $$(vUv), vec4(vec3(sqrt(M/S)), 1.0), opacity_$ );
			
		}`
		
};


export { FreiChenShader };