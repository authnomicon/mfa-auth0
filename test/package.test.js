var expect = require('chai').expect;


describe('nodex-login-mfa-auth0', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('io.modulate/vnd/auth0');
      
      expect(json.assembly.components).to.have.length(4);
      expect(json.assembly.components).to.include('oob/channel');
    });
  });
  
  it('should throw if required', function() {
    expect(function() {
      var pkg = require('..');
    }).to.throw(Error).with.property('code', 'MODULE_NOT_FOUND');
  });
  
});
