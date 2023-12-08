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
types
* [Shaders Examples](examples/) &ndash; supported shaders and their parameters


## Current status

The work is split in several phases:

* <span style="display:inline-block; background:aquamarine; padding: 0.1em 0.5em; width:6em; text-align: center;">ONGOING</span> Three.js shaders that can be merged.
* <span style="display:inline-block; background:pink; padding: 0.1em 0.5em; width:6em; text-align: center;">PENDING</span> Effect composer with automatic passes.
* <span style="display:inline-block; background:pink; padding: 0.1em 0.5em; width:6em; text-align: center;">PENDING</span> Dissemination, CDN, package, Three.js PR (help needed).
