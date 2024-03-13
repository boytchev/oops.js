
// Helper functions to create scenes with objects for the examples

import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


if( typeof EXAMPLE_RENDERER_OPTIONS === 'undefined' )
{
	var EXAMPLE_RENDERER_OPTIONS = {antialias: true};
}

var renderer = new THREE.WebGLRenderer( EXAMPLE_RENDERER_OPTIONS );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( innerWidth, innerHeight );
	document.body.appendChild( renderer.domElement );
	document.body.style = 'margin: 0; overflow: hidden;';
				

var camera = new THREE.PerspectiveCamera( 30, innerWidth / innerHeight, 1, 5000 );
	camera.position.z = 800;


var scene = new THREE.Scene();


var light = new THREE.DirectionalLight( 'white', 3 );
	light.position.set( 1, 1, 1 );
	scene.add( light );


var controls = new OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;

			
function randomBalls( n=100, defaultMaterial=null )
{
	var geometry = new THREE.SphereGeometry( 1 );
	var material;

	for( var i=0; i<n; i++ )
	{
		if( defaultMaterial )
			material = defaultMaterial;
		else
			material = new THREE.MeshLambertMaterial( { color: new THREE.Color().setHSL(Math.random(),1,0.5) } );

		var mesh = new THREE.Mesh( geometry, material );
			mesh.position.set( Math.random()-0.5, Math.random()-0.5, Math.random()-0.5 ).normalize();
			mesh.position.multiplyScalar( Math.random()*400 );
			mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random()*40;
			
		scene.add( mesh );
	}
}


function randomBallsAndCubes( n=100, defaultMaterial=null )
{
	var geometry1 = new THREE.SphereGeometry( 1 );
	var geometry2 = new THREE.BoxGeometry( 2, 2, 2 );
	var material;

	for( var i=0; i<n; i++ )
	{
		if( defaultMaterial )
			material = defaultMaterial;
		else
			material = new THREE.MeshLambertMaterial( { color: new THREE.Color().setHSL(Math.random(),1,0.5) } );

		var mesh = new THREE.Mesh( Math.random()>0.5?geometry1:geometry2, material );
			mesh.position.set( Math.random()-0.5, Math.random()-0.5, Math.random()-0.5 ).normalize();
			mesh.position.multiplyScalar( Math.random()*400 );
			mesh.rotation.set( Math.random()*6.28, Math.random()*6.28, Math.random()*6.28 );
			mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random()*40;
			
		scene.add( mesh );
	}
}


function backgroundGrid( gridColor = 'white', backgroundColor = 'black', factor=100 )
{
	const S = 64;
	
	var canvas = document.createElement( 'canvas' );
		canvas.width = S;
		canvas.height = S;

	var context = canvas.getContext( '2d' );
		context.fillStyle = backgroundColor;
		context.fillRect( 0, 0, S, S );

		context.strokeStyle = gridColor;
		context.strokeRect( 0, 0, S, S );

	var texture = new THREE.CanvasTexture(canvas);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		
	scene.background = texture;
	scene.background.repeat.set( innerWidth/factor, innerHeight/factor );
	
	
	window.addEventListener( 'resize', onWindowResize );

	function onWindowResize()
	{
		scene.background.repeat.set( innerWidth/factor, innerHeight/factor );
	}

}


function gridWall( z, gridColor = 'black', backgroundColor = 'white', defaultMaterial )
{
	const S = 64;
	
	var canvas = document.createElement( 'canvas' );
		canvas.width = S;
		canvas.height = S;

	var context = canvas.getContext( '2d' );
		context.fillStyle = backgroundColor;
		context.fillRect( 0, 0, S, S );

		context.lineWidth =	 5;
		context.strokeStyle = gridColor;
		context.strokeRect( 0, 0, S, S );

	var texture = new THREE.CanvasTexture(canvas);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 16, 10 );
		
	var geometry = new THREE.PlaneGeometry( 1600, 1000 );
	var material;

	if( defaultMaterial )
		material = defaultMaterial;
	else
		material = new THREE.MeshBasicMaterial( {
			color: 'white',
			map: texture,
			side: THREE.DoubleSide,
		} );

		var mesh = new THREE.Mesh( geometry, material );
			mesh.position.set( 0, 0, z );
			
		scene.add( mesh );
}


function backgroundHatched( gridColor = 'white', backgroundColor = 'black', factor=8 )
{
	const S = 16;
	
	var canvas = document.createElement( 'canvas' );
		canvas.width = S;
		canvas.height = S;

	var context = canvas.getContext( '2d' );
		context.fillStyle = backgroundColor;
		context.fillRect( 0, 0, S, S );

		context.strokeStyle = gridColor;
		context.moveTo( -10, -10 );
		context.lineTo( S+10, S+10 );
		context.stroke( );

	var texture = new THREE.CanvasTexture(canvas);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		
	scene.background = texture;
	scene.background.repeat.set( innerWidth/factor, innerHeight/factor );
		
	window.addEventListener( 'resize', onWindowResize );

	function onWindowResize()
	{
		scene.background.repeat.set( innerWidth/factor, innerHeight/factor );
	}
}


window.addEventListener( 'resize', onWindowResize );

function onWindowResize()
{
	camera.aspect = innerWidth / innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( innerWidth, innerHeight );
	composer.setSize( innerWidth, innerHeight );
}
	
		

var composer, renderTick;

function animationLoop( comp, tick )
{
	composer = comp;
	renderTick = tick;
	onWindowResize( );	
}


function animate( t )
{
	controls.update( );
	light.position.copy( camera.position );
	if( renderTick ) renderTick( t );
	composer?.render( scene, camera );
}

renderer.setAnimationLoop( animate );

export { renderer, camera, scene, light, controls, randomBalls, randomBallsAndCubes, gridWall, backgroundGrid, backgroundHatched, animationLoop };
