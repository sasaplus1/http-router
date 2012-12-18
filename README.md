# http-router [![Build Status](https://travis-ci.org/sasaplus1/http-router.png)](https://travis-ci.org/sasaplus1/http-router)

router module for node.js

## Installation

```sh
$ npm install http-router
```

## Usage

```js
var http = require('http'),
    router = require('http-router'),
    routes = new router;

routes
  .get('/', function(req, res, next) {
    res.write('Hello,');
    return next();
  })
  .get('/', function(req, res, next) {
    res.write(' World');
    return next();
  })
  .get('/', function(req, res, next) {
    res.end('!\n');
  })
  .post('/', function(req, res, next) {
    res.write('PO');
    return next();
  })
  .post('/', function(req, res, next) {
    res.write('ST');
    return next();
  })
  .post('/', function(req, res, next) {
    res.end('!\n');
  });

http.createServer(function(req, res) {
  routes.route(req, res);
}).listen(3000);
```

```sh
$ curl -X GET http://localhost:3000
Hello, World!
$ curl -X POST http://localhost:3000
POST!
```

## Test

```sh
$ npm install
$ npm test
```

## Functions

### route(req, res)

* `req` http.ServerRequest - http server request object
* `res` http.ServerResponse - http server response object

* `return` boolean - return false if never called callback function.

call added HTTP method callback functions.

### get/post/put/delete/options/trace/connect/patch(path, cb)

* `path` string - request path
* `cb` function(req, res, next) - callback function
  * `req` http.ServerRequest - http server request object
  * `res` http.ServerResponse - http server response object
  * `next` function() - call next function

* `return` HttpRouter - return this instance object.

add HTTP method callback function.

## License

The MIT License. Please see LICENSE file.
