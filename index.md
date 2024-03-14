# Only One-pass Shader (oops.js)

**Oops.js** is a library which attempts to squeeze higher
performance from Three.js postprocessing effects, by:

* baking static uniforms in the shader code
* merging several compatible shaders into one
* reducing the number of postprocessing passes

At the same time the library profides a simple user-friendly
API to combine various postprocessing effects.

* **[Effects Gallery](gallery/)** of individual postprocessing effects
* **[Performance Tests](tests/)** of rendering postprocessed scenes

<!--
* [Tutorias](demos/) &ndash; a short tutorial of using Oops.js
* [Shaders Types](examples/types.md) &ndash; general classification of shader types-->


**NB!** Currently Oops.js is under a heavy development. It is still
not suitable for end users.



