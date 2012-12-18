var assert = require('chai').assert,
    sinon = require('sinon'),
    router = require('../');

suite('http-routerのテスト', function() {

  var routes;

  setup(function() {
    routes = new router;
  });

  teardown(function() {
    routes = null;
  });

  test('登録した関数が呼ばれること', function() {
    var methods = { get1: function(req, res, next) {} },
        mock = sinon.mock(methods);

    mock.expects('get1').once();

    routes
      .get('/', methods.get1)
      .route({ method: 'GET', url: '/' }, {});

    assert.isTrue(mock.verify(), 'get1() is called once');
  });

  test('複数登録した関数が順番に呼ばれること', function() {
    var methods = {
      post1: function(req, res, next) { return next(); },
      post2: function(req, res, next) { return next(); },
      post3: function(req, res, next) { return next(); }
    }, spy1 = sinon.spy(methods, 'post1'),
       spy2 = sinon.spy(methods, 'post2'),
       spy3 = sinon.spy(methods, 'post3');

    routes
      .post('/post', methods.post1)
      .post('/post', methods.post2)
      .post('/post', methods.post3)
      .route({ method: 'POST', url: '/post' }, {});

    assert.isTrue(spy1.called, 'post1() is called');
    assert.isTrue(spy2.calledAfter(spy1), 'post2() called after post1()');
    assert.isTrue(spy3.calledAfter(spy2), 'post3() called after post2()');
  });

  test('一致したパスのメソッドのみ呼ばれること', function() {
    var methods = {
      put1: function(req, res, next) { return next(); },
      put2: function(req, res, next) { return next(); },
      put3: function(req, res, next) { return next(); }
    }, spy1 = sinon.spy(methods, 'put1'),
       spy2 = sinon.spy(methods, 'put2'),
       spy3 = sinon.spy(methods, 'put3');

    routes
      .put('/1', methods.put1)
      .put('/2', methods.put2)
      .put('/3', methods.put3)
      .route({ method: 'PUT', url: '/3'}, {});

    assert.isFalse(spy1.called, 'put1() is not called');
    assert.isFalse(spy2.called, 'put2() is not called');
    assert.isTrue(spy3.called, 'put3() is called');
  });

  test('他のメソッドに登録した関数が呼ばれないこと', function() {
    var methods = {
      delete1:  function(req, res, next) { return next(); },
      options1: function(req, res, next) { return next(); }
    }, spy1 = sinon.spy(methods, 'delete1'),
       spy2 = sinon.spy(methods, 'options1');

    routes
      .delete('/delete', methods.delete1)
      .options('/options', methods.options1)
      .route({ method: 'OPTIONS', url: '/options' }, {});

    assert.isFalse(spy1.called, 'delete1() is not called');
    assert.isTrue(spy2.called, 'options1() is called');
  });

  test('next()を呼ばないと次の関数が呼ばれないこと', function() {
    var methods = {
      trace1: function(req, res, next) {},
      trace2: function(req, res, next) {}
    }, spy1 = sinon.spy(methods, 'trace1'),
       spy2 = sinon.spy(methods, 'trace2');

    routes
      .trace('/trace', methods.trace1)
      .trace('/trace', methods.trace2)
      .route({ method: 'TRACE', url: '/trace' }, {});

    assert.isTrue(spy1.called, 'trace1() is called');
    assert.isFalse(spy2.called, 'trace2() is not called');
  });

});