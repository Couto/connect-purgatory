
process.stdout.write('This is being written to StdOut\n');
console.log('This is being written to Console log\n');

var hook = require('./index.js');

console.log('Now were hooking uncaught exceptions');

hook.uncaught(function(s){
		console.log('caught exception here.. ' + s);
});

setInterval(function(){
	require('this-is-an-error');
}, 2000);

