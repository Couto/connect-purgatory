var blessed = require('../index.js'),
    assert  = require('assert'),
    mock = function (ip) {
        var mocked = {
            req: { connection: { ip: ip } },
            resp: { statusCode: 200, end: function () {} },
            next: function () { mocked.nextCalled = true; },
            nextCalled: false
        };

        return mocked;
    };

module.exports = {
    'Blessed' : {
        '127.0.0.1/32': function () {
            var bless = blessed(['127.0.0.1/32']).blessed(),
                mocked = mock('127.0.0.1');

            bless(mocked.req, mocked.resp, mocked.next);

            assert.ok(mocked.nextCalled);
            assert.equal(mocked.resp.statusCode, 200);
        },
        '192.30.252.0/22' : {
            '192.30.252.1': function () {
                var bless = blessed(['192.30.252.0/22']).blessed(),
                    mocked = mock('192.30.252.1');

                bless(mocked.req, mocked.resp, mocked.next);

                assert.ok(mocked.nextCalled);
                assert.equal(mocked.resp.statusCode, 200);
            },
            '192.30.255.255': function () {
                var bless = blessed(['192.30.252.0/22']).blessed(),
                    mocked = mock('192.30.255.255');

                bless(mocked.req, mocked.resp, mocked.next);

                assert.ok(mocked.nextCalled);
                assert.equal(mocked.resp.statusCode, 200);
            },
            '192.30.253.0': function () {
                var bless = blessed(['192.30.252.0/22']).blessed(),
                    mocked = mock('192.30.253.0');

                bless(mocked.req, mocked.resp, mocked.next);

                assert.ok(mocked.nextCalled);
                assert.equal(mocked.resp.statusCode, 200);
            },
            '192.31.255.255': function () {
                var bless = blessed(['192.30.252.0/22']).blessed(),
                    mocked = mock('192.31.255.255');

                bless(mocked.req, mocked.resp, mocked.next);

                assert.ok(mocked.nextCalled === false);
                assert.equal(mocked.resp.statusCode, 403);
            }
        }
    },
    'Cursed' : {
        '127.0.0.1/32': function () {
            var bless = blessed(['127.0.0.1/32']).cursed(),
                mocked = mock('127.0.0.1');

            bless(mocked.req, mocked.resp, mocked.next);

            assert.ok(mocked.nextCalled === false);
            assert.equal(mocked.resp.statusCode, 403);
        }
    }

};
