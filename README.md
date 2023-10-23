# Only One-pass Shader (oops.js)

This is a library which attempts to squeeze higher performance from Three.js postprocessing effects, by:

* merging the source codes of several shaders
* embedding static uniforms as shader constants
  
A very preliminary test with example [webgl_postprocessing](https://threejs.org/examples/?q=post#webgl_postprocessing).
It uses 4 passes, two of them are `ShaderPass` using `RGBShiftShader` and `DotScreenShader`. Merged rendering is when
these shaders are merged and all uniforms (except for the texture) are defined as constants.

* Original rendering: 26802 ms / 10000 frames (373 fps)
* Merged rendering: 17737 ms / 10000 frames (564 fps)

This is a work in progress. Be patient.
