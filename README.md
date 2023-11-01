# Only One-pass Shader (oops.js)

### “Patience is not the ability to wait, but the ability to keep a good attitude while waiting.”

This is a work in progress.

Be patient.

Please.


# About 

This is a library which attempts to squeeze higher performance from Three.js postprocessing effects, by:

* merging the source codes of several shaders
* embedding static uniforms as shader constants

Additionally, the library makes small adjustment to the shaders properties,
so they are not completely the same as their Three.js counterparts.
  
A very preliminary test with the [webgl_postprocessing](https://threejs.org/examples/?q=post#webgl_postprocessing)
example looks promising. The example uses 4 passes, two of which are `ShaderPass`
using `RGBShiftShader` and `DotScreenShader`. When these two shaders are merged
and their uniforms (except for the texture) are defined as constants, the
performance increases by 50%.


# Supported shaders

### Shaders about colors
[BrightnessContrastShader](#brightnesscontrastshader), [GammaCorrectionShader](#gammacorrectionshader),
[RGBShiftShader](#rgbshiftshader), [SepiaShader](#sepiashader)

### Shaders about shapes
[DotScreenShader](#dotscreenshader), [SobelOperatorShader](#sobeloperatorshader)


## BrightnessContrastShader

A shader that changes the brightness and the contract of a frame.
Shader weight is 1 sweight.
	
* **`brightness`** – amount of color brightness (float, from -1 to 1, default value 0}
* **`contrast`** – amount of color contrast (float, from -1 to 1, default value 0}

Example: [BrightnessContrastShader.html](examples/BrightnessContrastShader.html)
		
[<img src="examples/BrightnessContrastShader.jpg">](examples/BrightnessContrastShader.html)
		



## DotScreenShader

A shader that converts the frame into regularly spread dots.
Shader weight is 1 sweight.
	
* **`scale`** – size of the dots in the pattern (float, default value 1.5}
* **`angle`** – angle of the pattern (float, default value 0)
* **`center`** – center of the pattern (vector, default value THREE.Vector2(0,0))
* **`resolution`** – canvas resolution (vector, default value THREE.Vector2(innerWidth,innerHeight))
* **`opacity`** – shader effect opacity (float, 0.0 to 1.0, default value 1.0) 

Example: [DotScreenShader.html](examples/DotScreenShader.html)
		
[<img src="examples/DotScreenShader.jpg">](examples/DotScreenShader.html)




## GammaCorrectionShader

A shader that applies sRGB electro-optical transfer function (EOTF), which is
approximation of &gamma;=2.2. Shader weight is 1 sweight.
	
* *no parameters*

Example: [GammaCorrectionShader.html](examples/GammaCorrectionShader.html)
		
[<img src="examples/GammaCorrectionShader.jpg">](examples/GammaCorrectionShader.html)
		



## RGBShiftShader

A shader that splits the color components of the frame and shifts them apart.
Shader weight is 3 sweights.

* **`amount`** – amount of shift (float, in NDC space units, default value 0.005)
* **`angle`** – angle of offset (float, in radians, default value 0.0)
* **`opacity`** – shader effect opacity (float, 0.0 to 1.0, default value 1.0) 

Example: [RGBShiftShader.html](examples/RGBShiftShader.html)
		
[<img src="examples/RGBShiftShader.jpg">](examples/RGBShiftShader.html)
		



## SepiaShader

A shader that recolors the frame into sepia hue. Shader weight is 1 sweight.

* **`amount`** – amount of recoloring (float, from 0 to 1, default value 1)

Example: [SepiaShader.html](examples/SepiaShader.html)
		
[<img src="examples/SepiaShader.jpg">](examples/SepiaShader.html)
		



## SobelOperatorShader

A shader that marks the edges of shapes based on the red color component in the frame.
Shader weight is 9 sweights.
	
* **`resolution`** – canvas resolution (vector, default value THREE.Vector2(innerWidth,innerHeight))
* **`opacity`** – shader effect opacity (float, 0.0 to 1.0, default value 1.0) 

Example: [SobelOperatorShader.html](examples/SobelOperatorShader.html)
		
[<img src="examples/SobelOperatorShader.jpg">](examples/SobelOperatorShader.html)
		


# To do

All Three.js shaders from `three/addons/shaders`:

<small>
<small>

 ACESFilmicToneMappingShader
 AfterimageShader BasicShader BleachBypassShader BlendShader BokehShader BokehShader2 <span style="background:palegreen">BrightnessContrastShader</span> ColorCorrectionShader ColorifyShader ConvolutionShader CopyShader DepthLimitedBlurShader DigitalGlitch DOFMipMapShader <span style="background:palegreen">DotScreenShader</span> ExposureShader FilmShader FocusShader FreiChenShader FXAAShader <span style="background:palegreen">GammaCorrectionShader</span> GodRaysShader HalftoneShader HorizontalBlurShader HorizontalTiltShiftShader HueSaturationShader KaleidoShader LuminosityHighPassShader LuminosityShader MirrorShader MMDToonShader NormalMapShader OutputShader <span style="background:palegreen">RGBShiftShader</span> SAOShader <span style="background:palegreen">SepiaShader</span> SMAAShader <span style="background:palegreen">SobelOperatorShader</span> SSAOShader SSRShader SubsurfaceScatteringShader TechnicolorShader ToonShader TriangleBlurShader UnpackDepthRGBAShader VelocityShader VerticalBlurShader VerticalTiltShiftShader VignetteShader VolumeShader WaterRefractionShader
 
</small>
</small>