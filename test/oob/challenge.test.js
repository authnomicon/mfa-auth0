/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../lib/oob/challenge');


describe('auth0/oob/challenge', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@require']).to.have.length(1);
    expect(factory['@require'][0]).to.equal('http://schemas.authnomicon.org/js/login/mfa/opt/auth0/Client');
  });
  
  describe('challenge', function() {
    var client = {
      sendPush: function(){}
    };
    
  
    describe('via push notification', function() {
      var params;
      
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
        
        challenge(authenticator, function(_err, _params) {
          if (_err) { return done(_err); }
          params = _params;
          done();
        });
      });
    
      it('should send push notification', function() {
        expect(client.sendPush).to.have.been.calledOnce;
        var call = client.sendPush.getCall(0);
        expect(call.args[0]).to.equal('auth0|00xx00x0000x00x0000x0000');
      });
      
      it('should yield parameters', function() {
        expect(params.transactionID).to.equal('eyJ0eXAi.eyJzdWIi.aOSBJGPl');
      });
    }); // via push notification
    
  }); // challenge
  
});
