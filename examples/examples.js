
// Helper functions to create scenes with objects for the examples

import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


var renderer = new THREE.WebGLRenderer( {antialias: true} );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( innerWidth, innerHeight );
	document.body.appendChild( renderer.domElement );
	document.body.style = 'margin: 0; overflow: hidden;';
				

var camera = new THREE.PerspectiveCamera( 30, innerWidth / innerHeight, 1, 5000 );
	camera.position.z = 400;


var scene = new THREE.Scene();


var light = new THREE.DirectionalLight( 'white', 3 );
	light.position.set( 1, 1, 1 );
	scene.add( light );


var controls = new OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;

			
function randomBalls( n=100 )
{
	var geometry = new THREE.SphereGeometry( 1 );

	for( var i=0; i<n; i++ )
	{
		var material = new THREE.MeshLambertMaterial( { color: new THREE.Color().setHSL(Math.random(),1,0.5) } );

		var mesh = new THREE.Mesh( geometry, material );
			mesh.position.set( Math.random()-0.5, Math.random()-0.5, Math.random()-0.5 ).normalize();
			mesh.position.multiplyScalar( Math.random()*400 );
			mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random()*40;
			
		scene.add( mesh );
	}
}


function randomBallsAndCubes( n=100 )
{
	var geometry1 = new THREE.SphereGeometry( 1 );
	var geometry2 = new THREE.BoxGeometry( 2, 2, 2 );

	for( var i=0; i<n; i++ )
	{
		var material = new THREE.MeshLambertMaterial( { color: new THREE.Color().setHSL(Math.random(),1,0.5) } );

		var mesh = new THREE.Mesh( Math.random()>0.5?geometry1:geometry2, material );
			mesh.position.set( Math.random()-0.5, Math.random()-0.5, Math.random()-0.5 ).normalize();
			mesh.position.multiplyScalar( Math.random()*400 );
			mesh.rotation.set( Math.random()*6.28, Math.random()*6.28, Math.random()*6.28 );
			mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random()*40;
			
		scene.add( mesh );
	}
}


function backgroundGrid( gridColor = 'white', backgroundColor = 'black' )
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
	scene.background.repeat.set( innerWidth/100, innerHeight/100 );
}



var composer;

function setAnimationLoop( comp )
{
	composer = comp;
}


function animate( t )
{
	controls.update( );
	light.position.copy( camera.position );
	composer?.render();
}

renderer.setAnimationLoop( animate );

export { renderer, camera, scene, light, controls, randomBalls, randomBallsAndCubes, backgroundGrid, setAnimationLoop };
