/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/oob/verify');


describe('auth0/oob/verify', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@require']).to.have.length(2);
    expect(factory['@require'][0]).to.equal('http://schemas.modulate.io/js/opt/auth0/guardian/Client');
    expect(factory['@require'][1]).to.equal('http://schemas.modulate.io/js/opt/auth0/mgmt/v2/Client');
  });
  
  describe('verify', function() {
    var client = {
      transactionState: function(){}
    };
    var mgmtClient = {
      guardian: {
        enrollments: { get: function(){} }
      }
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
        var authenticator = {
          id: 'dev_xxxXxxX0XXXxXx0X',
          type: [ 'oob', 'otp' ],
          channels: [ 'pns' ],
          _userID: 'auth0|00xx00x0000x00x0000x0000'
        }
        
        verify(authenticator, 'eyJ0eXAi.eyJzdWIi.aOSBJGPl', function(_err, _ok, _params) {
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
        var authenticator = {
          id: 'dev_xxxXxxX0XXXxXx0X',
          type: [ 'oob', 'otp' ],
          channels: [ 'pns' ],
          _userID: 'auth0|00xx00x0000x00x0000x0000'
        }
        
        verify(authenticator, 'eyJ0eXAi.eyJzdWIi.aOSBJGPl', function(_err, _ok, _params) {
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
        var authenticator = {
          id: 'dev_xxxXxxX0XXXxXx0X',
          type: [ 'oob', 'otp' ],
          channels: [ 'pns' ],
          _userID: 'auth0|00xx00x0000x00x0000x0000'
        }
        
        verify(authenticator, 'eyJ0eXAi.eyJzdWIi.aOSBJGPl', function(_err, _ok, _params) {
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
    
    describe('completed authenticator binding', function() {
      var ok, params;
      
      before(function() {
        var result = {
          id: 'dev_xxxXxxX0XXXxXx0X',
          status: 'confirmed',
          name: 'John’s iPhone 7',
          identifier: '0000000X-000X-00X0-0X00-00X000XX000X',
          phone_number: null,
          type: 'pn',
          enrolled_at: '2017-07-02T17:39:55.329Z'
        };
        
        sinon.stub(mgmtClient.guardian.enrollments, 'get').yields(null, result);
      });
    
      after(function() {
        mgmtClient.guardian.enrollments.get.restore();
      });
      
      before(function(done) {
        var verify = factory(null, mgmtClient);
        var authenticator = {
          id: 'dev_xxxXxxX0XXXxXx0X',
        }
        
        verify(authenticator, 'eyJ0eXAi.eyJzdWIi.aOSBJGPl', { enroll: true }, function(_err, _ok, _params) {
          if (_err) { return done(_err); }
          ok = _ok;
          params = _params;
          done();
        });
      });
    
      it('should request transaction state from MFA API', function() {
        expect(mgmtClient.guardian.enrollments.get).to.have.been.calledOnce;
        var call = mgmtClient.guardian.enrollments.get.getCall(0);
        expect(call.args[0]).to.deep.equal({
          id: 'dev_xxxXxxX0XXXxXx0X'
        });
      });
      
      it('should yield ok', function() {
        expect(ok).to.be.true;
      });
    }); // completed authenticator binding
    
    describe('pending authenticator binding', function() {
      var ok, params;
      
      before(function() {
        var result = {
          id: 'dev_xxxXxxX0XXXxXx0X',
          status: 'confirmation_pending',
          type: 'authenticator',
          enrolled_at: null
        };
        
        sinon.stub(mgmtClient.guardian.enrollments, 'get').yields(null, result);
      });
    
      after(function() {
        mgmtClient.guardian.enrollments.get.restore();
      });
      
      before(function(done) {
        var verify = factory(null, mgmtClient);
        var authenticator = {
          id: 'dev_xxxXxxX0XXXxXx0X',
        }
        
        verify(authenticator, 'eyJ0eXAi.eyJzdWIi.aOSBJGPl', { enroll: true }, function(_err, _ok, _params) {
          if (_err) { return done(_err); }
          ok = _ok;
          params = _params;
          done();
        });
      });
    
      it('should request transaction state from MFA API', function() {
        expect(mgmtClient.guardian.enrollments.get).to.have.been.calledOnce;
        var call = mgmtClient.guardian.enrollments.get.getCall(0);
        expect(call.args[0]).to.deep.equal({
          id: 'dev_xxxXxxX0XXXxXx0X'
        });
      });
      
      it('should yield indeterminate ok', function() {
        expect(ok).to.be.undefined;
      });
    }); // pending authenticator binding
    
  });
  
});
