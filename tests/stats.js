
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


const AVERAGE_WAIT_COUNT = 20; // default 20
const REPORT_TIME_MS = 1000; // in miliseconds, default 1000


var oldTime, counter, fps, avgfps, reports, gui, guiButton, guiInfo, oldResult;

var showGPU = true,
	done = false;
	
var autoComposers = 0,
	autoRun = false,
	autoText;

var params = {index: 0, count: 1, fps: 'pending', avgfps: 'pending', auto: autoTestStart, autoInfo: '' };


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
	console.log( (new Date()).toLocaleString() );
	if( autoRun ) autoText += (new Date()).toLocaleString();
	showVideoCardInfo( );
	
	params.index = 0;
	params.count = 1;
	
	gui.controllers[0].updateDisplay( );
	gui.controllers[1].updateDisplay( );
	guiInfo.updateDisplay( );

	reset( );
	
}



function autoTestNext( )
{
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
Resolution ${innerWidth}x${innerHeight} (${devicePixelRatio*innerWidth}x${devicePixelRatio*innerHeight})
${gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)}
`;

	console.log( str );
	if( autoRun ) autoText += str;

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
	
	params.fps = fps.toFixed(2) + ' fps';
	if( reports < AVERAGE_WAIT_COUNT )
		params.avgfps = 'pending '+Math.round(100*reports/AVERAGE_WAIT_COUNT)+'%';
	else
		params.avgfps = avgfps.toFixed(2) + ' fps';
		
	oldTime = time;
	counter = 0;
	
	if( reports == AVERAGE_WAIT_COUNT )
	{
		var avg;
		
		if( avgfps>=100 ) avg = avgfps.toFixed(0); else
		if( avgfps>=10 ) avg = avgfps.toFixed(1); else
		if( avgfps>=1 ) avg = avgfps.toFixed(2); else
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
