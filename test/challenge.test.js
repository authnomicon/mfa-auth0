/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../xom/challenge');


describe('auth0/challenge', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.have.length(2);
    expect(factory['@implements'][0]).to.equal('http://schemas.authnomicon.org/js/login/mfa/challenge');
    expect(factory['@implements'][1]).to.equal('http://schemas.authnomicon.org/js/login/mfa/opt/auth0/challenge');
    expect(factory['@singleton']).to.equal(true);
  });
  
  describe('challenge', function() {
    var client = {
      sendPush: function(){}
    };
    var idmap;
    
  
    describe('an out-of-band authenticator', function() {
      var params;
      
      before(function() {
        sinon.stub(client, 'sendPush').yields(null, 'eyJ0eXAi.eyJzdWIi.aOSBJGPl');
        idmap = sinon.stub().yields(null, 'auth0|00xx00x0000x00x0000x0000');
      });
    
      after(function() {
        client.sendPush.restore();
      });
      
      before(function(done) {
        var challenge = factory(idmap, client);
        challenge({ id: '1', username: 'johndoe' }, 'dev_xxxXxxX0XXXxXx0X', { type: 'oob' }, function(_err, _params) {
          if (_err) { return done(_err); }
          params = _params;
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
    
      it('should send push notification', function() {
        expect(client.sendPush).to.have.been.calledOnce;
        var call = client.sendPush.getCall(0);
        expect(call.args[0]).to.equal('auth0|00xx00x0000x00x0000x0000');
        expect(call.args[1]).to.equal('dev_xxxXxxX0XXXxXx0X');
      });
      
      it('should yield parameters', function() {
        expect(params.type).to.equal('oob');
        expect(params.transactionID).to.equal('eyJ0eXAi.eyJzdWIi.aOSBJGPl');
      });
    }); // an out-of-band authenticator
    
    describe('an OTP authenticator', function() {
      var params;
      
      before(function() {
        // TODO: What does this look like?
        var result = {
        };
        
        sinon.stub(client, 'sendPush').yields(null, result);
        idmap = sinon.stub().yields(null, 'auth0|00xx00x0000x00x0000x0000');
      });
    
      after(function() {
        client.sendPush.restore();
      });
      
      before(function(done) {
        var challenge = factory(idmap, client);
        challenge({ id: '1', username: 'johndoe' }, 'dev_xxxXxxX0XXXxXx0X', { type: 'otp' }, function(_err, _params) {
          if (_err) { return done(_err); }
          params = _params;
          done();
        });
      });
    
      it('should not map user identifier', function() {
        expect(idmap.callCount).to.equal(0);
      });
    
      it('should not send push notification', function() {
        expect(client.sendPush.callCount).to.equal(0);
      });
      
      it.skip('should yield parameters', function() {
        expect(params.type).to.equal('oob');
        expect(params.txid).to.equal('0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a');
      });
    }); // an OTP authenticator
    
  }); // challenge
  
});
