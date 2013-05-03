
process.stdout.write('This is being written to StdOut\n');
console.log('This is being written to Console log\n');

var hook = require('./index.js');

console.log('Now were hooking Stdout to write to a file');
console.log('After 40 seconds, we will remove the hook.');

hook.stdout(hook.file('hookedlog.txt'), AlsoPrintToStdout=false);

var i=0;
setInterval(function(){
	console.log('This is console log output');
	// After 40 seconds, we will remove the hook.
	if(i++ > 20) hook.unstdout();
}, 2000);

