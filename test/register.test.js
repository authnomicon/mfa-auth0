/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../lib/register');


describe('auth0/register', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.have.length(2);
    expect(factory['@implements'][0]).to.equal('http://schemas.authnomicon.org/js/login/mfa/register');
    expect(factory['@implements'][1]).to.equal('http://schemas.authnomicon.org/js/login/mfa/opt/auth0/register');
    expect(factory['@singleton']).to.equal(true);
  });
  
  describe('register', function() {
    var client = {
      enroll: function(){},
    };
    var idmap;
    
    
    describe.skip('something', function() {
      var out;
      
      before(function() {
        var txn = {
          deviceAccount: {
            id: 'dev_xxxXxxX0XXXxXx0X',
            otpSecret: 'XXXX0XXXXXXX0XXXXXXXXXXXXXXXX0XX',
            status: 'confirmation_pending',
            recoveryCode: 'XXXXXXX0X0XX0XXXXXXXX0X0'
          },
          enrollmentTxId: 'X0XXxxXX0xx00XXXxXxxXxxXxxx0XXx0',
          featureSwitches: {
            mfaApp: {
              enroll: true
            },
            mfaSms: {
              enroll: false
            }
          },
          transactionToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhdXRoMHwwMHh4MDB4MDAwMHgwMHgwMDAweDAwMDAiLCJleHAiOjE0ODE3NTgzMjMsImlzcyI6Imh0dHBzOi8vYWNtZS5ndWFyZGlhbi5hdXRoMC5jb20iLCJhdWQiOiJodHRwczovL2FjbWUuZ3VhcmRpYW4uYXV0aDAuY29tL2FwaSIsImF6cCI6ImJyb3dzZXIiLCJ0eGlkIjoidHhuX1hYeFhYWHgwMHhYMFh4eFh4WFhYMDB4eHhYMFh4MCJ9.aOSBJGPl6Wxn85i2wdYHREdR1u6X3aazAn0mn3zt042ayjp4MUZNE30gmFnZ2u511cfiQj-K5oIqsbLGlxXjxJRh_vZB7mlAhV7rzDD50pfw7NuaiXyMyE9Pd80eRA9K44IoZ5WP1EXVrMhjqvX_kYQ_fxuET7hKsNN-l_OL46c',
          availableAuthenticationMethods: ['push', 'otp', 'sms'],
          availableEnrollmentMethods: ['push', 'otp', 'sms']
        };
        
        sinon.stub(client, 'enroll').yields(null, txn);
        idmap = sinon.stub().yields(null, 'auth0|00xx00x0000x00x0000x0000');
      });
    
      after(function() {
        client.enroll.restore();
      });
      
      before(function(done) {
        var register = factory(idmap, client);
        register(function(_err, _out) {
          if (_err) { return done(_err); }
          out = _out;
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
      
      /*
      it('should request enrollments from Management API', function() {
        expect(client.users.getEnrollments).to.have.been.calledOnce;
        var call = client.users.getEnrollments.getCall(0);
        expect(call.args[0]).to.deep.equal({
          id: 'auth0|00xx00x0000x00x0000x0000'
        });
      });
      
      it('should yield authenticators', function() {
        expect(authenticators).to.be.an('array');
        expect(authenticators).to.have.length(1);
        expect(authenticators[0]).to.deep.equal({
          id: 'dev_xxxXxxX0XXXxXx0X',
          type: [ 'oob', 'otp', 'lookup-secret' ],
          channels: [ 'pns' ],
          _userID: 'auth0|00xx00x0000x00x0000x0000'
        });
      });
      */
    }); // something
    
  });
  
});
