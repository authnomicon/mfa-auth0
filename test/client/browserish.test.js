var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../xom/client/browserish');


describe('auth0/client/browserish', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('BrowserishClient', function() {
    var getCredential;
    
    
    describe('#sendPush', function() {
      
      describe('failure cause by push notifications not being configured', function() {
        var guardian;
        var mfaClient = {
          httpClient: { post: function(){} }
        };
        
        
        var err;
        
        before(function() {
          getCredential = sinon.stub().yields(null, 'eyJ0eXAi.eyJzdWIi.aOSBJGPl');
          
          var e = new Error();
          e.message = 'Push notification settings not provided.';
          e.statusCode = 404;
          e.errorCode = 'push_notification_not_configured';
          
          sinon.stub(mfaClient.httpClient, 'post').yields(e);
          guardian = sinon.stub().returns(mfaClient);
        });
        
        after(function() {
          mfaClient.httpClient.post.restore();
        });
        
        before(function(done) {
          var factory = $require('../../xom/client/browserish', { 'auth0-guardian-js': guardian });
        
          var client = factory(getCredential);
          client.sendPush('auth0|00xx00x0000x00x0000x0000', 'dev_xxxXxxX0XXXxXx0X', function(_err) {
            err = _err;
            done();
          });
        });
        
        it('should get authorization credential', function() {
          expect(getCredential).to.have.been.calledOnce;
          var call = getCredential.getCall(0);
          expect(call.args[0]).to.equal('auth0|00xx00x0000x00x0000x0000');
        });
        
        it('should construct MFA API client', function() {
          expect(guardian).to.have.been.calledOnce;
          var call = guardian.getCall(0);
          expect(call.args[0]).to.deep.equal({
            serviceUrl: 'https://hansonhq.guardian.auth0.com',
            requestToken: 'eyJ0eXAi.eyJzdWIi.aOSBJGPl'
          });
        });
        
        it('should request MFA API to send push notification', function() {
          expect(mfaClient.httpClient.post).to.have.been.calledOnce;
          var call = mfaClient.httpClient.post.getCall(0);
          expect(call.args[0]).to.equal('/api/send-push-notification');
          expect(call.args[2]).to.equal(null);
        });
        
        it('should yield error', function() {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('Push notification settings not provided.');
          expect(err.errorCode).to.equal('push_notification_not_configured');
        });
      }); // failure cause by push notifications not being configured
      
    });
    
    describe('#verifyOTP', function() {
      
      describe('a valid one-time password', function() {
        var guardian;
        var mfaClient = {
          httpClient: { post: function(){} }
        };
        
        
        before(function() {
          getCredential = sinon.stub().yields(null, 'eyJ0eXAi.eyJzdWIi.aOSBJGPl');
          
          sinon.stub(mfaClient.httpClient, 'post').yields(null, {});
          guardian = sinon.stub().returns(mfaClient);
        });
        
        after(function() {
          mfaClient.httpClient.post.restore();
        });
        
        before(function(done) {
          var factory = $require('../../xom/client/browserish', { 'auth0-guardian-js': guardian });
        
          var client = factory(getCredential);
          client.verifyOTP('auth0|00xx00x0000x00x0000x0000', '123456', function(_err) {
            if (_err) { return done(_err); }
            done();
          });
        });
        
        it('should get authorization credential', function() {
          expect(getCredential).to.have.been.calledOnce;
          var call = getCredential.getCall(0);
          expect(call.args[0]).to.equal('auth0|00xx00x0000x00x0000x0000');
        });
        
        it('should construct MFA API client', function() {
          expect(guardian).to.have.been.calledOnce;
          var call = guardian.getCall(0);
          expect(call.args[0]).to.deep.equal({
            serviceUrl: 'https://hansonhq.guardian.auth0.com',
            requestToken: 'eyJ0eXAi.eyJzdWIi.aOSBJGPl'
          });
        });
        
        it('should request MFA API to verify one-time password', function() {
          expect(mfaClient.httpClient.post).to.have.been.calledOnce;
          var call = mfaClient.httpClient.post.getCall(0);
          expect(call.args[0]).to.equal('/api/verify-otp');
          expect(call.args[2]).to.deep.equal({
            type: 'manual_input',
            code: '123456'
          });
        });
      }); // a valid one-time password
      
      describe('an invalid one-time password', function() {
        var guardian;
        var mfaClient = {
          httpClient: { post: function(){} }
        };
        
        
        var err;
        
        before(function() {
          getCredential = sinon.stub().yields(null, 'eyJ0eXAi.eyJzdWIi.aOSBJGPl');
          
          var e = new Error();
          e.message = 'Invalid OTP.';
          e.statusCode = 403;
          e.errorCode = 'invalid_otp';
          
          sinon.stub(mfaClient.httpClient, 'post').yields(e);
          guardian = sinon.stub().returns(mfaClient);
        });
        
        after(function() {
          mfaClient.httpClient.post.restore();
        });
        
        before(function(done) {
          var factory = $require('../../xom/client/browserish', { 'auth0-guardian-js': guardian });
        
          var client = factory(getCredential);
          client.verifyOTP('auth0|00xx00x0000x00x0000x0000', '123456', function(_err) {
            err = _err;
            done();
          });
        });
        
        it('should get authorization credential', function() {
          expect(getCredential).to.have.been.calledOnce;
          var call = getCredential.getCall(0);
          expect(call.args[0]).to.equal('auth0|00xx00x0000x00x0000x0000');
        });
        
        it('should construct MFA API client', function() {
          expect(guardian).to.have.been.calledOnce;
          var call = guardian.getCall(0);
          expect(call.args[0]).to.deep.equal({
            serviceUrl: 'https://hansonhq.guardian.auth0.com',
            requestToken: 'eyJ0eXAi.eyJzdWIi.aOSBJGPl'
          });
        });
        
        it('should request MFA API to verify one-time password', function() {
          expect(mfaClient.httpClient.post).to.have.been.calledOnce;
          var call = mfaClient.httpClient.post.getCall(0);
          expect(call.args[0]).to.equal('/api/verify-otp');
          expect(call.args[2]).to.deep.equal({
            type: 'manual_input',
            code: '123456'
          });
        });
        
        it('should yield error', function() {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('Invalid OTP.');
          expect(err.errorCode).to.equal('invalid_otp');
        });
      }); // an invalid one-time password
      
    }); // #verifyOTP
    
  }); // BrowserishClient
  
});
