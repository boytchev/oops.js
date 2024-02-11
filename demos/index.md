# Tutorials

This page describes the Oops.js API and demonstrates its features.

* [Using Oops.js](#using-oopsjs)
	* <small>[Initializing effect composer](#initializing-effect-composer)</small>
	* <small>[Adding effects](#adding-effects)</small>
	* <small>[Effect parameters](#effect-parameters): [static](#static-parameters), [dynamic](#dynamic-parameters)</small>
	* <small>[Video postprocessing](#video-postprocessing)</small>
* [API](#api)
	* <small>Class [Effects](#effects): methods [addEffect](#addeffect), [addParameter](#addparameter), [render](#render), properties: [parameters](#parameters), [shaders](#shaders)</small>
	



## Using Oops.js

### Initializing effect composer

The postprocessing effects in Oops.js are intentionally similar to those in
Three.js. The effect composer of Oops.js is called `Effects`. Creating an
instance of `Effects` requires a renderer, a scene and a camera.

`Effects` is a manager of postprocessing effects. Initially the composer is
empty. If its `.render` is called it will just render the scene without any
effect. The following demo shows how to create an empty `Effects` and use it
to render the scene.

```js
var composer = new Effects(renderer,scene,camera);
:
function animationLoop( )
{
	composer.render( );
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
var composer = new Effects(renderer,scene,camera);

composer.addEffect( 'Sepia' );
composer.addEffect( 'Film' );
```

The `.addEffect` method is chainable, so the same code couls be shortened as:

```js
var composer = new Effects(renderer,scene,camera)
    .addEffect( 'Sepia' )
    .addEffect( 'Film' );
```



Run: [Simple effect demo](simple-effect/index.html)
	
[<img src="simple-effect/snapshot.jpg">](simple-effect/index.html)

For a list of available effects see the [Examples](../examples) page.



### Effect parameters

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
var composer = new Effects( renderer, scene, camera )
    .addEffect( 'Halftone', {radius: 80/1, rotate: zero, blending: 0.2} )
    .addEffect( 'Halftone', {radius: 80/3, rotate: zero, blending: 0.4} )
    .addEffect( 'Halftone', {radius: 80/9, rotate: zero, blending: 0.3} );
```



Run: [Static parameters demo](static-parameters/index.html)
	
[<img src="static-parameters/snapshot.jpg">](static-parameters/index.html)

For a list of available parameters to each effect see the [Examples](../examples) page.




#### Dynamic parameters

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








## API

### `Effects`

A class. Defines effect composer that manages postprocessing effects and their
rendering. `Effects` extends [`THREE.EffectComposer`](https://threejs.org/docs/#examples/en/postprocessing/EffectComposer).


```javascript
new Effects(
    renderer : THREE.WebGLRenderer,
	scene : THREE.Scene,
	camera : THREE.Camera,
	options
)
```
The optional parameter `options` is an object
```
{
    WARNING_THRESHOLD: 30,
    SPLIT_THRESHOLD: 30,
}
```
where `WARNING_THRESHOLD` sets a warning in the console if the overall shader weight is above the threshold, and `SPLIT_THRESHOLD` forces shaders to split in separate passes if their combined weight is above threshold.


### `.addEffect`

A method. TO DO.


### `.addParameter`

A method. TO DO.


### `.render`

A method. TO DO.


### `.parameters`

A virtual property. TO DO.


### `.shaders`

A virtual property. TO DO.
