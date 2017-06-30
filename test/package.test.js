var expect = require('chai').expect;


describe('nodex-login-mfa-auth0', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('mfa/auth0');
      
      expect(json.assembly.components).to.have.length(11);
      expect(json.assembly.components).to.include('oob/verify');
    });
  });
  
  it('should throw if required', function() {
    expect(function() {
      var pkg = require('..');
    }).to.throw(Error).with.property('code', 'MODULE_NOT_FOUND');
  });
  
});
