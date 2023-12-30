
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


const AVERAGE_WAIT_COUNT = 20;
const REPORT_TIME_MS = 1000; // in miliseconds


var oldTime, counter, fps, avgfps, reports, gui;

var showGPU = true,
	done = false;
	
var autoComposers = 0,
	autoRun = false;

var params = {index: 0, count: 1, fps: 'pending', avgfps: 'pending', auto: autoTest, autoinfo: '' };



function init( composerNames )
{
	reset( );
	
	var composers = {};

	autoComposers = composerNames.length;
	
	for( var i in composerNames )
		composers[composerNames[i]] = parseInt(i);
	
	gui = new GUI( { title: '<big><em>Test 1</em></big>' } );
	gui.add( params, 'index', composers ).name( 'Composer' ).onChange( reset );
	gui.add( params, 'count', {
		'1 per frame': 1,
		'2 per frame': 2,
		'4 per frame': 4,
		'8 per frame': 8,
		'16 per frame': 16,
		'32 per frame': 32,
		'64 per frame': 64,
		'128 per frame': 128,
		'256 per frame': 256,
		'512 per frame': 512,
		'1024 per frame': 1024,
	} ).name( 'Renders' ).onChange( reset );
		
	var guiFPS = gui.addFolder( 'FPS / ms' );
		guiFPS.add( params, 'fps' ).name( '<right>Measured</right>' );
		guiFPS.add( params, 'avgfps' ).name( '<right>Average</right>' );//.$input.classList.add('bottom');
		
	var guiAUTO = gui.addFolder( 'Full tests' );
		guiAUTO.add( params, 'auto' ).name( 'Run all test cases' );//.$button.classList.add('bottom');
		guiAUTO.add( params, 'autoinfo' ).name( '<right>Progress</right>' ).$input.classList.add('bottom');
}


function reset( )
{
	oldTime = ( performance || Date ).now( );
	counter = 0;
	fps = 'pending';
	avgfps = 0;
	reports = 0;
	done = false;
}



function autoTest( )
{
	console.group( 'Automatic tests' );
	console.log( (new Date()).toLocaleString() );
	showVideoCardInfo( );
	
	params.index = 0;
	params.count = 1;
	
	gui.controllers[0].updateDisplay( );
	gui.controllers[1].updateDisplay( );

	reset( );
	
	autoRun = true;
}



function autoTestNext( )
{
	params.count = 2*params.count;
	
	if( params.count > 1024 )
	{
		params.index++;
		params.count = 1;
		
		if( params.index >= autoComposers )
		{
			params.index = 0;
			params.count = 1;
			gui.controllers[0].updateDisplay( );
			gui.controllers[1].updateDisplay( );

			autoRun = false;
			console.groupEnd( );
			
			reset( );
			
			return;
		}
	}
	
	gui.controllers[0].updateDisplay( );
	gui.controllers[1].updateDisplay( );

	reset( );
}


// https://stackoverflow.com/a/49267844
function showVideoCardInfo( ) {
	
	showGPU = false;
	
	var gl = document.createElement('canvas').getContext('webgl');

	if( !gl ) {

		console.log( 'WebGL no available' );
		return;
		
	}

	var debugInfo = gl.getExtension( 'WEBGL_debug_renderer_info' );

	if( !debugInfo ) {

		console.log( 'Extension WEBGL_debug_renderer_info support not available' );
		return;

	}

	console.log( gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) );

}



function update( )
{
	counter++;
	
	var time = ( performance || Date ).now( );

	if( time-oldTime < REPORT_TIME_MS ) return;
	
	reports++;
	
	var fps = 1000 * counter / (time-oldTime );
	
	if( reports == 1 )
		avgfps = fps;
	else
		avgfps = fps*0.3+0.7*avgfps;
	
	params.fps = fps.toFixed(2) + ' fps / ' + (1000/fps/params.count).toFixed(2)+' ms';
	if( reports < AVERAGE_WAIT_COUNT )
		params.avgfps = 'pending '+Math.round(100*reports/AVERAGE_WAIT_COUNT)+'%';
	else
		params.avgfps = avgfps.toFixed(2) + ' fps / ' + (1000/avgfps/params.count).toFixed(2)+' ms';
		
	oldTime = time;
	counter = 0;
	
	if( reports == AVERAGE_WAIT_COUNT )
	{
		if( showGPU ) showVideoCardInfo( );	
		console.log( params.index + '\t' + params.count + '\t' + avgfps.toFixed(3) + '\t' + (1000/avgfps/params.count).toFixed(3) );
		
		if( autoRun ) autoTestNext( );
	}
	
	if( gui )
	{
		gui.folders[0].controllers[0].updateDisplay( );
		gui.folders[0].controllers[1].updateDisplay( );
	}
	
}		


export { update, init, params };
