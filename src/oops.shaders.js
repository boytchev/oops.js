import * as THREE from 'three';

import {HeaderShader} from './shaders/HeaderShader.js';
import {FooterShader} from './shaders/FooterShader.js';
import {RGBShiftShader} from './shaders/RGBShiftShader.js';
import {DotScreenShader} from './shaders/DotScreenShader.js';
import {SepiaShader} from './shaders/SepiaShader.js';
import {BrightnessContrastShader} from './shaders/BrightnessContrastShader.js';
import {SobelOperatorShader} from './shaders/SobelOperatorShader.js';
import {GammaCorrectionShader} from './shaders/GammaCorrectionShader.js';
import {ColorCorrectionShader} from './shaders/ColorCorrectionShader.js';
import {ExposureShader} from './shaders/ExposureShader.js';
import {ExposureExpShader} from './shaders/ExposureExpShader.js';
import {FreiChenShader} from './shaders/FreiChenShader.js';
import {HorizontalBlurShader} from './shaders/HorizontalBlurShader.js';
import {VerticalBlurShader} from './shaders/VerticalBlurShader.js';
import {VignetteShader} from './shaders/VignetteShader.js';
import {BleachBypassShader} from './shaders/BleachBypassShader.js';
import {MirrorShader} from './shaders/MirrorShader.js';
import {KaleidoShader} from './shaders/KaleidoShader.js';
import {TechnicolorShader} from './shaders/TechnicolorShader.js';
import {ColorifyShader} from './shaders/ColorifyShader.js';
import {HueSaturationShader} from './shaders/HueSaturationShader.js';
import {LuminosityShader} from './shaders/LuminosityShader.js';
import {LuminosityHighPassShader} from './shaders/LuminosityHighPassShader.js';
import {HorizontalTiltShiftShader} from './shaders/HorizontalTiltShiftShader.js';
import {VerticalTiltShiftShader} from './shaders/VerticalTiltShiftShader.js';
import {TriangleBlurShader} from './shaders/TriangleBlurShader.js';
import {BasicShader} from './shaders/BasicShader.js';
import {FilmShader} from './shaders/FilmShader.js';
import {FocusShader} from './shaders/FocusShader.js';
import {ACESFilmicToneMappingShader} from './shaders/ACESFilmicToneMappingShader.js';
import {CopyShader} from './shaders/CopyShader.js';
import {UnpackDepthRGBAShader} from './shaders/UnpackDepthRGBAShader.js';
import {HalftoneShader} from './shaders/HalftoneShader.js';
import {ConvolutionShader} from './shaders/ConvolutionShader.js';
import {FXAAShader} from './shaders/FXAAShader.js';


const SHADERS = {
		FooterShader: 				FooterShader,
		HeaderShader: 				HeaderShader,
		RGBShiftShader:			 	RGBShiftShader,
		DotScreenShader: 			DotScreenShader,
		SepiaShader:				SepiaShader,
		SobelOperatorShader:		SobelOperatorShader,
		GammaCorrectionShader:		GammaCorrectionShader,
		BrightnessContrastShader: 	BrightnessContrastShader,
		ColorCorrectionShader:		ColorCorrectionShader,
		ExposureShader:				ExposureShader,
		ExposureExpShader:			ExposureExpShader,
		FreiChenShader:				FreiChenShader,
		HorizontalBlurShader:		HorizontalBlurShader,
		VerticalBlurShader:			VerticalBlurShader,
		VignetteShader:				VignetteShader,
		BleachBypassShader:			BleachBypassShader,
		MirrorShader:				MirrorShader,
		KaleidoShader:				KaleidoShader,
		ColorifyShader:				ColorifyShader,
		TechnicolorShader:			TechnicolorShader,
		HueSaturationShader:		HueSaturationShader,
		LuminosityShader:			LuminosityShader,
		LuminosityHighPassShader:	LuminosityHighPassShader,
		HorizontalTiltShiftShader:	HorizontalTiltShiftShader,
		VerticalTiltShiftShader:	VerticalTiltShiftShader,
		TriangleBlurShader:			TriangleBlurShader,
		BasicShader:				BasicShader,
		FilmShader:					FilmShader,
		FocusShader:				FocusShader,
		ACESFilmicToneMappingShader:ACESFilmicToneMappingShader,
		CopyShader:					CopyShader,
		UnpackDepthRGBAShader:		UnpackDepthRGBAShader,
		HalftoneShader:				HalftoneShader,
		ConvolutionShader:			ConvolutionShader,
		FXAAShader:					FXAAShader,
}


export {SHADERS};
