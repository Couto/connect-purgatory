
process.stdout.write('This is being written to StdOut\n');
console.log('This is being written to Console log\n');

var hook = require('./index.js');

console.log('Now were hooking with a custom function..');
console.log('We will unhook it after 7 iterations..');

function myfunc(s){
	// note stdout was hooked, not stderr..
	process.stderr.write('Custom func sez: '+s);
}

hook.stdout(myfunc, AlsoPrintToStdout=false);

var i=0;
setInterval(function(){
	console.log('This is console log output');
	// After 10 seconds, we will remove the hook.
	if(i++ > 5) hook.unstdout();
}, 2000);
