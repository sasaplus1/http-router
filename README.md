# http-router

[![Build Status](https://travis-ci.org/sasaplus1/http-router.png)](https://travis-ci.org/sasaplus1/http-router)
[![Dependency Status](https://gemnasium.com/sasaplus1/http-router.png)](https://gemnasium.com/sasaplus1/http-router)

router module for node.js

## Installation

```sh
$ npm install http-router
```

## Usage

```js
var http = require('http'),
    router = require('http-router'),
    routes = router.createRouter();  // or routes = new router;

routes
  .get('/', function(req, res, next) {
    res.write('Hello, ');
    return next();
  })
  .get({
    path: '/',
    callback: function(req, res, next) {
      res.end('World!\n');
    }
  })
  .post('/', function(req, res, next) {
    res.write('PO');
    return next();
  })
  .post('/', function(req, res, next) {
    res.end('ST!\n');
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
    res.end(http.STATUS_CODES[404] + '\n');
  });

http.createServer(function(req, res) {
  if (!routes.route(req, res)) {
    res.writeHead(501);
    res.end(http.STATUS_CODES[501] + '\n');
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

### http-router#createRouter()

* `return` Router - new Router instance.

Return new Router instance. It's similar to `new require('http-router')`.

### Router#route(req, res)

* `req` http.IncomingMessage - IncomingMessage object
* `res` http.ServerResponse - ServerResponse object

* `return` boolean - return false if not called any callback functions.

Call appended callback functions if match to route's path.
Call empty path's callback if not match to any route's path.

### Router#options/get/head/post/put/delete/trace/connect/patch([path], callback)

* `path` string|function|object - request path
* `callback` function(req, res, next)|undefined - callback function
  * `req` http.IncomingMessage - IncomingMessage object
  * `res` http.ServerResponse - ServerResponse object
  * `next` function() - call next callback function

* `return` Router - return own instance.

Append path and callback function.

## License

The MIT License. Please see LICENSE file.
