var assert = require('chai').assert,
    sinon = require('sinon'),
    routeList = require('../lib/route_list');

suite('route-listのテスト', function() {

  suite('addメソッドに関するテスト', function() {

    function a() {}
    function b() {}
    function c() {}

    var routes;

    setup(function() {
      routes = new routeList;
    });

    teardown(function() {
      routes = null;
    });

    test('パスを指定せずに追加できること', function() {
      routes.add(a);
      routes.add(b);
      routes.add(c);

      assert.deepEqual(routes.routes_, [
            { path: void 0, handler: a,
              paramKeys: void 0, hasPlaceholder: false },
            { path: void 0, handler: b,
              paramKeys: void 0, hasPlaceholder: false },
            { path: void 0, handler: c,
              paramKeys: void 0, hasPlaceholder: false }
          ], 'routes_ should be has some undefined paths');
    });

    test('プレースホルダを含まないパスを指定して追加できること', function() {
      routes.add('/a', a);
      routes.add('/b', b);
      routes.add('/c', c);

      assert.deepEqual(routes.routes_, [
            { path: '/a', handler: a,
              paramKeys: void 0, hasPlaceholder: false },
            { path: '/b', handler: b,
              paramKeys: void 0, hasPlaceholder: false },
            { path: '/c', handler: c,
              paramKeys: void 0, hasPlaceholder: false }
          ], 'routes_ should be has some string paths');
    });

    test('プレースホルダを含んだパスを指定して追加できること', function() {
      routes.add('/:a/:aa', a);
      routes.add('/:b/:bb', b);
      routes.add('/:c/:cc', c);

      assert.deepEqual(routes.routes_, [
            { path: /^\/([^\/]+)\/([^\/]+)$/, handler: a,
              paramKeys: ['/:a', '/:aa'], hasPlaceholder: true },
            { path: /^\/([^\/]+)\/([^\/]+)$/, handler: b,
              paramKeys: ['/:b', '/:bb'], hasPlaceholder: true },
            { path: /^\/([^\/]+)\/([^\/]+)$/, handler: c,
              paramKeys: ['/:c', '/:cc'], hasPlaceholder: true }
          ], 'routes_ should be has some placeholder paths');
    });

  });

});
