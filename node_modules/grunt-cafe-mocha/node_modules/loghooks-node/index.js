(function(r) {

    var _fn = {}, _dbs = {}, oldstdout = null;

    _fn.stdout = function(callback, addl) {
        oldstdout = process.stdout.write;
        process.stdout.write = (function(write) {
            return function(string, encoding, fd) {
                if(addl) write.apply(process.stdout, arguments)
                callback(string, encoding, fd)
            }
        })(process.stdout.write)
    }

    _fn.unstdout = function(callback) {
        process.stdout.write = oldstdout;
    }

    _fn.sock = { write: function() { } }

    _fn.tcpclient = function(port) {
        require('net').createServer(function(socket) {
            socket.on('close', function() {
                _fn.sock = { write: function() { } }
            })
            socket.on('end', function() {
                _fn.sock = { write: function() { } }
            })
            console.log('TCP client connected');
            _fn.sock = socket;
        }).listen(port);

        return function(s) {
            _fn.sock.write(s);
        }
    }

    // connect like this..  openssl s_client -connect 127.0.0.1:8000
    _fn.tlsclient = function(port, keyfile, certfile) {
        var tls = require('tls'), fs = require('fs');
        var options = {
            key: fs.readFileSync(keyfile),
            cert: fs.readFileSync(certfile)
        }
        tls.createServer(options, function(socket) {
            socket.on('close', function() {
                _fn.sock = { write: function() { } }
            })
            socket.on('end', function() {
                _fn.sock = { write: function() { } }
            })
            console.log('TLS client connected');
            _fn.sock = socket;
        }).listen(port);

        return function(s) {
            _fn.sock.write(s);
        }
    }

    _fn.file = function(name) {
        _fn.sock = require('fs').createWriteStream(name, { 'flags': 'a' });
        return function(s) {
            _fn.sock.write(s + '\n');
        }
    }

    _fn.uncaught = function(f) {
        process.on('uncaughtException', function(exception) {
            f(exception);
        });
    }

    //Finally - export the whole thing - need to use the actual name thus
    module.exports = _fn;

})(require);
