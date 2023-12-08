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


## Current status

The work is split in several phases:

* <span style="display:inline-block; background:aquamarine; padding: 0.1em 0.5em; width:6em; text-align: center;">ONGOING</span> Adjusting Three.js shaders' code to be mergeable.
Currently 31 shaders are processed.
* <span style="display:inline-block; background:pink; padding: 0.1em 0.5em; width:6em; text-align: center;">PENDING</span> Implementing an effect composer that build passes depending on included shaders.
* <span style="display:inline-block; background:pink; padding: 0.1em 0.5em; width:6em; text-align: center;">PENDING</span> Providing the library for direct include via CDNs, in a package, as a Three.js PR (help needed).
