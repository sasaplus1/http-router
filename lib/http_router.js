// http-router Copyright(c) 2012 sasa+1
// https://github.com/sasaplus1/http-router
// Released under the MIT License.

var ROUTE_LIST_SUFFIX_ = 'RouteList_';

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

  isCalledHandler = routes.route(req.url, req, res);

  // call handlers for no path if never called handlers
  if (!isCalledHandler) {
    routes.route(void 0, req, res);
  }

  return isCalledHandler;
};



function RouteList() {
  this.routes_ = [];
}

RouteList.prototype.add = function(path, handler) {
  // add(handler)
  if (typeof path === 'function' && handler === void 0) {
    handler = path;
    path = void 0;
  }

  this.routes_.push({
    path: path,
    handler: handler
  });
};

RouteList.prototype.route = function(path, req, res) {
  var routes = this.routes_,
      isCalledHandler = false,
      isCallNext = false,
      i, len;

  for (i = 0, len = routes.length; i < len; ++i) {
    if (routes[i].path === path) {
      isCalledHandler = true;
      isCallNext = routes[i].handler(req, res, function() {
        return true;
      });

      if (!isCallNext) {
        break;
      }
    }
  }

  return isCalledHandler;
};

module.exports = HttpRouter;
