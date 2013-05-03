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
        isBlessed = function (ip) {
            // @TODO Less C more Javascript
            var i_bytes = ip.split('.');
            var i_bin = 0;

            for (b = 0; b < i_bytes.length; b++) {
                i_bytes[b] = parseInt(i_bytes[b], 10);
                i_bin += Math.pow(256, 3 - b) * i_bytes[b];
            }

            for (var i = 0; i < cidrs.length; ++i) {
                var cidr = cidrs[i];
                var tmp  = cidr.split('/');

                var c_network = tmp[0];
                var c_bits    = parseInt(tmp[1], 10);
                var c_bytes   = c_network.split('.');
                var c_bin     = 0;

                for (var b = 0; b < c_bytes.length; ++b) {
                    c_bytes[b] = parseInt(c_bytes[b], 10);
                    c_bin += Math.pow(256, 3 - b) * c_bytes[b];
                }

                var mask = netmasks[c_bits];

                if ((c_bin & mask) === (i_bin & mask)) {
                    return true;
                }
            }

            return false;
        },

        netmasks = {};

    // Make sure is an array even if they pass a string
    cidrs = [].concat(cidrs);

    // Generate the netmask table
    cidrs.map(splitRange).forEach(function (range) {
        netmasks[range] = netmask(range);
    });


    return {
        // By calling `blessed`, the user is saying that the previous
        // ip ranges are the only ip ranges allowed.
        blessed: function () {
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
        // By calling `cursed`, the user is saying that the previous
        // ip ranges are forbidden.
        cursed: function () {
            return function (req, resp, next) {
                // if the connection IP belongs to any ip range
                // given before, then it's forbidden.
                if (!isBlessed(req.connection.ip)) { next(); }
                else {
                    resp.statusCode = 403;
                    resp.end();
                }
            };
        }
    };
}
