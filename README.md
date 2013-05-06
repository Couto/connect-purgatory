connect-purgatory
===============

[Connect](https://github.com/senchalabs/connect) middleware to define a whitelist/blacklist of IPv4 ranges.

[![Build Status](https://travis-ci.org/Couto/connect-purgatory.png?branch=master)](https://travis-ci.org/Couto/connect-purgatory)

Instalation & Usage
-------------------

In the terminal inside the project's folder.

```shell
npm install connect-purgatory --save
```

then in the server's file:

```javascript
var http = require('http'),
    connect = require('connect'),
    purgatory = require('connect-purgatory');

var server = connect()
    .use(purgatory([
        "207.97.227.253/32",
        "50.57.128.197/32",
        "108.171.174.178/32",
        "50.57.231.61/32",
        "204.232.175.64/27",
        "192.30.252.0/22"
    ]).bless());

http.createServer(server)
    .listen(3000);
```

Credits
-------

thanks to [@gnclmorais](https://github.com/gnclmorais) & [@carlosdavidepto](https://github.com/carlosdavidepto) for helping understanding IP ranges and 
for providing a model function to verify if an IP belong to a range.
