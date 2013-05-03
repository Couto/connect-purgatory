
process.stdout.write('This is being written to StdOut\n');
console.log('This is being written to Console log\n');

var hook = require('./index.js');

console.log('You will need to generate a key and cert for SSL\n');
console.log('1.  See that you have openssl installed    $ openssl');
console.log('2.  $ openssl genrsa -out key.pem  (makes key)');
console.log('3.  $ openssl req -new -key key.pem -out csr.pem  (makes csr)');
console.log('4.  $ openssl x509 -req -in csr.pem -signkey key.pem -out cert.pem  (makes cert)\n');

console.log('Now were hooking to tls (SSL) client (encrypted)');
console.log('$ openssl s_client -connect localhost:8888 to see the log ongoing..');
console.log('After 40 seconds, we will remove the hook.');

hook.stdout(hook.tlsclient(8888, 'key.pem', 'cert.pem'), AlsoPrintToStdout=false);

var i=0;
setInterval(function(){
	console.log('This is console log output');
	// After 40 seconds, we will remove the hook.
	if(i++ > 20) hook.unstdout();
}, 2000);
