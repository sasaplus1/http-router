// http-router Copyright(c) 2012 sasa+1
// https://github.com/sasaplus1/http-router
// Released under the MIT License.

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

module.exports = RouteList;
