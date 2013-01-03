var assert = require('chai').assert,
    sinon = require('sinon'),
    router = require('../');

suite('http-routerのテスト', function() {

  suite('メソッド・パスに関するテスト', function() {
    var routes;

    setup(function() {
      routes = new router;
    });

    teardown(function() {
      routes = null;
    });

    test('メソッドとパスに一致した関数が呼ばれること', function() {
      var methods = { get1: function(req, res, next) {} },
          spy1 = sinon.spy(methods, 'get1');

      assert.isTrue(
          routes
            .get('/', methods.get1)
            .route({ method: 'GET', url: '/' }, {}),
          'route() returns true');

      assert.isTrue(spy1.called, 'get1() is called');
    });

    test('メソッドとパスに一致した複数の関数が呼ばれること', function() {
      var methods = {
        post1: function(req, res, next) { return next(); },
        post2: function(req, res, next) { return next(); },
        post3: function(req, res, next) { return next(); }
      },
          spy1 = sinon.spy(methods, 'post1'),
          spy2 = sinon.spy(methods, 'post2'),
          spy3 = sinon.spy(methods, 'post3');

      assert.isTrue(
          routes
            .post('/', methods.post1)
            .post('/', methods.post2)
            .post('/', methods.post3)
            .route({ method: 'POST', url: '/' }, {}),
          'route() returns true');

      assert.isTrue(spy1.called, 'post1() is called');
      assert.isTrue(spy2.calledAfter(spy1), 'post2() called after post1()');
      assert.isTrue(spy3.calledAfter(spy2), 'post3() called after post2()');
    });

    test('メソッドに一致したパス無し関数が呼ばれること', function() {
      var methods = { get1: function(req, res, next) {} },
          spy1 = sinon.spy(methods, 'get1');

      assert.isTrue(
          routes
            .get(methods.get1)
            .route({ method: 'GET', url: '/' }, {}),
          'route() returns true');

      assert.isTrue(spy1.called, 'get1() is called');
    });

    test('メソッドに一致した複数のパス無し関数が呼ばれること', function() {
      var methods = {
        post1: function(req, res, next) { return next(); },
        post2: function(req, res, next) { return next(); },
        post3: function(req, res, next) { return next(); }
      },
          spy1 = sinon.spy(methods, 'post1'),
          spy2 = sinon.spy(methods, 'post2'),
          spy3 = sinon.spy(methods, 'post3');

      assert.isTrue(
          routes
            .post(methods.post1)
            .post(methods.post2)
            .post(methods.post3)
            .route({ method: 'POST', url: '/' }, {}),
          'route() returns true');

      assert.isTrue(spy1.called, 'post1() is called');
      assert.isTrue(spy2.calledAfter(spy1), 'post2() called after post1()');
      assert.isTrue(spy3.calledAfter(spy2), 'post3() called after post2()');
    });

    test('メソッドに一致しない関数が呼ばれないこと', function() {
      var methods = {
        head1: function(req, res, next) {},
        post1: function(req, res, next) {}
      },
          spy1 = sinon.spy(methods, 'head1'),
          spy2 = sinon.spy(methods, 'post1');

      assert.isTrue(
          routes
            .head('/', methods.head1)
            .post('/', methods.post1)
            .route({ method: 'POST', url: '/' }, {}),
          'route() returns true');

      assert.isFalse(spy1.called, 'head1() is not called');
      assert.isTrue(spy2.called, 'post1() is called');
    });

    test('パスに一致しない関数が呼ばれないこと', function() {
      var methods = {
        get1: function(req, res, next) {},
        get2: function(req, res, next) {}
      },
          spy1 = sinon.spy(methods, 'get1'),
          spy2 = sinon.spy(methods, 'get2');

      assert.isFalse(
          routes
            .get('/', methods.get1)
            .get('/', methods.get2)
            .route({ method: 'POST', url: '/' }, {}),
          'route() returns false');

      assert.isFalse(spy1.called, 'get1() is not called');
      assert.isFalse(spy2.called, 'get2() is not called');
    });

    test('パスが一致しない場合パス無し関数だけ呼ばれること', function() {
      var methods = {
        get1: function(req, res, next) { return next(); },
        get2: function(req, res, next) { return next(); },
        get3: function(req, res, next) { return next(); }
      },
          spy1 = sinon.spy(methods, 'get1'),
          spy2 = sinon.spy(methods, 'get2'),
          spy3 = sinon.spy(methods, 'get3');

      assert.isTrue(
          routes
            .get('/', methods.get1)
            .get('/', methods.get2)
            .get(methods.get3)
            .route({ method: 'GET', url: '/unknown' }, {}),
          'route() returns true');

      assert.isFalse(spy1.called, 'get1() is not called');
      assert.isFalse(spy2.called, 'get2() is not called');
      assert.isTrue(spy3.called, 'get3() is called');
    });

    test('いずれにも一致しない場合falseが返ること', function() {
      var methods = {
        post1: function(req, res, next) { return next(); },
        post2: function(req, res, next) { return next(); },
        post3: function(req, res, next) { return next(); }
      },
          spy1 = sinon.spy(methods, 'post1'),
          spy2 = sinon.spy(methods, 'post2'),
          spy3 = sinon.spy(methods, 'post3');

      assert.isFalse(
          routes
            .post('/', methods.post1)
            .post('/', methods.post2)
            .post('/', methods.post3)
            .route({ method: 'HEAD', url: '/unknown' }, {}),
          'route() returns false');

      assert.isFalse(spy1.called, 'post1() is not called');
      assert.isFalse(spy2.called, 'post2() is not called');
      assert.isFalse(spy3.called, 'post3() is not called');
    });
  });

  suite('パスのプレースホルダに関するテスト', function() {
    var routes;

    setup(function() {
      routes = new router;
    });

    teardown(function() {
      routes = null;
    });

    test('プレースホルダがreq.paramsから取得できること', function() {
      assert.isTrue(
          routes
             .get('/:key/:value', function(req, res, next) {
                assert.strictEqual(req.params.key, 'key',
                    'req.params.key equals "key"');
                assert.strictEqual(req.params.value, 'value',
                    'req.params.value equals "value"');
              })
             .route({ method: 'GET', url: '/key/value' }, {}),
          'route() returns true');
    });

    test('プレースホルダに一致しない場合は関数が呼ばれないこと', function() {
      var methods = {
        get1: function(req, res, next) { return next(); },
        get2: function(req, res, next) { return next(); },
        get3: function(req, res, next) { return next(); }
      },
          spy1 = sinon.spy(methods, 'get1'),
          spy2 = sinon.spy(methods, 'get2'),
          spy3 = sinon.spy(methods, 'get3');

      assert.isFalse(
          routes
          .get('/:key', methods.get1)
          .get('/:key', methods.get2)
          .get('/:key', methods.get3)
          .route({ method: 'GET', url: '/key/value' }, {}),
          'route() returns false');

      assert.isFalse(spy1.called, 'get1() is not called');
      assert.isFalse(spy2.called, 'get2() is not called');
      assert.isFalse(spy3.called, 'get3() is not called');
    });
  });

});
