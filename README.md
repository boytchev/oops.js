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

This is a work in progress.

Be patient.

Please.
