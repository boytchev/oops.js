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
| **O<sup>0</sup>** | [BasicShader](BasicShader.html)  |
| **O<sup>1</sup>** | [ACESFilmicToneMappingShader](ACESFilmicToneMappingShader.html), [BleachBypassShader](BleachBypassShader.html), [BrightnessContrastShader](BrightnessContrastShader.html), [ColorCorrectionShader](ColorCorrectionShader.html), [ColorifyShader](ColorifyShader.html), [CopyShader](CopyShader.html), [DotScreenShader](DotScreenShader.html), [ExposureShader](ExposureShader.html), [ExposureExpShader](ExposureExpShader.html), [FilmShader](FilmShader.html), [GammaCorrectionShader](GammaCorrectionShader.html), [HueSaturationShader](HueSaturationShader.html), [KaleidoShader](KaleidoShader.html), [LuminosityHighPassShader](LuminosityHighPassShader.html), [LuminosityShader](LuminosityShader.html), [MirrorShader](MirrorShader.html), [SepiaShader](SepiaShader.html), [TechnicolorShader](TechnicolorShader.html), [UnpackDepthRGBAShader](UnpackDepthRGBAShader.html), [VignetteShader](VignetteShader.html) |
| **O<sup>3</sup>** | [RGBShiftShader](RGBShiftShader.html) |
| **O<sup>8</sup>** | [FocusShader](FocusShader.html) |
| **O<sup>9</sup>** | [HorizontalBlurShader](HorizontalBlurShader.html), [HorizontalTiltShiftShader](HorizontalTiltShiftShader.html), [SobelOperatorShader](SobelOperatorShader.html), [VerticalBlurShader](VerticalBlurShader.html), [VerticalTiltShiftShader](VerticalTiltShiftShader.html) |
| **O<sup>10</sup>** | [FreiChenShader](FreiChenShader.html) |
| **O<sup>15</sup>** | [TriangleBlurShader](TriangleBlurShader.html) |
| **O<sup>25</sup>** | [ConvolutionShader](ConvolutionShader.html) |
| **O<sup>109</sup>** | [HalftoneShader](HalftoneShader.html) |
| | (to be continued) |
