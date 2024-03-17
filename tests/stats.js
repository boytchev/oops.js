
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


const AVERAGE_WAIT_COUNT_FPS120 = 15; // at FPS64+
const AVERAGE_WAIT_COUNT_FPS80 = 14; // at FPS32+
const AVERAGE_WAIT_COUNT_FPS60 = 13; // at FPS16+
const AVERAGE_WAIT_COUNT_FPS40 = 12; // at FPS8+
const AVERAGE_WAIT_COUNT_FPS20  = 11;  // at FPS4+
const AVERAGE_WAIT_COUNT_FPS10  = 10;  // at FPS4+
const AVERAGE_WAIT_COUNT_FPS5  = 9;  // at FPS4+
const AVERAGE_WAIT_COUNT_FPS1  = 8;  // at FPS0+
const AVERAGE_WAIT_COUNT_FPS0  = 7;  // at FPS0+
var AVERAGE_WAIT_COUNT = 0;
const REPORT_TIME_MS = 1000; // in miliseconds, default 1000


var oldTime, counter, fps, avgfps, reports, gui, guiButton, guiInfo, oldResult;

var showGPU = true,
	done = false;
	
var autoComposers = 0,
	autoRun = false,
	autoText;

var params = {index: 0, count: 1, fps: 'pending', avgfps: 'pending', auto: autoTestStart, autoInfo: '' };

var firstRun = true;


function init( caption, composerNames )
{
	reset( );
	
	var composers = {};

	autoComposers = composerNames.length;
	
	for( var i in composerNames )
		composers[composerNames[i]] = parseInt(i);
	
	gui = new GUI( { title: `<big><em>${caption}</em></big>` } );
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
	} ).name( 'Renderings' ).onChange( reset );
		
	var guiFPS = gui.addFolder( 'FPS' );
		guiFPS.add( params, 'fps' ).name( '<right>Measured</right>' );
		guiFPS.add( params, 'avgfps' ).name( '<right>Average</right>' );//.$input.classList.add('bottom');
		
	var guiAUTO = gui.addFolder( 'Full tests' );
	guiButton = guiAUTO.add( params, 'auto' ).name( 'Run all' );//.$button.classList.add('bottom');
	guiInfo = guiAUTO.add( params, 'autoInfo' ).name( '<right>Progress</right>' );
	guiInfo.$input.classList.add('bottom');
		
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



function autoTestStop( )
{
	params.index = 0;
	params.count = 1;
	gui.controllers[0].updateDisplay( );
	gui.controllers[1].updateDisplay( );

	params.autoInfo = '';
	autoRun = false;
	guiInfo.updateDisplay( );
	
	console.groupEnd( );
	prompt( 'Test results (also shown in the console):', autoText );
	
	reset( );
	
	guiButton.name( 'Run all' );
	guiInfo.updateDisplay( );
}


function autoTestStart( )
{
	if( autoRun )
	{
		autoTestStop( );
		return;
	}

	oldResult = null;
	autoText = '';
	
	guiButton.name( 'Stop all' );
	
	autoRun = true;
	
	console.group( 'Automatic tests' );
	showVideoCardInfo( );
	console.log( (new Date()).toLocaleString() );
	if( autoRun ) autoText += (new Date()).toLocaleString();
	
	params.index = 0;
	params.count = 1;
	
	gui.controllers[0].updateDisplay( );
	gui.controllers[1].updateDisplay( );
	guiInfo.updateDisplay( );

	reset( );
	
}



function autoTestNext( )
{
	avgfps = 0;
	params.index++;
	if( params.index >= autoComposers )
	{
		oldResult = null;
		params.index = 0;
		params.count = 2*params.count;
		
		if( params.count > 1024 )
		{
			autoTestStop( );
			return;
		}
	}
	
	params.autoInfo += '|'; 
	guiInfo.updateDisplay( );
	
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

	var str = `
${gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)}
`;
//Resolution ${innerWidth}x${innerHeight} (${devicePixelRatio*innerWidth}x${devicePixelRatio*innerHeight})

	console.log( str );
	if( autoRun ) autoText += str;

}



