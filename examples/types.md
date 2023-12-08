# Shader Types

All shaders have two important characteristics:

* **shader weight** defines how many samplings are done per pixel.
Higher weight indicates slower shader. 

* **shader type**, like blood type, indicates shader compatibility.
Compatible shaders can be merged in a single shader pass. Incompatible
shaders should be splint into different passes.

The table classifies shaders according to their type (base character) and weight (supscript index):

| Type | Weight | Description |
| :--: | :--: | :-- |
| **O** | | These shaders use only the colors in a frame. An O-shader may follow any other shader. |
| | **O<sup>0</sup>** | Basic  |
| | **O<sup>1</sup>** | ACESFilmicToneMapping, BleachBypass, BrightnessContrast, ColorCorrection, Colorify, Copy, DotScreen, Exposure, ExposureExp, Film, GammaCorrection, HueSaturation, Luminosity, LuminosityHighPass, Kaleido, Mirror, Sepia, Technicolor, UnpackDepthRGBA, Vignette |
| | **O<sup>3</sup>** | RGBShift |
| | **O<sup>8</sup>** | Focus |
| | **O<sup>9</sup>** | HorizontalBlur, HorizontalTiltShift, SobelOperator, VerticalBlur, VerticalTiltShift |
| | **O<sup>10</sup>** | FreiChen |
| | **O<sup>15</sup>** | TriangleBlur |
| | **O<sup>109</sup>** | Halftone |
