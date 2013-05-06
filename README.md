Connect-Blessed
===============

[Connect](https://github.com/senchalabs/connect) middleware to define a whitelist/blacklist of IPv4 ranges.

[![Build Status](https://travis-ci.org/Couto/connect-blessed.png?branch=master)](https://travis-ci.org/Couto/connect-blessed)

Instalation & Usage
-------------------

In the terminal inside the project's folder.

```shell
cd node_modules && git clone https://github.com/Couto/connect-blessed.git
```


then in the server's file:

```javascript
var http = require('http'),
    connect = require('connect'),
    connect-blessed = require('connect-blessed');

var server = connect()
    .use(connect-blessed([
        "207.97.227.253/32",
        "50.57.128.197/32",
        "108.171.174.178/32",
        "50.57.231.61/32",
        "204.232.175.64/27",
        "192.30.252.0/22"
    ]).blessed());

http.createServer(server)
    .listen(3000);
```

TODO
----
 
 * Get another name that allow to do `something([ips]).bless();` without repeating words ;)

Credits
-------

thanks to [@gnclmorais](https://github.com/gnclmorais) & [@carlosdavidepto](https://github.com/carlosdavidepto) for helping understanding IP ranges and 
for providing a model function to verify if an IP belong to a range.
