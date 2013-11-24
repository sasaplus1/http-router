var expect = require('expect.js'),
    sinon = require('sinon'),
    router = require('../lib/router');

describe('Router', function() {

  describe('#createRouter()', function() {

    it('should be return Router instance', function() {
      expect(router.createRouter()).to.be.a(router);
    });

  });

  describe('#{HTTP method}()', function() {

    var route;

    beforeEach(function() {
      route = router.createRouter();
    });

    afterEach(function() {
      route = null;
    });

    it('should be has HTTP method methods', function() {
      expect(route.options).to.be.a(Function);
      expect(route.get).to.be.a(Function);
      expect(route.head).to.be.a(Function);
      expect(route.post).to.be.a(Function);
      expect(route.put).to.be.a(Function);
      expect(route.delete).to.be.a(Function);
      expect(route.trace).to.be.a(Function);
      expect(route.connect).to.be.a(Function);
      expect(route.patch).to.be.a(Function);
    });

    it('should be append Routes instance', function() {
      expect(route.routes_).to.be.empty();
      expect(route.get('', function() {}).routes_).not.to.be.empty();
    });

    it('should be return own instance', function() {
      expect(route.options('', function() {})).to.be.a(router);
    });

  });

  describe('#route()', function() {

    var route;

    beforeEach(function() {
      route = router.createRouter();
    });

    afterEach(function() {
      route = null;
    });

    it('should be return true if matching route', function() {
      expect(
          route
            .get('/', function(req, res, next) {})
            .route({ method: 'GET', url: '/' }, {})
      ).to.be(true);

      expect(
          route
            .get({ path: '/', callback: function(req, res, next) {} })
            .route({ method: 'GET', url: '/' }, {})
      ).to.be(true);
    });

    it('should be return true if matching route has empty path', function() {
      expect(
          route
            .get(function(req, res, next) {})
            .route({ method: 'GET', url: '/' }, {})
      ).to.be(true);
    });

    it('should be return false if not matching any route', function() {
      expect(
          route
            .get('/index.html', function(req, res, next) {})
            .route({ method: 'GET', url: '/' }, {})
      ).to.be(false);
    });

    it('should be return false if router not has route', function() {
      expect(
          route
            .route({ method: 'GET', url: '/' }, {})
      ).to.be(false);
    });

  });

});
