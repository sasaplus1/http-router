/*!
 * http-router Copyright(c) 2012 sasa+1
 * https://github.com/sasaplus1/http-router
 * Released under the MIT License.
 */

var routes = require('./routes');

// create HTTP method methods
(['options',
  'get',
  'head',
  'post',
  'put',
  'delete',
  'trace',
  'connect',
  'patch']).forEach(function(method) {
  Router.prototype[method] = function(path, callback) {
    this.routes_[method] || (this.routes_[method] = routes.createRoutes());
    this.routes_[method].append(path, callback);

    return this;
  };
});



/**
 * route control class
 *
 * @constructor
 */
function Router() {
  this.routes_ = {};
}


/**
 * get new Router instance
 *
 * @return {Router} Router instance.
 */
Router.createRouter = function() {
  return new Router;
};


/**
 * call appended callbacks
 *
 * @param {IncomingMessage} req http.IncomingMessage object.
 * @param {ServerResponse} res http.ServerResponse object.
 * @return {Boolean} return true if called callback.
 */
Router.prototype.route = function(req, res) {
  var method = req.method.toLowerCase(),
      routes = this.routes_[method];

  // if not appended path
  if (!routes) {
    return false;
  }

  // call callback for empty path if not match path
  return (routes.route(req, res, req.url) || routes.route(req, res, undefined));
};


/** export Router class */
module.exports = Router;
