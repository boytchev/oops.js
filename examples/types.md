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
| **O<sup>0</sup>** | [BasicShader](#basicshader)  |
| **O<sup>1</sup>** | [ACESFilmicToneMappingShader](#acesfilmictonemappingshader), [BleachBypassShader](#bleachbypassshader), [BrightnessContrastShader](#brightnesscontrast), [ColorCorrectionShader](#colorcorrectionshader), [ColorifyShader](#colorifyshader), [CopyShader](#copyshader), [DotScreenShader](#dotscreenshader), [ExposureShader](#exposureshader), [ExposureExpShader](#exposureexpshader), [FilmShader](#filmshader), [GammaCorrectionShader](#gammacorrectionshader), [HueSaturationShader](#huesaturationshader), [KaleidoShader](#kaleidoshader), [LuminosityHighPassShader](#luminosityhighpassshader), [LuminosityShader](#luminosityshader), [MirrorShader](#mirrorshader), [SepiaShader](#sepiashader), [TechnicolorShader](#technicolorshader), [UnpackDepthRGBAShader](#unpackdepthrgbashader), [VignetteShader](#vignetteshader) |
| **O<sup>3</sup>** | [RGBShiftShader](#rgbshiftshader) |
| **O<sup>8</sup>** | [FocusShader](#focusshader) |
| **O<sup>9</sup>** | [HorizontalBlurShader](#horizontalblurshader), [HorizontalTiltShiftShader](#horizontaltiltshiftshader), [SobelOperatorShader](#sobeloperatorshader), [VerticalBlurShader](#verticalblurshader), [VerticalTiltShiftShader](#verticaltiltshiftshader) |
| **O<sup>10</sup>** | [FreiChenShader](#freichenshader) |
| **O<sup>15</sup>** | [TriangleBlurShader](#triangleblurshader) |
| **O<sup>109</sup>** | [HalftoneShader](#halftoneshader) |
| | (to be continued) |
