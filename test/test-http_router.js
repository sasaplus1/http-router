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

    assert.isTrue(
      routes
        .get('/', methods.get1)
        .route({ method: 'GET', url: '/' }, {}),
        'route() returns true');

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

    assert.isTrue(
      routes
        .post('/post', methods.post1)
        .post('/post', methods.post2)
        .post('/post', methods.post3)
        .route({ method: 'POST', url: '/post' }, {}),
        'route() returns true');

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

    assert.isTrue(
      routes
        .put('/1', methods.put1)
        .put('/2', methods.put2)
        .put('/3', methods.put3)
        .route({ method: 'PUT', url: '/3'}, {}),
        'route() returns true');

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

    assert.isTrue(
      routes
        .delete('/delete', methods.delete1)
        .options('/options', methods.options1)
        .route({ method: 'OPTIONS', url: '/options' }, {}),
        'route() returns true');

    assert.isFalse(spy1.called, 'delete1() is not called');
    assert.isTrue(spy2.called, 'options1() is called');
  });

  test('next()を呼ばないと次の関数が呼ばれないこと', function() {
    var methods = {
      trace1: function(req, res, next) {},
      trace2: function(req, res, next) {}
    }, spy1 = sinon.spy(methods, 'trace1'),
       spy2 = sinon.spy(methods, 'trace2');

    assert.isTrue(
      routes
        .trace('/trace', methods.trace1)
        .trace('/trace', methods.trace2)
        .route({ method: 'TRACE', url: '/trace' }, {}),
        'route() returns true');

    assert.isTrue(spy1.called, 'trace1() is called');
    assert.isFalse(spy2.called, 'trace2() is not called');
  });

  test('一致しない関数が呼ばれないこと', function() {
    var methods = { connect1: function(req, res, next) {} },
        mock = sinon.mock(methods);

    mock.expects('connect1').never();

    assert.isFalse(
      routes
        .connect('/', methods.connect1)
        .route({ method: 'CONNECT', url: '/connect' }, {}),
        'route() returns false');

    assert.isTrue(mock.verify(), 'connect1() is never called');
  });

  test('ハンドラが一致しない場合パスなしハンドラが呼ばれること', function() {
    var methods = {
      patch1: function(req, res, next) { return next(); },
      patch2: function(req, res, next) { return next(); },
      patch3: function(req, res, next) { return next(); },
      patch4: function(req, res, next) { return next(); },
      patch5: function(req, res, next) { return next(); },
    }, spy1 = sinon.spy(methods, 'patch1'),
       spy2 = sinon.spy(methods, 'patch2'),
       spy3 = sinon.spy(methods, 'patch3'),
       spy4 = sinon.spy(methods, 'patch4'),
       spy5 = sinon.spy(methods, 'patch5');

    assert.isFalse(
      routes
        .patch('/patch', methods.patch1)
        .patch('/patch', methods.patch2)
        .patch('/patch', methods.patch3)
        .patch(methods.patch4)
        .patch(methods.patch5)
        .route({ method: 'PATCH', url: '/' }, {}),
        'route() returns false');

    assert.isFalse(spy1.called, 'patch1 is not called');
    assert.isFalse(spy2.called, 'patch2 is not called');
    assert.isFalse(spy3.called, 'patch3 is not called');
    assert.isTrue(spy4.called, 'patch4 is called');
    assert.isTrue(spy5.called, 'patch5 is called');
  });

  test('ハンドラがないメソッドが呼ばれても落ちないこと', function() {
    var methods = { head1: function(req, res, next) {} },
        spy = sinon.spy(methods, 'head1');

    assert.isFalse(
      routes
        .head('/', methods.head1)
        .route({ method: 'GET', url: '/' }, {}),
        'route() returns false');

    assert.isFalse(spy.called, 'head1() is not called');
  });

});
