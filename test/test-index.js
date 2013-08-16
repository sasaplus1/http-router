var expect = require('expect.js'),
    router = require('../');

describe('http-router', function() {

  it('should be constructor', function() {
    expect(router).to.be.a(Function);
  });

  it('should be export static function', function() {
    expect(router.createRouter).to.be.a(Function);
  });

});
