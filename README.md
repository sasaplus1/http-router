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
  })
  .get('/:key1/:key2', function(req, res, next) {
    res.write('key1: ' + req.params.key1 + '\n');
    res.write('key2: ' + req.params.key2 + '\n');
    res.end();
  })
  .get(function(req, res, next) {
    res.writeHead(404);
    return next();
  })
  .get(function(req, res, next) {
    res.end(http.STATUS_CODES[404]);
  });

http.createServer(function(req, res) {
  if (!routes.route(req, res)) {
    res.writeHead(501);
    res.end(http.STATUS_CODES[501]);
  }
}).listen(3000);
```

```sh
$ curl -X GET http://localhost:3000
Hello, World!
$ curl -X POST http://localhost:3000
POST!
$ curl -X GET http://localhost:3000/111/222
key1: 111
key2: 222
$ curl -X GET http://localhost:3000/unknown
Not Found
$ curl -X PATCH http://localhost:3000
Not Implemented
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

* `return` boolean - return false if never called handler function.

Call added HTTP method handler functions. Call handlers for no path if never called handler functions.

### options/get/head/post/put/delete/trace/connect/patch([path], handler)

* `path` string - request path
* `handler` function(req, res, next) - handler function
  * `req` http.ServerRequest - http server request object
  * `res` http.ServerResponse - http server response object
  * `next` function() - call next function

* `return` HttpRouter - return this instance object.

Add HTTP method handler function. Add as no path handler if handler parameter only.

## License

The MIT License. Please see LICENSE file.
