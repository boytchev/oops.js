# Shader Types

All shaders have two important characteristics:

* **shader weight** defines how many samplings are done per pixel.
Higher weight indicates slower shader. 

* **shader type**, like blood type, indicates shader compatibility.
Compatible shaders can be merged in a single shader pass. Incompatible
shaders should be splint into different passes.

The table classifies shaders according to their type (base character) and weight (supscript index):

| Type | Description |
| :--: | :-- |
| **O** | **These shaders use only the colors in a frame. An O-shader may follow any other shader.** |
| **O<sup>0</sup>** | [BasicShader](index.md#basicshader)  |
| **O<sup>1</sup>** | [ACESFilmicToneMappingShader](index.md#acesfilmictonemappingshader), [BleachBypassShader](index.md#bleachbypassshader), [BrightnessContrastShader](index.md#brightnesscontrast), [ColorCorrectionShader](index.md#colorcorrectionshader), [ColorifyShader](index.md#colorifyshader), [CopyShader](index.md#copyshader), [DotScreenShader](index.md#dotscreenshader), [ExposureShader](index.md#exposureshader), [ExposureExpShader](index.md#exposureexpshader), [FilmShader](index.md#filmshader), [GammaCorrectionShader](index.md#gammacorrectionshader), [HueSaturationShader](index.md#huesaturationshader), [KaleidoShader](index.md#kaleidoshader), [LuminosityHighPassShader](index.md#luminosityhighpassshader), [LuminosityShader](index.md#luminosityshader), [MirrorShader](index.md#mirrorshader), [SepiaShader](index.md#sepiashader), [TechnicolorShader](index.md#technicolorshader), [UnpackDepthRGBAShader](index.md#unpackdepthrgbashader), [VignetteShader](index.md#vignetteshader) |
| **O<sup>3</sup>** | [RGBShiftShader](index.md#rgbshiftshader) |
| **O<sup>8</sup>** | [FocusShader](index.md#focusshader) |
| **O<sup>9</sup>** | [HorizontalBlurShader](index.md#horizontalblurshader), [HorizontalTiltShiftShader](index.md#horizontaltiltshiftshader), [SobelOperatorShader](index.md#sobeloperatorshader), [VerticalBlurShader](index.md#verticalblurshader), [VerticalTiltShiftShader](index.md#verticaltiltshiftshader) |
| **O<sup>10</sup>** | [FreiChenShader](index.md#freichenshader) |
| **O<sup>15</sup>** | [TriangleBlurShader](index.md#triangleblurshader) |
| **O<sup>17</sup>** | [FXAAShader](index.md#fxaashader) |
| **O<sup>25</sup>** | [ConvolutionShader](index.md#convolutionshader) |
| **O<sup>109</sup>** | [HalftoneShader](index.md#halftoneshader) |
| | (to be continued) |