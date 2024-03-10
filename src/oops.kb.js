/*
	OOPS Effects KnowledgeBase
	
	KB = {
		shadername: {
			ignoreUniformBaking: [string,string,...],	// do not bake uniforms with these names
			defaultTextureName: string,					// default texture uniform name (or 'tDiffuse' if not defined)
			defaultUVCoordName: string,					// default UV coordinates name (or 'vUv' if not defined)
			simpleShader: boolean,						// if true, shader uses tDiffuse, vUv and has no passes
			cannotSelfMerge: boolean,					// if true, shader cannot merge with itself in a single shader
			onLoad: function(pass,effect), // called after loading a fragment shader
			frameSizeName: string,						// name of uniform bound to frame/screen size in pixels
			frameSizeXName: string,						// name of uniform bound to frame/screen width in pixels
			frameSizeYName: string,						// name of uniform bound to frame/screen height in pixels
			frameSizeInverseName: string,				// name of uniform bound to frame/screen reciprocal size in pixels
			frameSizeXInverseName: string,				// name of uniform bound to frame/screen reciprocal width in pixels
			frameSizeYInverseName: string,				// name of uniform bound to frame/screen reciprocal height in pixels
			timeName: string,							// name of uniform bound to time in milliseconds
			onLoad: function(pass),						// function to call when a pass is loaded
		}
	}
*/


import { renameWord, renameText } from './oops.utils.js';


const KB = {

	/*------------------------------------------------------
		The OuputShader defines toneMappingExposure not in
		the shade code, but in include file, so it is not
		possible to bake its value in the shader code.
	*/
	OutputShader: {
		simpleShader: false,
		ignoreUniformBaking: ['toneMappingExposure'],
	},

	
	/*------------------------------------------------------
		The fragment shader of FreiChenShader contains:
			vec3 sample;
		which causes:
			ERROR: 0:95: 'sample' : Illegal use of reserved word
		Also this:
			vec2 texel = vec2( 1.0 / aspect.x, 1.0 / aspect.y );
		causes:
			ERROR: 0:63: '=' : global variable initializers must be constant expressions
	*/
	FreiChenShader: {
		frameSizeName: 'aspect',
		onLoad: onLoadFreiChenShader,
	},

	
	DotScreenShader: {
		frameSizeName: 'tSize',
		onLoad: onLoadDotScreenShader,
	},

	
	DotScreenShaderX: {
		frameSizeName: 'tSize',
		onLoad: onLoadDotScreenShader,
	},

	
	FilmShader: {
		timeName: 'time',
		onLoad: onLoadFilmShader,
	},

	
	FilmShaderX: {
		timeName: 'time',
		onLoad: onLoadFilmShader,
	},

	
	LuminosityShader: {
		onLoad: onLoadLuminosityShader,
	},

	
	FocusShader: {
		frameSizeXName: 'screenWidth',
		frameSizeYName: 'screenHeight',
	},

	
	FXAAShader: {
		frameSizeInverseName: 'resolution',
		onLoad: onLoadFXAAShader,
		cannotSelfMerge: true,
	},


	SobelOperatorShader: {
		frameSizeName: 'resolution',
	},


	KaleidoShaderX: {
		frameSizeName: 'resolution',
	},


	HalftoneShader: {
		frameSizeXName: 'width',
		frameSizeYName: 'height',
		cannotSelfMerge: true,
		defaultUVCoordName: 'vUV',
	},


	HorizontalBlurShader: {
		frameSizeXInverseName: 'h',
	},


	HorizontalBlurShaderX: {
		frameSizeXInverseName: 'h',
	},


	HorizontalTiltShiftShader: {
		frameSizeXInverseName: 'h',
	},


	HorizontalTiltShiftShaderX: {
		frameSizeXInverseName: 'h',
	},


	/*------------------------------------------------------
		The fragment shader of TriangleBlurShader contains:
			uniform sampler2D texture;
		which later on causes:
			ERROR: 0:160: 'texture' : function name expected
	*/
	TriangleBlurShader: {
		defaultTextureName: 'uTexture',
		cannotSelfMerge: true,
		onLoad: onLoadTriangleBlurShader,
	},
	
	
	VerticalBlurShader: {
		frameSizeYInverseName: 'v',
	},


	VerticalBlurShaderX: {
		frameSizeYInverseName: 'v',
	},


	VerticalTiltShiftShader: {
		frameSizeYInverseName: 'v',
	},
	
	
	VerticalTiltShiftShaderX: {
		frameSizeYInverseName: 'v',
	},
	
	
	UnpackDepthRGBAShader: {
		onLoad: onLoadUnpackDepthRGBAShader,
	},
	
	
	ConvolutionShader: {
		onLoad: onLoadConvolutionShader,
	}
	
}


function onLoadFreiChenShader( pass, effect )
{
	renameWord( pass, 'fragmentShader', 'sample', 'sampleRGB' );
	renameText( pass, 'fragmentShader', 'float pattern()', 'float pattern(vec2 vUv)'  );
	
	var texel = 'vec2 texel = vec2( 1.0 / aspect.x, 1.0 / aspect.y );';
	renameText( pass, 'fragmentShader', texel, '' );
	renameText( pass, 'fragmentShader', 'vec3 sampleRGB;', 'vec3 sampleRGB;\n\t\t'+texel );
	
}


function onLoadDotScreenShader( pass, effect )
{
	renameText( pass, 'fragmentShader', 'float pattern()', 'float pattern(vec2 vUv)'  );
	renameText( pass, 'fragmentShader', '+ pattern()', '+ pattern(vUv)'  );
}


function onLoadFilmShader( pass, effect )
{
	renameText( pass, 'fragmentShader', '#include <common>', `
		#ifndef OOPS_INCLUDE_COMMON
			#define OOPS_INCLUDE_COMMON
			#include <common>
		#endif
` );
}


function onLoadLuminosityShader( pass, effect )
{
	renameText( pass, 'fragmentShader', '#include <common>', `
		#ifndef OOPS_INCLUDE_COMMON
			#define OOPS_INCLUDE_COMMON
			#include <common>
		#endif
` );
}


function onLoadFXAAShader( pass, effect )
{
	renameText( pass, 'fragmentShader', '#define NUM_SAMPLES 5', `
		#ifndef OOPS_FXAA_NUM_SAMPLES
			#define OOPS_FXAA_NUM_SAMPLES
			#define NUM_SAMPLES 5
		#endif
` );
	renameWord( pass, 'fragmentShader', 'NUM_SAMPLES', 'FXAA_NUM_SAMPLES' );
}


function onLoadUnpackDepthRGBAShader( pass, effect )
{
	renameText( pass, 'fragmentShader', '#include <packing>', `
		#ifndef OOPS_INCLUDE_PACKING
			#define OOPS_INCLUDE_PACKING
			#include <packing>
		#endif
` );
}


function onLoadTriangleBlurShader( pass, effect )
{
	// rename uniform 'texture' -> 'uTexture'
	pass.uniforms['uTexture'] = {value: null};
	pass.material.uniforms['uTexture'] = {value: null};
	
	delete pass.uniforms['texture']
	delete pass.material.uniforms['texture']
	
	renameWord( pass, 'fragmentShader', 'texture', 'uTexture' );
	renameText( pass, 'fragmentShader', '#include <common>', `
		#ifndef OOPS_INCLUDE_COMMON
			#define OOPS_INCLUDE_COMMON
			#include <common>
		#endif
` );
}


function onLoadConvolutionShader( pass, effect )
{
	pass.material.uniforms.cKernel.value = effect.buildKernel( 4 );
}


export { KB };
