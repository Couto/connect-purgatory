module.exports = function (cidrs) {
    'use strict';
// Create an array with n length and fill it with ones.
// Create a  second array with 32 - n length and fill it with zeros.
// Convert and concat them to strings.
// We now possess the model to compare the ip.
    var netmask = function (n) {
            return parseInt(new Array(n + 1).join('1') + (new Array(33 - n).join('0')), 2);
        },
// Split the 127.0.0.1/32 to get the range byte, assume 32 if it hasn't a range
        splitRange = function (range) {
            return parseInt(range.split('/')[1], 10) || 32;
        },
// Convert the given ip to binary
        ip2bin = function (ip) {
            var bytes = ip.split('.'),
                len = bytes.length,
                bin = 0,
                i = 0;

            for (i; i < len; i += 1) {
                bin += Math.pow(256, 3 - i) * parseInt(bytes[i], 10);
            }

            return bin;
        },
// Check if the given ip matches any of the previously given ranges
        isBlessed = function (ip) {

            var ipbin = ip2bin(ip);

            return cidrs.some(function (cdir) {
                var tmp = cdir.split('/'),
                    cdirIP = tmp[0],
                    bits = parseInt(tmp[1], 10),

                    bin = ip2bin(cdirIP),
                    mask = netmasks[bits];
// Turn off the bitwise warning since its use is perfectly valid here
                /*jshint bitwise:false*/
                return ((bin & mask) === (ipbin & mask));
            });

        },

        netmasks = {};

// Make sure is an array even if they pass a string
// I'm being a smartass here... [Duck-wrapping](http://brehaut.net/blog/2013/duck_wrapping)
    cidrs = [].concat(cidrs);

// Generate the netmask table
    cidrs.map(splitRange).forEach(function (range) {
        netmasks[range] = netmask(range);
    });


    return {
// By calling `bless`, the user is saying that the previous
// ip ranges are the only ip ranges allowed.
        bless: function () {
            return function (req, resp, next) {
                // if the connection IP belongs to any ip range
                // given before, then it's good to go.
                if (isBlessed(req.connection.ip)) { next(); }
                else {
                    resp.statusCode = 403;
                    resp.end();
                }
            };
        },
// By calling `curse`, the user is saying that the previous
// ip ranges are forbidden.
        curse: function () {
            return function (req, resp, next) {
// if the connection IP belongs to any ip range
// given before, then we must say that the status code is 403
// and the connection should end
                if (!isBlessed(req.connection.ip)) { next(); }
                else {
                    resp.statusCode = 403;
                    resp.end();
                }
            };
        }
    };
};
