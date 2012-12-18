// http-router Copyright(c) 2012 sasa+1
// https://github.com/sasaplus1/http-router
// Released under the MIT License.

function HttpRouter() {}

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

HttpRouter.prototype.get =
    function(path, cb) { return addRoute_.call(this, 'get', path, cb); };
HttpRouter.prototype.post =
    function(path, cb) { return addRoute_.call(this, 'post', path, cb); };
HttpRouter.prototype.put =
    function(path, cb) { return addRoute_.call(this, 'put', path, cb); };
HttpRouter.prototype.delete =
    function(path, cb) { return addRoute_.call(this, 'delete', path, cb); };
HttpRouter.prototype.options =
    function(path, cb) { return addRoute_.call(this, 'options', path, cb); };
HttpRouter.prototype.trace =
    function(path, cb) { return addRoute_.call(this, 'trace', path, cb); };
HttpRouter.prototype.connect =
    function(path, cb) { return addRoute_.call(this, 'connect', path, cb); };
HttpRouter.prototype.patch =
    function(path, cb) { return addRoute_.call(this, 'patch', path, cb); };

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
