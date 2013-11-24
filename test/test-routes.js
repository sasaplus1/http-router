var expect = require('expect.js'),
    sinon = require('sinon'),
    routes = require('../lib/routes');

describe('Routes', function() {

  describe('#createRoutes()', function() {

    it('should be return Routes instance', function() {
      expect(routes.createRoutes()).to.be.a(routes);
    });

  });

  describe('#append()', function() {

    var route;

    function route1() {}
    function route2() {}
    function route3() {}

    beforeEach(function() {
      route = routes.createRoutes();
    });

    afterEach(function() {
      route = null;
    });

    it('should be append route (route has empty path)', function() {
      route.append(route1);
      route.append(route2);
      route.append(route3);

      expect(route.routes_).to.eql([
        {
          path: undefined,
          callback: route1,
          paramKeys: undefined,
          isRegExp: false
        },
        {
          path: undefined,
          callback: route2,
          paramKeys: undefined,
          isRegExp: false
        },
        {
          path: undefined,
          callback: route3,
          paramKeys: undefined,
          isRegExp: false
        }
      ]);
    });

    it('should be append route (route has not empty path)', function() {
      route.append('/route1', route1);
      route.append('/route2', route2);
      route.append('/route3', route3);

      expect(route.routes_).to.eql([
        {
          path: '/route1',
          callback: route1,
          paramKeys: undefined,
          isRegExp: false
        },
        {
          path: '/route2',
          callback: route2,
          paramKeys: undefined,
          isRegExp: false
        },
        {
          path: '/route3',
          callback: route3,
          paramKeys: undefined,
          isRegExp: false
        }
      ]);
    });

    it('should be append route (path is object)', function() {
      route.append({path: '/route1', callback: route1});
      route.append({path: '/route2', callback: route2});
      route.append({path: '/route3', callback: route3});

      expect(route.routes_).to.eql([
        {
          path: '/route1',
          callback: route1,
          paramKeys: undefined,
          isRegExp: false
        },
        {
          path: '/route2',
          callback: route2,
          paramKeys: undefined,
          isRegExp: false
        },
        {
          path: '/route3',
          callback: route3,
          paramKeys: undefined,
          isRegExp: false
        }
      ]);
    });

    it('should be append route (path has placeholder)', function() {
      route.append('/:key1/:param1', route1);
      route.append('/:key2/:param2', route2);
      route.append('/:key3/:param3', route3);

      expect(route.routes_).to.eql([
        {
          path: /^\/([^\/]+)\/([^\/]+)$/,
          callback: route1,
          paramKeys: ['/:key1', '/:param1'],
          isRegExp: true
        },
        {
          path: /^\/([^\/]+)\/([^\/]+)$/,
          callback: route2,
          paramKeys: ['/:key2', '/:param2'],
          isRegExp: true
        },
        {
          path: /^\/([^\/]+)\/([^\/]+)$/,
          callback: route3,
          paramKeys: ['/:key3', '/:param3'],
          isRegExp: true
        }
      ]);
    });

  });

  describe('#route()', function() {

    var route;

    beforeEach(function() {
      route = routes.createRoutes();
    });

    afterEach(function() {
      route = null;
    });

    it('should be return true if matching route', function() {
      var method = {
        callback: function(req, res, next) {}
      },
          spy = sinon.spy(method, 'callback');

      route.append('/', spy);
      route.route({}, {}, '/');

      expect(spy.called).to.be(true);
    });

    it('should be return true if matching route (has placeholder)', function() {
      var method = {
        callback: function(req, res, next) {
          expect(req.params).to.have.property('file', 'index.html');
        }
      },
          spy = sinon.spy(method, 'callback');

      route.append('/:file', spy);
      route.route({}, {}, '/index.html');

      expect(spy.called).to.be(true);
    });

    it('should be return false if not matching route', function() {
      var method = {
        callback: function(req, res, next) {}
      },
          spy = sinon.spy(method, 'callback');

      route.append('/', spy);
      route.route({}, {}, '/index.html');

      expect(spy.called).to.be(false);
    });

  });

  describe('#matchPath_()', function() {

    var route;

    beforeEach(function() {
      route = routes.createRoutes();
    });

    afterEach(function() {
      route = null;
    });

    it('should be return true if matching path', function() {
      expect(
          route.matchPath_({
            path: '/',
            isRegExp: false
          }, '/')
      ).to.be(true);
    });

    it('should be return false if not matching path', function() {
      expect(
          route.matchPath_({
            path: '/',
            isRegExp: false
          }, '/index.html')
      ).to.be(false);
    });

    it('should be return true if matching regexp', function() {
      expect(
          route.matchPath_({
            path: /^\/([^\/]+)$/,
            isRegExp: true
          }, '/index.html')
      ).to.be(true);
    });

    it('should be return false if not matching regexp', function() {
      expect(
          route.matchPath_({
            path: /^\/([^\/]+)\/([^\/]+)$/,
            isRegExp: true
          }, '/path/to/index.html')
      ).to.be(false);
    });

  });

  describe('#getParamKeys_()', function() {

    var route;

    beforeEach(function() {
      route = routes.createRoutes();
    });

    afterEach(function() {
      route = null;
    });

    it('should be return path data if matching path', function() {
      expect(
          route.getParamKeys_({
            path: /^\/([^\/]+)\/([^\/]+)$/,
            paramKeys: ['/:directory', '/:script']
          }, '/script/index.js')
      ).to.eql({
        directory: 'script',
        script: 'index.js'
      });
    });

    it('should be return empty path data if not matching path', function() {
      expect(
          route.getParamKeys_({
            path: /^\/([^\/]+)\/([^\/]+)$/,
            paramKeys: ['/:directory', '/:file']
          }, '/script/js/index.js')
      ).to.be.empty();
    });

  });

});
