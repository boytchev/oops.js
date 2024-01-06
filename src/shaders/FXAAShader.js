/**
 *
 * Ported from examples/jsm/shaders/FXAAShader.js
 *
 */
 
 
import { Vector2 } from 'three';


const FXAAShader = {
	
	type: 'O',
	
	weight: 17,

	uniforms: {

		resolution: { value: new Vector2( innerWidth, innerHeight ) },
		disable: { value: false }

	},


	fragmentShader: /* glsl */`
	
		precision highp float;

		// FXAA 3.11 implementation by NVIDIA, ported to WebGL by Agost Biro (biro@archilogic.com)

		//----------------------------------------------------------------------------------
		// File:        es3-kepler\FXAA\assets\shaders/FXAA_DefaultES.frag
		// SDK Version: v3.00
		// Email:       gameworks@nvidia.com
		// Site:        http://developer.nvidia.com/
		//
		// Copyright (c) 2014-2015, NVIDIA CORPORATION. All rights reserved.
		//
		// Redistribution and use in source and binary forms, with or without
		// modification, are permitted provided that the following conditions
		// are met:
		//  * Redistributions of source code must retain the above copyright
		//    notice, this list of conditions and the following disclaimer.
		//  * Redistributions in binary form must reproduce the above copyright
		//    notice, this list of conditions and the following disclaimer in the
		//    documentation and/or other materials provided with the distribution.
		//  * Neither the name of NVIDIA CORPORATION nor the names of its
		//    contributors may be used to endorse or promote products derived
		//    from this software without specific prior written permission.
		//
		// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS ''AS IS'' AND ANY
		// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
		// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
		// PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
		// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
		// EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
		// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
		// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
		// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
		// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
		// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
		//
		//----------------------------------------------------------------------------------

		#ifndef FXAA_DISCARD_$
				//
				// Only valid for PC OpenGL currently.
				// Probably will not work when FXAA_GREEN_AS_LUMA = 1.
				//
				// 1 = Use discard on pixels which don't need AA.
				//     For APIs which enable concurrent TEX+ROP from same surface.
				// 0 = Return unchanged color on pixels which don't need AA.
				//
				#define FXAA_DISCARD_$ 0
		#endif

		/*--------------------------------------------------------------------------*/
		#define FxaaTexTop_$(p) $$(p/*, -100.0*/)
		#define FxaaTexOff_$(p, o, r) $$(p + (o * r)/*, -100.0*/)
		/*--------------------------------------------------------------------------*/

		#define NUM_SAMPLES_$ 5

		// assumes colors have premultipliedAlpha, so that the calculated color contrast is scaled by alpha
		float contrast_$( vec4 a, vec4 b ) {
				vec4 diff = abs( a - b );
				return max( max( max( diff.r, diff.g ), diff.b ), diff.a );
		}

		/*============================================================================

										FXAA3 QUALITY - PC

		============================================================================*/

		/*--------------------------------------------------------------------------*/
		vec4 FxaaPixelShader_$(
				vec2 posM,
				vec2 fxaaQualityRcpFrame,
				float fxaaQualityEdgeThreshold,
				float fxaaQualityinvEdgeThreshold
		) {
				vec4 rgbaM = FxaaTexTop_$(posM);
				vec4 rgbaS = FxaaTexOff_$(posM, vec2( 0.0, 1.0), fxaaQualityRcpFrame.xy);
				vec4 rgbaE = FxaaTexOff_$(posM, vec2( 1.0, 0.0), fxaaQualityRcpFrame.xy);
				vec4 rgbaN = FxaaTexOff_$(posM, vec2( 0.0,-1.0), fxaaQualityRcpFrame.xy);
				vec4 rgbaW = FxaaTexOff_$(posM, vec2(-1.0, 0.0), fxaaQualityRcpFrame.xy);
				// . S .
				// W M E
				// . N .

				bool earlyExit = max( max( max(
						contrast_$( rgbaM, rgbaN ),
						contrast_$( rgbaM, rgbaS ) ),
						contrast_$( rgbaM, rgbaE ) ),
						contrast_$( rgbaM, rgbaW ) )
						< fxaaQualityEdgeThreshold;
				// . 0 .
				// 0 0 0
				// . 0 .

				#if (FXAA_DISCARD_$ == 1)
						if(earlyExit) FxaaDiscard;
				#else
						if(earlyExit) return rgbaM;
				#endif

				float contrastN = contrast_$( rgbaM, rgbaN );
				float contrastS = contrast_$( rgbaM, rgbaS );
				float contrastE = contrast_$( rgbaM, rgbaE );
				float contrastW = contrast_$( rgbaM, rgbaW );

				float relativeVContrast = ( contrastN + contrastS ) - ( contrastE + contrastW );
				relativeVContrast *= fxaaQualityinvEdgeThreshold;

				bool horzSpan = relativeVContrast > 0.;
				// . 1 .
				// 0 0 0
				// . 1 .

				// 45 deg edge detection and corners of objects, aka V/H contrast is too similar
				if( abs( relativeVContrast ) < .3 ) {
						// locate the edge
						vec2 dirToEdge;
						dirToEdge.x = contrastE > contrastW ? 1. : -1.;
						dirToEdge.y = contrastS > contrastN ? 1. : -1.;
						// . 2 .      . 1 .
						// 1 0 2  ~=  0 0 1
						// . 1 .      . 0 .

						// tap 2 pixels and see which ones are "outside" the edge, to
						// determine if the edge is vertical or horizontal

						vec4 rgbaAlongH = FxaaTexOff_$(posM, vec2( dirToEdge.x, -dirToEdge.y ), fxaaQualityRcpFrame.xy);
						float matchAlongH = contrast_$( rgbaM, rgbaAlongH );
						// . 1 .
						// 0 0 1
						// . 0 H

						vec4 rgbaAlongV = FxaaTexOff_$(posM, vec2( -dirToEdge.x, dirToEdge.y ), fxaaQualityRcpFrame.xy);
						float matchAlongV = contrast_$( rgbaM, rgbaAlongV );
						// V 1 .
						// 0 0 1
						// . 0 .

						relativeVContrast = matchAlongV - matchAlongH;
						relativeVContrast *= fxaaQualityinvEdgeThreshold;

						if( abs( relativeVContrast ) < .3 ) { // 45 deg edge
								// 1 1 .
								// 0 0 1
								// . 0 1

								// do a simple blur
								return mix(
										rgbaM,
										(rgbaN + rgbaS + rgbaE + rgbaW) * .25,
										.4
								);
						}

						horzSpan = relativeVContrast > 0.;
				}

				if(!horzSpan) rgbaN = rgbaW;
				if(!horzSpan) rgbaS = rgbaE;
				// . 0 .      1
				// 1 0 1  ->  0
				// . 0 .      1

				bool pairN = contrast_$( rgbaM, rgbaN ) > contrast_$( rgbaM, rgbaS );
				if(!pairN) rgbaN = rgbaS;

				vec2 offNP;
				offNP.x = (!horzSpan) ? 0.0 : fxaaQualityRcpFrame.x;
				offNP.y = ( horzSpan) ? 0.0 : fxaaQualityRcpFrame.y;

				bool doneN = false;
				bool doneP = false;

				float nDist = 0.;
				float pDist = 0.;

				vec2 posN = posM;
				vec2 posP = posM;

				int iterationsUsed = 0;
				int iterationsUsedN = 0;
				int iterationsUsedP = 0;
				for( int i = 0; i < NUM_SAMPLES_$; i++ ) {
						iterationsUsed = i;

						float increment = float(i + 1);

						if(!doneN) {
								nDist += increment;
								posN = posM + offNP * nDist;
								vec4 rgbaEndN = FxaaTexTop_$(posN.xy);
								doneN = contrast_$( rgbaEndN, rgbaM ) > contrast_$( rgbaEndN, rgbaN );
								iterationsUsedN = i;
						}

						if(!doneP) {
								pDist += increment;
								posP = posM - offNP * pDist;
								vec4 rgbaEndP = FxaaTexTop_$(posP.xy);
								doneP = contrast_$( rgbaEndP, rgbaM ) > contrast_$( rgbaEndP, rgbaN );
								iterationsUsedP = i;
						}

						if(doneN || doneP) break;
				}


				if ( !doneP && !doneN ) return rgbaM; // failed to find end of edge

				float dist = min(
						doneN ? float( iterationsUsedN ) / float( NUM_SAMPLES_$ - 1 ) : 1.,
						doneP ? float( iterationsUsedP ) / float( NUM_SAMPLES_$ - 1 ) : 1.
				);

				// hacky way of reduces blurriness of mostly diagonal edges
				// but reduces AA quality
				dist = pow(dist, .5);

				dist = 1. - dist;

				return mix(
						rgbaM,
						rgbaN,
						dist * .5
				);
		}

		vec4 $( vec2 vUv ) {
			
			if( disable_$ )
			{
				return $$( vUv );
			}
			
			const float edgeDetectionQuality = .2;
			const float invEdgeDetectionQuality = 1. / edgeDetectionQuality;

			return FxaaPixelShader_$(
					vUv,
					vec2(1.)/resolution,
					edgeDetectionQuality, // [0,1] contrast needed, otherwise early discard
					invEdgeDetectionQuality
			);

		}`

};

export { FXAAShader };
