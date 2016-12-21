var expect = require('chai').expect;
var pkg = require('..');


describe('nodex-login-mfa-auth0', function() {
  
  it('should export manifest', function() {
    expect(pkg).to.be.an('object');
    expect(pkg['ds/users/authenticators']).to.be.a('function');
  });
  
});
