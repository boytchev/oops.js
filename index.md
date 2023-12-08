# Only One-pass Shader (oops.js)

**Oops.js** is a library which attempts to squeeze higher performance from Three.js postprocessing effects, by:

* merging the source codes of several shaders
* embedding static uniforms as shader constants

Additionally, the library makes small adjustment to the shaders properties,
so they are not completely the same as their Three.js counterparts.
  
A very preliminary test with the [webgl_postprocessing](https://threejs.org/examples/?q=post#webgl_postprocessing)
example shows increased performance by 50%.

## More information

* [Shaders Types](examples/types.md) &ndash; general classification of shader
types and their compatibilities
* [Shaders Examples](examples/) &ndash; a list of supported shaders and 
examples of their parameters

