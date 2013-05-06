var purgatory = require('../index.js'),
    assert  = require('assert'),
    mock = function (ip) {
        var mocked = {
            req: { connection: { remoteAddress: ip } },
            resp: { statusCode: 200, end: function () {} },
            next: function () { mocked.nextCalled = true; },
            nextCalled: false
        };

        return mocked;
    };

module.exports = {
    'Bless' : {
        '127.0.0.1/32': function () {
            var bless = purgatory(['127.0.0.1/32']).bless(),
                mocked = mock('127.0.0.1');

            bless(mocked.req, mocked.resp, mocked.next);

            assert.ok(mocked.nextCalled);
            assert.equal(mocked.resp.statusCode, 200);
        },
        '192.30.252.0/22' : {
            '192.30.252.1': function () {
                var bless = purgatory(['192.30.252.0/22']).bless(),
                    mocked = mock('192.30.252.1');

                bless(mocked.req, mocked.resp, mocked.next);

                assert.ok(mocked.nextCalled);
                assert.equal(mocked.resp.statusCode, 200);
            },
            '192.30.255.255': function () {
                var bless = purgatory(['192.30.252.0/22']).bless(),
                    mocked = mock('192.30.255.255');

                bless(mocked.req, mocked.resp, mocked.next);

                assert.ok(mocked.nextCalled);
                assert.equal(mocked.resp.statusCode, 200);
            },
            '192.30.253.0': function () {
                var bless = purgatory(['192.30.252.0/22']).bless(),
                    mocked = mock('192.30.253.0');

                bless(mocked.req, mocked.resp, mocked.next);

                assert.ok(mocked.nextCalled);
                assert.equal(mocked.resp.statusCode, 200);
            },
            '192.31.255.255': function () {
                var bless = purgatory(['192.30.252.0/22']).bless(),
                    mocked = mock('192.31.255.255');

                bless(mocked.req, mocked.resp, mocked.next);

                assert.ok(mocked.nextCalled === false);
                assert.equal(mocked.resp.statusCode, 403);
            }
        }
    },
    'Cursed' : {
        '127.0.0.1/32': function () {
            var bless = purgatory(['127.0.0.1/32']).curse(),
                mocked = mock('127.0.0.1');

            bless(mocked.req, mocked.resp, mocked.next);

            assert.ok(mocked.nextCalled === false);
            assert.equal(mocked.resp.statusCode, 403);
        }
    }

};
