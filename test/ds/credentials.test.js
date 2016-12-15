var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../xom/ds/credentials');


describe('auth0/ds/credentials', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.have.length(2);
    expect(factory['@implements'][0]).to.equal('http://schemas.authnomicon.org/js/login/mfa/CredentialDirectory');
    expect(factory['@implements'][1]).to.equal('http://schemas.authnomicon.org/js/login/mfa/opt/auth0/CredentialDirectory');
    expect(factory['@singleton']).to.equal(true);
  });
  
  describe('Directory', function() {
    var directory;
    
    var client = {
      users: { getEnrollments: function(){} },
      guardian: { enrollments: { delete: function(){} } }
    };
    var idmap;
    
    
    describe('#list', function() {
    
      describe('user with Google Authenticator', function() {
        var credentials;
        
        before(function() {
          var enrollments = [ {
            id: 'dev_xxxXxxX0XXXxXx0X',
            status: 'confirmed',
            type: 'authenticator',
            enrolled_at: '2016-12-14T02:24:32.306Z',
            last_auth: '2016-12-14T02:26:59.776Z'
          } ];
          
          sinon.stub(client.users, 'getEnrollments').yields(null, enrollments);
          idmap = sinon.stub().yields(null, 'auth0|00xx00x0000x00x0000x0000');
        });
      
        after(function() {
          client.users.getEnrollments.restore();
        });
        
        before(function(done) {
          var directory = factory(idmap, client);
          directory.list({ id: '1', username: 'johndoe' }, function(_err, _credentials) {
            if (_err) { return done(_err); }
            credentials = _credentials;
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
        
        it('should request enrollments from Management API', function() {
          expect(client.users.getEnrollments).to.have.been.calledOnce;
          var call = client.users.getEnrollments.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: 'auth0|00xx00x0000x00x0000x0000'
          });
        });
        
        it('should yield authenticators', function() {
          expect(credentials).to.be.an('array');
          expect(credentials).to.have.length(1);
          expect(credentials[0]).to.deep.equal({
            id: 'dev_xxxXxxX0XXXxXx0X',
            methods: [ 'otp' ]
          });
        });
        
      }); // user with Google Authenticator
      
      describe('user without authenticators', function() {
        var credentials;
        
        before(function() {
          var enrollments = [];
          
          sinon.stub(client.users, 'getEnrollments').yields(null, enrollments);
          idmap = sinon.stub().yields(null, 'auth0|00xx00x0000x00x0000x0000');
        });
      
        after(function() {
          client.users.getEnrollments.restore();
        });
        
        before(function(done) {
          var directory = factory(idmap, client);
          directory.list({ id: '1', username: 'johndoe' }, function(_err, _credentials) {
            if (_err) { return done(_err); }
            credentials = _credentials;
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
        
        it('should request enrollments from Management API', function() {
          expect(client.users.getEnrollments).to.have.been.calledOnce;
          var call = client.users.getEnrollments.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: 'auth0|00xx00x0000x00x0000x0000'
          });
        });
        
        it('should yield authenticators', function() {
          expect(credentials).to.be.an('array');
          expect(credentials).to.have.length(0);
        });
        
      }); // user with Google Authenticator
      
    }); // #list
    
    describe('#revoke', function() {
    
      describe('success', function() {
        before(function() {
          sinon.stub(client.guardian.enrollments, 'delete').yields(null);
          idmap = sinon.stub().yields(null, 'auth0|00xx00x0000x00x0000x0000');
        });
      
        after(function() {
          client.guardian.enrollments.delete.restore();
        });
        
        before(function(done) {
          var directory = factory(idmap, client);
          directory.revoke({ id: '1', username: 'johndoe' }, 'dev_xxxXxxX0XXXxXx0X', function(_err) {
            if (_err) { return done(_err); }
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
        
        it('should request Management API to delete enrollment', function() {
          expect(client.guardian.enrollments.delete).to.have.been.calledOnce;
          var call = client.guardian.enrollments.delete.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: 'dev_xxxXxxX0XXXxXx0X'
          });
        });
      }); // success
    
      describe('error due to insufficient scope', function() {
        var err;
        
        before(function() {
          var e = new Error();
          e.message = 'Insufficient scope, expected any of: delete:guardian_enrollments';
          e.statusCode = 403;
          e.error = 'Forbidden';
          e.errorCode = 'insufficient_scope';
          
          sinon.stub(client.guardian.enrollments, 'delete').yields(e);
          idmap = sinon.stub().yields(null, 'auth0|00xx00x0000x00x0000x0000');
        });
      
        after(function() {
          client.guardian.enrollments.delete.restore();
        });
        
        before(function(done) {
          var directory = factory(idmap, client);
          directory.revoke({ id: '1', username: 'johndoe' }, 'dev_xxxXxxX0XXXxXx0X', function(_err) {
            err = _err;
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
        
        it('should request Management API to delete enrollment', function() {
          expect(client.guardian.enrollments.delete).to.have.been.calledOnce;
          var call = client.guardian.enrollments.delete.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: 'dev_xxxXxxX0XXXxXx0X'
          });
        });
        
        it('should yield error', function() {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('Insufficient scope, expected any of: delete:guardian_enrollments');
          expect(err.errorCode).to.equal('insufficient_scope');
        });
        
      }); // error due to insufficient scope
      
    }); // #revoke
    
  }); // Directory
  
});
