// http-router Copyright(c) 2012 sasa+1
// https://github.com/sasaplus1/http-router
// Released under the MIT License.

var RouteList = require('./route_list');

function HttpRouter() {}

var ROUTE_LIST_SUFFIX_ = 'RouteList_';

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
    var listName = method + ROUTE_LIST_SUFFIX_;

    this[listName] || (this[listName] = new RouteList);
    this[listName].add(path, handler);

    return this;
  };
});

HttpRouter.prototype.route = function(req, res) {
  var method = req.method.toLowerCase(),
      routes = this[method + ROUTE_LIST_SUFFIX_],
      isCalledHandler = false;

  if (!routes) {
    return false;
  }

  isCalledHandler = routes.route(req.url, req, res);

  // call handlers for no path if never called handlers
  if (!isCalledHandler) {
    routes.route(void 0, req, res);
  }

  return isCalledHandler;
};

module.exports = HttpRouter;
