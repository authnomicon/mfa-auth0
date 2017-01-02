/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../lib/otp/verify');


describe('auth0/otp/verify', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.have.length(2);
    expect(factory['@implements'][0]).to.equal('http://schemas.authnomicon.org/js/login/mfa/otp/verify');
    expect(factory['@implements'][1]).to.equal('http://schemas.authnomicon.org/js/login/mfa/opt/auth0/otp/verify');
    expect(factory['@singleton']).to.equal(true);
  });
  
  describe('verify', function() {
    var client = {
      verifyOTP: function(){}
    };
    var idmap;
    
    
    describe('a valid one-time password', function() {
      var ok;
      
      before(function() {
        sinon.stub(client, 'verifyOTP').yields(null);
        idmap = sinon.stub().yields(null, 'auth0|00xx00x0000x00x0000x0000');
      });
    
      after(function() {
        client.verifyOTP.restore();
      });
      
      before(function(done) {
        var verify = factory(idmap, client);
        verify({ id: '1', username: 'johndoe' }, 'dev_xxxXxxX0XXXxXx0X', '123456', function(_err, _ok) {
          if (_err) { return done(_err); }
          ok = _ok;
          done();
        });
      });
    
      it('should map user identifier', function() {
        expect(idmap).to.have.been.calledOnce;
        var call = idmap.getCall(0);
        expect(call.args[0]).to.deep.equal({
          id: '1',
          username: 'johndoe'
        });
      });
    
      it('should verify one-time password', function() {
        expect(client.verifyOTP).to.have.been.calledOnce;
        var call = client.verifyOTP.getCall(0);
        expect(call.args[0]).to.equal('auth0|00xx00x0000x00x0000x0000');
        expect(call.args[1]).to.equal('123456');
      });
      
      it('should yield ok', function() {
        expect(ok).to.be.true;
      });
    }); // a valid one-time password
    
    describe('an invalid one-time password', function() {
      var ok;
      
      before(function() {
        var e = new Error();
        e.message = 'Invalid OTP.';
        e.statusCode = 403;
        e.errorCode = 'invalid_otp';
        
        sinon.stub(client, 'verifyOTP').yields(e);
        idmap = sinon.stub().yields(null, 'auth0|00xx00x0000x00x0000x0000');
      });
    
      after(function() {
        client.verifyOTP.restore();
      });
      
      before(function(done) {
        var verify = factory(idmap, client);
        verify({ id: '1', username: 'johndoe' }, 'dev_xxxXxxX0XXXxXx0X', '123456', function(_err, _ok) {
          if (_err) { return done(_err); }
          ok = _ok;
          done();
        });
      });
    
      it('should map user identifier', function() {
        expect(idmap).to.have.been.calledOnce;
        var call = idmap.getCall(0);
        expect(call.args[0]).to.deep.equal({
          id: '1',
          username: 'johndoe'
        });
      });
    
      it('should verify one-time password', function() {
        expect(client.verifyOTP).to.have.been.calledOnce;
        var call = client.verifyOTP.getCall(0);
        expect(call.args[0]).to.equal('auth0|00xx00x0000x00x0000x0000');
        expect(call.args[1]).to.equal('123456');
      });
      
      it('should yield ok', function() {
        expect(ok).to.be.false;
      });
    }); // an invalid one-time password
    
  }); // verify
  
});
