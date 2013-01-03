// http-router Copyright(c) 2012 sasa+1
// https://github.com/sasaplus1/http-router
// Released under the MIT License.

function RouteList() {
  this.routes_ = [];
}

RouteList.prototype.add = function(path, handler) {
  var hasPlaceholder = false,
      placeholderRegExp, paramKeys;

  // add(handler)
  if (typeof path === 'function' && handler === void 0) {
    handler = path;
    path = void 0;
  }

  // replace regex from string if path has placeholder
  if (typeof path === 'string' && /\/:[^/]+/.test(path)) {
    hasPlaceholder = true;
    placeholderRegExp = /\/:[^/]+/g;
    paramKeys = path.match(placeholderRegExp);
    path = new RegExp('^' + path.replace(placeholderRegExp, '/([^/]+)') + '$');
  }

  this.routes_.push({
    path: path,
    handler: handler,
    paramKeys: paramKeys,
    hasPlaceholder: hasPlaceholder
  });
};

RouteList.prototype.route = function(path, req, res) {
  var routes = this.routes_,
      isCalledHandler = false,
      isCallNext = false,
      i, len;

  for (i = 0, len = routes.length; i < len; ++i) {
    if (isMatchPath(routes[i], path)) {
      routes[i].hasPlaceholder &&
          (req.params = getRequestParams(routes[i], path));
      isCalledHandler = true;
      isCallNext = routes[i].handler(req, res, function() {
        return true;
      });
      delete req.params;

      if (!isCallNext) {
        break;
      }
    }
  }

  return isCalledHandler;



  function isMatchPath(route, path) {
    if (path !== void 0 && route.hasPlaceholder) {
      return (path.match(route.path) !== null);
    } else {
      return (route.path === path);
    }
  }

  function getRequestParams(route, path) {
    var matches = path.match(route.path),
        params = [],
        i, len;

    if (matches === null) {
      return params;
    }

    for (i = 1, len = matches.length; i < len; ++i) {
      // slice(2) doing delete "/:"
      params[route.paramKeys[i - 1].slice(2)] = matches[i];
    }

    return params;
  }
};

module.exports = RouteList;
