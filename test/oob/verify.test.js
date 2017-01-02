/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../lib/oob/verify');


describe('auth0/oob/verify', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.have.length(2);
    expect(factory['@implements'][0]).to.equal('http://schemas.authnomicon.org/js/login/mfa/oob/verify');
    expect(factory['@implements'][1]).to.equal('http://schemas.authnomicon.org/js/login/mfa/opt/auth0/oob/verify');
    expect(factory['@singleton']).to.equal(true);
  });
  
  describe('verify', function() {
    var client = {
      transactionState: function(){}
    };
    
  
    describe('allowed response to push notification', function() {
      var ok, params;
      
      before(function() {
        var result = {
          id: 'txn_xXxXXXXxXX0XX0XxxxXxXxxx0x0XXX',
          state: 'accepted',
          enrollment: {
            id: 'dev_xxxXxxX0XXXxXx0X',
            name: 'John’s iPhone 7',
            identifier: '0000000X-000X-00X0-0X00-00X000XX000X',
            phoneNumber: 'null',
            methods: ['push', 'otp'],
            availableMethods: ['push', 'otp']
          },
          token: 'eyJhbGciOiJSUzI1NiJ9.eyJzdGF0dXMiOiJvayIsImV4cCI6MTQ4MTkyNzMyNSwibm9uY2UiOiJudWxsIn0.QgZ9irm952KBZ3WPx5CuZ8NTZzZ2pjxy1ddc7AvDRP0mmpntZXWQcitvs9MDSWRUog1VuVT5htwOBIeEvI4r26ZacMav7MwX6C2jeRYn8-2VKnRvtkdqrIlm2Qo4o4g6avCu3ZYGdYbFt6gpKqWhUahZ_Z30xASTDrdXwO44pwo'
        };
        
        sinon.stub(client, 'transactionState').yields(null, result);
      });
    
      after(function() {
        client.transactionState.restore();
      });
      
      before(function(done) {
        var verify = factory(client);
        verify({ id: '1', username: 'johndoe' }, 'dev_xxxXxxX0XXXxXx0X', 'eyJ0eXAi.eyJzdWIi.aOSBJGPl', function(_err, _ok, _params) {
          if (_err) { return done(_err); }
          ok = _ok;
          params = _params;
          done();
        });
      });
    
      it('should request transaction state from MFA API', function() {
        expect(client.transactionState).to.have.been.calledOnce;
        var call = client.transactionState.getCall(0);
        expect(call.args[0]).to.equal('eyJ0eXAi.eyJzdWIi.aOSBJGPl');
      });
      
      it('should yield ok', function() {
        expect(ok).to.be.true;
      });
    }); // allowed response to push notification
  
    describe('denied response to push notification', function() {
      var ok, params;
      
      before(function() {
        var result = {
          id: 'txn_xXxXXXXxXX0XX0XxxxXxXxxx0x0XXX',
          state: 'rejected',
          enrollment: {
            id: 'dev_xxxXxxX0XXXxXx0X',
            name: 'John’s iPhone 7',
            identifier: '0000000X-000X-00X0-0X00-00X000XX000X',
            phoneNumber: 'null',
            methods: ['push', 'otp'],
            availableMethods: ['push', 'otp']
          }
        };
        
        sinon.stub(client, 'transactionState').yields(null, result);
      });
    
      after(function() {
        client.transactionState.restore();
      });
      
      before(function(done) {
        var verify = factory(client);
        verify({ id: '1', username: 'johndoe' }, 'dev_xxxXxxX0XXXxXx0X', 'eyJ0eXAi.eyJzdWIi.aOSBJGPl', function(_err, _ok, _params) {
          if (_err) { return done(_err); }
          ok = _ok;
          params = _params;
          done();
        });
      });
    
      it('should request transaction state from MFA API', function() {
        expect(client.transactionState).to.have.been.calledOnce;
        var call = client.transactionState.getCall(0);
        expect(call.args[0]).to.equal('eyJ0eXAi.eyJzdWIi.aOSBJGPl');
      });
      
      it('should yield false ok', function() {
        expect(ok).to.be.false;
      });
    }); // denied response to push notification
  
    describe('pending response to push notification', function() {
      var ok, params;
      
      before(function() {
        var result = {
          id: 'txn_xXxXXXXxXX0XX0XxxxXxXxxx0x0XXX',
          state: 'pending',
          enrollment: {
            id: 'dev_xxxXxxX0XXXxXx0X',
            name: 'John’s iPhone 7',
            identifier: '0000000X-000X-00X0-0X00-00X000XX000X',
            phoneNumber: 'null',
            methods: ['push', 'otp'],
            availableMethods: ['push', 'otp']
          }
        };
        
        sinon.stub(client, 'transactionState').yields(null, result);
      });
    
      after(function() {
        client.transactionState.restore();
      });
      
      before(function(done) {
        var verify = factory(client);
        verify({ id: '1', username: 'johndoe' }, 'dev_xxxXxxX0XXXxXx0X', 'eyJ0eXAi.eyJzdWIi.aOSBJGPl', function(_err, _ok, _params) {
          if (_err) { return done(_err); }
          ok = _ok;
          params = _params;
          done();
        });
      });
    
      it('should request transaction state from MFA API', function() {
        expect(client.transactionState).to.have.been.calledOnce;
        var call = client.transactionState.getCall(0);
        expect(call.args[0]).to.equal('eyJ0eXAi.eyJzdWIi.aOSBJGPl');
      });
      
      it('should yield indeterminate ok', function() {
        expect(ok).to.be.undefined;
      });
    }); // pending response to push notification
    
  });
  
});
