// http-router Copyright(c) 2012 sasa+1
// https://github.com/sasaplus1/http-router
// Released under the MIT License.

function HttpRouter() {}

(['options',
  'get',
  'head',
  'post',
  'put',
  'delete',
  'trace',
  'connect',
  'patch']).forEach(function(method) {
  HttpRouter.prototype[method] = function(path, handler) {
    return addRoute_.call(this, method, path, handler);
  };
});

HttpRouter.prototype.route = function(req, res) {
  var called = false,
      method = req.method.toLowerCase(),
      routeList = getRouteList_.call(this, method);

  routeList.some(function(route) {
    if (req.url === route.path) {
      called = true;
      return !route.callback(req, res, function() {
        return true;
      });
    }
  });

  return called;
};

function addRoute_(method, uri, cb) {
  'use strict';

  var prop = method + 'RouteList_';

  this[prop] || (this[prop] = []);
  this[prop].push({ path: uri, callback: cb });

  return this;
}

function getRouteList_(method) {
  'use strict';

  return this[method + 'RouteList_'] || [];
}

module.exports = HttpRouter;