function update( )
{
	if( firstRun ) showVideoCardInfo();
	firstRun = false;
	
	counter++;
	
	var time = ( performance || Date ).now( );

	if( time-oldTime < REPORT_TIME_MS ) return;
	
	reports++;
	
	var fps = 1000 * counter / (time-oldTime );
	
	if( reports == 1 || avgfps == 0 )
		avgfps = fps;
	else
		avgfps = fps*0.5+0.5*avgfps;
//
const AVERAGE_WAIT_COUNT_FPS120 = 20; // at FPS64+
const AVERAGE_WAIT_COUNT_FPS80 = 19; // at FPS32+
const AVERAGE_WAIT_COUNT_FPS60 = 18; // at FPS16+
const AVERAGE_WAIT_COUNT_FPS40 = 17; // at FPS8+
const AVERAGE_WAIT_COUNT_FPS20  = 16;  // at FPS4+
const AVERAGE_WAIT_COUNT_FPS10  = 15;  // at FPS4+
const AVERAGE_WAIT_COUNT_FPS5  = 14;  // at FPS4+
const AVERAGE_WAIT_COUNT_FPS1  = 13;  // at FPS0+
const AVERAGE_WAIT_COUNT_FPS0  = 12;  // at FPS0+


	if( avgfps>120 ) AVERAGE_WAIT_COUNT = AVERAGE_WAIT_COUNT_FPS120;
	else
	if( avgfps>80 ) AVERAGE_WAIT_COUNT = AVERAGE_WAIT_COUNT_FPS80;
	else
	if( avgfps>60 ) AVERAGE_WAIT_COUNT = AVERAGE_WAIT_COUNT_FPS60;
	else
	if( avgfps>40 ) AVERAGE_WAIT_COUNT = AVERAGE_WAIT_COUNT_FPS40;
	else
	if( avgfps>20 ) AVERAGE_WAIT_COUNT = AVERAGE_WAIT_COUNT_FPS20;
	else
	if( avgfps>10 ) AVERAGE_WAIT_COUNT = AVERAGE_WAIT_COUNT_FPS10;
	else
	if( avgfps>5 ) AVERAGE_WAIT_COUNT = AVERAGE_WAIT_COUNT_FPS5;
	else
	if( avgfps>1 ) AVERAGE_WAIT_COUNT = AVERAGE_WAIT_COUNT_FPS1;
	else
		AVERAGE_WAIT_COUNT = AVERAGE_WAIT_COUNT_FPS0;

	
	params.fps = fps.toFixed(2) + ' fps';
	if( reports < AVERAGE_WAIT_COUNT )
		params.avgfps = 'pending '+Math.round(100*reports/AVERAGE_WAIT_COUNT)+'%';
	else
		params.avgfps = avgfps.toFixed(2) + ' fps';
		
	oldTime = time;
	counter = 0;
	
	if( reports >= AVERAGE_WAIT_COUNT )
	{
		var avg;
		
//		if( avgfps>=100 ) avg = avgfps.toFixed(0); else
//		if( avgfps>=10 ) avg = avgfps.toFixed(1); else
//		if( avgfps>=1 ) avg = avgfps.toFixed(2); else
		avg = avgfps.toFixed(3);
			
		if( showGPU ) showVideoCardInfo( );	
		if( oldResult == null )
		{
			console.log( `${params.index}\t${params.count}\t${avg}` );
			if( autoRun ) autoText += `\n${params.count} ${avg}`;
		}
		else
		{
			var gain = Math.round(100*avgfps/oldResult-100);
			if( gain >= 0 ) gain = '+' + gain;
			console.log( `${params.index}\t${params.count}\t${avg} (${gain}%)` );
			if( autoRun ) autoText += ` ${avg} (${gain}%)`;
		}
		
		oldResult = avgfps;
		
		if( autoRun ) autoTestNext( );
	}
	
	if( gui )
	{
		gui.folders[0].controllers[0].updateDisplay( );
		gui.folders[0].controllers[1].updateDisplay( );
	}
	
}		


export { update, init, params };
