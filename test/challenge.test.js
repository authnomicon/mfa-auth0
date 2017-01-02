/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../lib/challenge');


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
    
  
    describe('an out-of-band authenticator', function() {
      var params, context;
      
      before(function() {
        sinon.stub(client, 'sendPush').yields(null, 'eyJ0eXAi.eyJzdWIi.aOSBJGPl');
      });
    
      after(function() {
        client.sendPush.restore();
      });
      
      before(function(done) {
        var challenge = factory(client);
        var authenticator = {
          id: 'dev_xxxXxxX0XXXxXx0X',
          type: [ 'oob', 'otp' ],
          channels: [ 'pns' ],
          _userID: 'auth0|00xx00x0000x00x0000x0000'
        }
        
        challenge(authenticator, { type: 'oob' }, function(_err, _params, _context) {
          if (_err) { return done(_err); }
          params = _params;
          context = _context;
          done();
        });
      });
    
      it('should send push notification', function() {
        expect(client.sendPush).to.have.been.calledOnce;
        var call = client.sendPush.getCall(0);
        expect(call.args[0]).to.equal('auth0|00xx00x0000x00x0000x0000');
      });
      
      it('should yield parameters', function() {
        expect(params.type).to.equal('oob');
      });
      
      it('should yield context', function() {
        expect(context.transactionID).to.equal('eyJ0eXAi.eyJzdWIi.aOSBJGPl');
      });
    }); // an out-of-band authenticator
    
    describe('an OTP authenticator', function() {
      var params, context;
      
      before(function() {
        // TODO: What does this look like?
        var result = {
        };
        
        sinon.stub(client, 'sendPush').yields(null, result);
      });
    
      after(function() {
        client.sendPush.restore();
      });
      
      before(function(done) {
        var challenge = factory(client);
        var authenticator = {
          id: 'dev_xxxXxxX0XXXxXx0X',
          type: [ 'oob', 'otp' ],
          channels: [ 'pns' ],
          _userID: 'auth0|00xx00x0000x00x0000x0000'
        }
        
        challenge(authenticator, { type: 'otp' }, function(_err, _params, _context) {
          if (_err) { return done(_err); }
          params = _params;
          context = _context;
          done();
        });
      });
    
      it('should not send push notification', function() {
        expect(client.sendPush.callCount).to.equal(0);
      });
      
      it.skip('should yield parameters', function() {
        expect(params.type).to.equal('oob');
      });
      
      it.skip('should yield context', function() {
        expect(context.transactionID).to.equal('eyJ0eXAi.eyJzdWIi.aOSBJGPl');
      });
    }); // an OTP authenticator
    
  }); // challenge
  
});
