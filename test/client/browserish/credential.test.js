var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../xom/client/browserish/credential');


describe('auth0/client/browserish/credential', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('getCredential', function() {
    var client = {
      guardian: { enrollmentTickets: { create: function(){} } }
    };
    
    
    describe('success', function() {
      var guardian;
      var mfaClient = {
        httpClient: { post: function(){} }
      };
      
      
      var credential;
      
      before(function() {
        var ticket = {
          ticket_id: 'XXXX0x0Xxxx0xXX0xxXX0xXxxxxxxXXX',
          ticket_url: 'https://hansonhq.guardian.auth0.com/enrollment?ticket_id=XXXX0x0Xxxx0xXX0xxXX0xXxxxxxxXXX'
        };
        
        sinon.stub(client.guardian.enrollmentTickets, 'create').yields(null, ticket);
        
        
        var txn = {
          deviceAccount: {
            status: 'confirmed',
            pushNotifications: {
              enabled: false
            },
            availableMethods: ['otp'],
            methods: ['otp']
          },
          featureSwitches: {
            mfaApp: {
              enroll: true
            },
            mfaSms: {
              enroll: false
            }
          },
          transactionToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhdXRoMHwwMHh4MDB4MDAwMHgwMHgwMDAweDAwMDAiLCJleHAiOjE0ODE3NTgzMjMsImlzcyI6Imh0dHBzOi8vYWNtZS5ndWFyZGlhbi5hdXRoMC5jb20iLCJhdWQiOiJodHRwczovL2FjbWUuZ3VhcmRpYW4uYXV0aDAuY29tL2FwaSIsImF6cCI6ImJyb3dzZXIiLCJ0eGlkIjoidHhuX1hYeFhYWHgwMHhYMFh4eFh4WFhYMDB4eHhYMFh4MCJ9.aOSBJGPl6Wxn85i2wdYHREdR1u6X3aazAn0mn3zt042ayjp4MUZNE30gmFnZ2u511cfiQj-K5oIqsbLGlxXjxJRh_vZB7mlAhV7rzDD50pfw7NuaiXyMyE9Pd80eRA9K44IoZ5WP1EXVrMhjqvX_kYQ_fxuET7hKsNN-l_OL46c',
          availableAuthenticationMethods: ['push', 'otp'],
          availableEnrollmentMethods: ['push', 'otp']
        };
        
        sinon.stub(mfaClient.httpClient, 'post').yields(null, txn);
        guardian = sinon.stub().returns(mfaClient);
      });
    
      after(function() {
        mfaClient.httpClient.post.restore();
        client.guardian.enrollmentTickets.create.restore();
      });
      
      before(function(done) {
        var factory = $require('../../../xom/client/browserish/credential', { 'auth0-guardian-js': guardian });
        
        var getCredential = factory(client);
        getCredential('auth0|00xx00x0000x00x0000x0000', function(_err, _credential) {
          if (_err) { return done(_err); }
          credential = _credential;
          done();
        });
      });
      
      it('should create enrollment ticket', function() {
        expect(client.guardian.enrollmentTickets.create).to.have.been.calledOnce;
        var call = client.guardian.enrollmentTickets.create.getCall(0);
        expect(call.args[0]).to.deep.equal({
          user_id: 'auth0|00xx00x0000x00x0000x0000',
          send_mail: false
        });
      });
      
      it('should construct MFA API client', function() {
        expect(guardian).to.have.been.calledOnce;
        var call = guardian.getCall(0);
        expect(call.args[0]).to.deep.equal({
          serviceUrl: 'https://hansonhq.guardian.auth0.com',
          ticket: 'XXXX0x0Xxxx0xXX0xxXX0xXxxxxxxXXX'
        });
      });
      
      it('should request MFA API to start flow', function() {
        expect(mfaClient.httpClient.post).to.have.been.calledOnce;
        var call = mfaClient.httpClient.post.getCall(0);
        expect(call.args[0]).to.equal('/api/start-flow');
      });
      
      it('should yield credential', function() {
        expect(credential).to.equal('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhdXRoMHwwMHh4MDB4MDAwMHgwMHgwMDAweDAwMDAiLCJleHAiOjE0ODE3NTgzMjMsImlzcyI6Imh0dHBzOi8vYWNtZS5ndWFyZGlhbi5hdXRoMC5jb20iLCJhdWQiOiJodHRwczovL2FjbWUuZ3VhcmRpYW4uYXV0aDAuY29tL2FwaSIsImF6cCI6ImJyb3dzZXIiLCJ0eGlkIjoidHhuX1hYeFhYWHgwMHhYMFh4eFh4WFhYMDB4eHhYMFh4MCJ9.aOSBJGPl6Wxn85i2wdYHREdR1u6X3aazAn0mn3zt042ayjp4MUZNE30gmFnZ2u511cfiQj-K5oIqsbLGlxXjxJRh_vZB7mlAhV7rzDD50pfw7NuaiXyMyE9Pd80eRA9K44IoZ5WP1EXVrMhjqvX_kYQ_fxuET7hKsNN-l_OL46c');
      });
    }); // success
    
  });
  
});
