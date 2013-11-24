/*!
 * http-router Copyright(c) 2012 sasa+1
 * https://github.com/sasaplus1/http-router
 * Released under the MIT License.
 */



/**
 * route list control class
 *
 * @constructor
 */
function Routes() {
  this.routes_ = [];
}


/**
 * get new Routes instance
 *
 * @return {Routes} Routes instance.
 */
Routes.createRoutes = function() {
  return new Routes;
};


/**
 * append route
 *
 * @param {String|Function|Object} path url path.
 * @param {Function|undefined} callback callback function.
 */
Routes.prototype.append = function(path, callback) {
  var isRegExp = false,
      placeholder, paramKeys;

  if (callback === undefined) {
    switch (typeof path) {
      // if called by append(callback)
      case 'function':
        callback = path;
        path = undefined;
        break;
      // if called by append({path: 'url', callback: fn})
      case 'object':
        /* throw error if path is null */
        callback = path.callback;
        path = path.path;
        break;
    }
  }

  // if path has placeholder
  if (/\/:[^\/]+/.test(path)) {
    isRegExp = true;
    placeholder = /\/:[^\/]+/g;
    paramKeys = path.match(placeholder);
    path = new RegExp('^' + path.replace(placeholder, '/([^/]+)') + '$');
  }

  this.routes_.push({
    path: path,
    callback: callback,
    paramKeys: paramKeys,
    isRegExp: isRegExp
  });
};


/**
 * call appended callbacks
 *
 * @param {IncomingMessage} req http.IncomingMessage object.
 * @param {ServerResponse} res http.ServerResponse object.
 * @param {String} path url path.
 * @return {Boolean} return true if called callback.
 */
Routes.prototype.route = function(req, res, path) {
  var routes = this.routes_,
      isCalled = false,
      isCallNext = false,
      i, len;

  for (i = 0, len = routes.length; i < len; ++i) {
    if (this.matchPath_(routes[i], path)) {
      // set params if path is regexp
      routes[i].isRegExp && (req.params = this.getParamKeys_(routes[i], path));

      // call callback
      isCalled = true;
      isCallNext = routes[i].callback(req, res, function() {
        return true;
      });
      delete req.params;

      // break loop if not called next()
      if (!isCallNext) {
        break;
      }
    }
  }

  return isCalled;
};


/**
 * return matching path
 *
 * @private
 * @param {Object} route route data.
 * @param {String} path url path.
 * @return {Boolean} return true if matching path.
 */
Routes.prototype.matchPath_ = function(route, path) {
  if (path !== undefined && route.isRegExp) {
    return (path.match(route.path) !== null);
  } else {
    return (route.path === path);
  }
};


/**
 * return placeholder keys and values
 *
 * @private
 * @param {Object} route route data.
 * @param {String} path url path.
 * @return {Object} placeholder keys and values.
 */
Routes.prototype.getParamKeys_ = function(route, path) {
  var matches = path.match(route.path),
      params = {},
      i, len;

  // return empty array if not match
  if (matches === null) {
    return params;
  }

  // append params
  for (i = 1, len = matches.length; i < len; ++i) {
    // '/:paramKey'.slice(2) === 'paramKey'
    params[route.paramKeys[i - 1].slice(2)] = matches[i];
  }

  return params;
};


/** export Routes class */
module.exports = Routes;
