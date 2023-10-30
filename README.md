# Only One-pass Shader (oops.js)

### “Patience is not the ability to wait, but the ability to keep a good attitude while waiting.”

This is a library which attempts to squeeze higher performance from Three.js postprocessing effects, by:

* merging the source codes of several shaders
* embedding static uniforms as shader constants
  
A very preliminary test with the [webgl_postprocessing](https://threejs.org/examples/?q=post#webgl_postprocessing)
example looks promising. The example uses 4 passes, two of which are `ShaderPass`
using `RGBShiftShader` and `DotScreenShader`. When these two shaders are merged
and their uniforms (except for the texture) are defined as constants, the
performance increases by 50%:

* Original rendering: 26136 ms / 10000 frames (383 fps)
* Merged rendering: 17081 ms / 10000 frames (585 fps)

Merging the last pass (`OutputPass`) with the other two may increase performence
even more.

# Supported shaders


## RGBShiftShader

A shader that splits the color components of the frame and shifts them apart.
Shader weight is 1 sweight.

* **`amount`** – amount of shift (float, in NDC space units, default value 0.005)
* **`angle`** – angle of offset (float, in radians, default value 0.0)

## DotScreenShader

A shader that converts the frame into regularly spread dots.
Shader weight is 1 sweight.
	
* **`tSize`** – ???? (vector, default value THREE.Vector2(256,256))
* **`center`** – ???? (vector, default value THREE.Vector2(0.5,0.5))
* **`angle`** – ???? (float, default value 1.57, &asymp;&pi;/2)
* **`scale`** – ???? (float, default value 1.0}
		
		
| Name | Parameters | Samplings | Description |
| -- | -- | -- | -- |
| DotScreenShader | tSize<br>center<br>angle<br>scale | 1 | |
| -:- | :-- | :-- |
| DefaultShader | | 0 | A system shader with the default vertex shader and the main function of the fragment shader. |
| HeaderShader | | 1 | A system shader with the default variable and sampler of the fragment shader. |

 The following shaders are converted into OOPS format:
```js
RGBShiftShader( amount=0.005, angle=0.0 )
DotScreenShader( scale=1.0, angle=1.57, tSize=Vec2(256,256), center=Vec2(0.5,0.5) )
SepiaShader( amount=1.0 )
SobelOperatorShader( resolution=Vec2(0,0) )
```

This is a work in progress.

Be patient.

Please.
