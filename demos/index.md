# Tutorials

This page describes the Oops.js API and demonstrates its features.

<big>**[Using Oops.js](#using-oopsjs)**</big><br>
&nbsp; &nbsp; &nbsp;[Initializing effect composer](#initializing-effect-composer)<br>
&nbsp; &nbsp; &nbsp;[Adding effects](#adding-effects)<br>
&nbsp; &nbsp; &nbsp;[Customizing effects](#customizing-effects)<br>
&nbsp; &nbsp; &nbsp;[Video postprocessing](#video-postprocessing)<br>
<big>**[User API](#user-api)**</big><br>
&nbsp; &nbsp; &nbsp;Class [`Effects`](#class-effects): <small>[`addEffect`](#addeffect), TODO:[`addParameter`](#addparameter), [`render`](#render)</small><br>
<big>**[Developer API](#developer-api)**</big><br>
&nbsp; &nbsp; &nbsp;Class [`Effects`](#class-effects2): <small>[`split`](#split), [`parameters`](#parameters), [`shaders`](#shaders)</small><br>
	



## Using Oops.js

### Initializing effect composer

The postprocessing effects in Oops.js are intentionally similar to those in
Three.js. The effect composer of Oops.js is called `Effects`. Creating an
instance of `Effects` requires a renderer.

`Effects` is a manager of postprocessing effects. Initially the composer is
empty. If its `.render` is called it will just render the scene without any
effect. The following demo shows how to create an empty `Effects` and use it
to render the scene.

```js
var composer = new Effects( renderer );
:
function animationLoop( )
{
    composer.render( scene, camera );
}
```

Run: [Empty effect demo](empty-effect/index.html)
	
[<img src="empty-effect/snapshot.jpg">](empty-effect/index.html)



### Adding effects

The effect composer collects effects and renders them in the animation loop.
Effects are added with the composer's `.addEffect` method and the name of the
effect. Effects are always applied in the order they are added. The composer
attempts to merge effects in order to increase the overall rendering speed.
The following demo shows application of two effects:
* [Sepia](../examples/index.md#sepiashader) to colorize the scene in [sepia color](https://en.wikipedia.org/wiki/Sepia_(color))
* [Film](../examples/index.md#filmshader) to add dynamic TV-like noise


```js
var composer = new Effects( renderer );

composer.addEffect( 'Sepia' );
composer.addEffect( 'Film' );
```

The `.addEffect` method is chainable, so the same code couls be shortened as:

```js
var composer = new Effects( renderer )
    .addEffect( 'Sepia' )
    .addEffect( 'Film' );
```



Run: [Simple effect demo](simple-effect/index.html)
	
[<img src="simple-effect/snapshot.jpg">](simple-effect/index.html)

For a list of available effects see the [Examples](../examples) page.



### Customizing effects

Almost all postprocessing effects have parameters that specify their properties.
These parameters have preset default values that can be changed statically (i.e.
only once, at initialization) or dynamically (i.e. at each frame of an animation). 

#### Static parameters

Static parameters are hard-coded or baked into the shader code. This makes the
postprocessing faster as the shader compiler can optimize the code.

Static parameters are provided as an optional second parameter of `.addEffect`
&ndash; an object with parameter names and values. The following demo shows
three overlapping [Halftone](../examples/index.md#halftoneshader) effects with
custom static parameters.


```js
var zero = new THREE.Vector3(0,0,0);
var composer = new Effects( renderer )
    .addEffect( 'Halftone', {radius: 80/1, rotate: zero, blending: 0.2} )
    .addEffect( 'Halftone', {radius: 80/3, rotate: zero, blending: 0.4} )
    .addEffect( 'Halftone', {radius: 80/9, rotate: zero, blending: 0.3} );
```

Run: [Static parameters demo](static-parameters/index.html)
	
[<img src="static-parameters/snapshot.jpg">](static-parameters/index.html)

For a list of available parameters to each effect see the [Examples](../examples) page.




#### Dynamic parameters

TO DO




#### Automatic parameters

TO DO






### Video postprocessing

Although the postprocessing effects cannot be applied directly on a video,
they can be applied on a video, rendered on the screen. This demo displayes a video via a [video texture](https://threejs.org/docs/#api/en/textures/VideoTexture)
and applies 4 postprocessing effects onto it:
* [Halftone](../examples/index.md#halftoneshader) to create dotted pattern of the video
* [HueSaturation](../examples/index.md#huesaturationshader) to change dynamically the color
* [Vignette](../examples/index.md#vignetteshader) to frame the image in an ellipse
* [TriangleBlur](../examples/index.md#triangleblurshader) to smooth effect transitions

Run: [Video effect demo](video-effect/index.html)
	
[<img src="video-effect/snapshot.jpg">](video-effect/index.html)








## User API

### Class `Effects`

A class. Defines effect composer that manages postprocessing effects and their
rendering. `Effects` extends [`THREE.EffectComposer`](https://threejs.org/docs/#examples/en/postprocessing/EffectComposer).


```javascript
new Effects( renderer )
new Effects( renderer, options )
```
where `renderer` is `THREE.WebGLRenderer` abd the optional parameter `options` is an object with the following structure:

```
{
    WARNING_THRESHOLD: 30,
    SPLIT_THRESHOLD: 30,
}
```
where `WARNING_THRESHOLD` sets a warning in the console if the overall shader weight is above the threshold, and `SPLIT_THRESHOLD` forces shaders to split in separate passes if their combined weight is above threshold.


#### `.addEffect`

A method of [`Effects`](#effects). Adds a postprocessing effect to the effect composer. Returns the composer, in order to allow method chaning.

```javascript
.addEffect( name )
.addEffect( name, parameters )
```

where `name` is the case-sensitive name of the postprocessing effect, and the
optional `parameters` is an object with static (baked) parameters.


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
ot implicitly added by the effect composer (like screen resolution, time, etc.)
This property is intended for internal debug purposes.


#### `.shaders`

A virtual property of [`Effects`](#effects). Returns an array of passes and
shader in each pass. This property is intended for internal debug purposes.

