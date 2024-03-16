# User API

## Class `Effects`

A class. Defines effect composer that manages post-processing effects and their
rendering. `Effects` extends [`THREE.EffectComposer`](https://threejs.org/docs/#examples/en/postprocessing/EffectComposer).


```javascript
new Effects( renderer )
new Effects( renderer, options )
```
where `renderer` is [`THREE.WebGLRenderer`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
and the optional parameter `options` is an object with the following structure:

```
{
   VERBOSE: false,
   WARNINGS: false,
   SHADERS: false,
   MERGE: true,
}
```
where:
* **VERBOSE** &ndash;  whether to report various internal logs in the Developer's
	console. These logs are used for debugging. Default value is **false**,
	does not show logs.
* **SHADERS** &ndash;  whether to report the generated GLSL shader code in the
	Developer's console. These is used for debugging. Default value is **false**,
	does not show shaders' code.
* **WARNINGS** &ndash; whether to report warnings in the Developer's console.
	Default value is **false**, does not show warning.
* **MERGE** &ndash; whether to attempt shader merging; when false each effect
	is individual pass. This option is used to avoid merging that fails. Default
	value is **true**, tries to merge shaders.


## Method `.addEffect`

A method of [`Effects`](#effects). Adds a post-processing effect to the effect
composer. Returns the composer, in order to allow method chaning.

```js
.addEffect( effect )
.addEffect( effect, parameters )
```

where `effect` is a shader instance, a pass class or pass instance; and the
optional `parameters` is an object with static (baked) parameters. 

```js
.addEffect( FilmShader, {intensity: 0.7, grayscale: true} )
.addEffect( FilmPass )
.addEffect( new FilmPass(0.7,true) )
```


<!--
#### `.addParameter`

A method of [`Effects`](#effects). TO DO.


#### `.render`

A method of [`Effects`](#effects). Renders the postprocessing effects.

```javascript
.render( scene, camera, deltaTime )
```

where `scene` is the `THREE.Scene` to be rendered, `camera` is
the `THREE.Camera` (usually it is `THREE.PerspectiveCamera` or
`THREE.OrthographicCamera`) for the viewpoint, and `deltaTime`
is the ellapsed time in seconds since the previous call to `render`.


## Developer API


### Class `Effects`

The `Effects` class provides two properties to access the internal
structure of the class.


#### `.split`

A method of [`Effects`](#effects). It is used while adding effects. It forces
the composer to split next effects into a separate shader. Returns the composer,
in order to allow method chaning. This method is intended for internal debug purposes.

```js
.split()
```

#### `.parameters`

A virtual property of [`Effects`](#effects). Returns an array of shader
parameters &ndash; explicitly added by the user via [`.addParameter`](#addparameter)
or implicitly added by the effect composer (like screen resolution, time, etc.)
This property is intended for internal debug purposes.


#### `.shaders`

A virtual property of [`Effects`](#effects). Returns an array of passes and
shader in each pass. This property is intended for internal debug purposes.
-->


## Additional topics

### Original Three.js effects

Oops reuses most of the Three.js post-processing effects (both standalone
shaders and passes). It modifies the shader code for several reasons:

* to bake values of constant uniforms
* to merge shaders into one shader
* to fix hard bugs found in GLSL code

### Modified Oops.js effects

Oops introduces new effects, they have suffix "X" (from *extended*).
Such effects are:

* modifications (e.g. changed values of parameters)
* extensions (e.g. new parameters or functionality)
* new effects, not found in Three.js

### Effect parameters and shader uniforms

Generally effect parameters correspond to underlying shader uniforms. However, 
some uniforms do not appear as parameters. These are:

* uniforms with baked (static) values (they are converted into #define-s)
* internal uniforms managed by Oops (like screen size, current time, etc)
* special uniforms controlled by passes (like render target textures)

Effects parameters are exposed at the level of the effect composer.



