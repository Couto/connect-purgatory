loghooks-node
==================
###Simple helper to hook stdout, console log to remote clients, file, or custom function

#### Example

```javascript
var hook = require('loghooks-node');
hook.stdout(hook.tlsclient(8888, 'key.pem', 'cert.pem'), AlsoPrintToStdout=false);
```

See the test-* files for examples

There are many logging modules out there, but you may have used console.log, or stdout in
existing code, right?

You would have to go back and rework that..  OR..  Just hook stdout with this module.

#####Supported are:
 TCP client (connect to your app remotely for live log updates over telnet)  
```javascript
hook.stdout(hook.tcpclient(8888), AlsoPrintToStdout=false);
```
 TLS client (like TCP but encrypted using tls/ssl)  
```javascript
hook.stdout(hook.tlsclient(8888, 'key.pem', 'cert.pem'), AlsoPrintToStdout=false);
```
 File (just write to a file)  
```javascript
hook.stdout(hook.file('hookedlog.txt'), AlsoPrintToStdout=false);
```
 Uncaught (hook uncaught exceptions)  
```javascript
hook.uncaught(function(s){
  	console.log('caught exception here.. ' + s);
});
```
 Custom functions (use your function to handle console.log)
```javascript
function myfunc(s){
  // note stdout was hooked, not stderr..
	process.stderr.write('Custom func sez: '+s);
}

hook.stdout(myfunc, AlsoPrintToStdout=false);
```
