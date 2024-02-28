# Only One-pass Shader (oops.js)

**Oops.js** is a library which attempts to squeeze higher performance from Three.js postprocessing effects, by:

* merging the source codes of several shaders
* embedding static uniforms as shader constants
* reducing the number of EffectComposer passes

<!--Additionally, the library makes small adjustment to the shaders properties,
so they are not completely the same as their Three.js counterparts.
  
A very preliminary test with the [webgl_postprocessing](https://threejs.org/examples/?q=post#webgl_postprocessing)
example shows increased performance by 50%.
-->

## More information

* [Gallery](examples/) &ndash; a gallery of individual effects
* [Tutorias](demos/) &ndash; a short tutorial of using Oops.js
* [Tests](tests/) &ndash; some non-binding performance tests
<!--* [Shaders Types](examples/types.md) &ndash; general classification of shader types-->


## Current status

The work is split into several phases:

1. <span style="display:inline-block; background:aquamarine; padding: 0.1em 0.5em; width:4em; text-align: center; margin: 0.1em 0;">DONE</span> Proof-of-concept work on merging simple shaders and baking uniforms.
2. <span style="display:inline-block; background:lemonchiffon; padding: 0.1em 0.5em; width:4em; text-align: center; margin: 0.1em 0;">NOW</span> Design a composer based on effects instead of passes or shaders.
3. <span style="display:inline-block; background:pink; padding: 0.1em 0.5em; width:4em; text-align: center; margin: 0.1em 0;">TODO</span> Recreate all Three.js posprocessing effects and their examples.
