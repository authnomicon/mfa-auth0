/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/oob/associate');


describe('auth0/oob/associate', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@require']).to.have.length(2);
    expect(factory['@require'][0]).to.equal('../idm/map');
    expect(factory['@require'][1]).to.equal('http://schemas.modulate.io/js/opt/auth0/guardian/Client');
  });
  
  describe('associate', function() {
    var client = {
      enroll: function(){},
    };
    var idmap;
    
    
    describe('something', function() {
      var params;
      
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
        var associate = factory(idmap, client);
        associate({ id: '1', username: 'johndoe' }, function(_err, _params) {
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
      
      it('should request enrollments from Management API', function() {
        expect(client.enroll).to.have.been.calledOnce;
        var call = client.enroll.getCall(0);
        expect(call.args[0]).to.equal('auth0|00xx00x0000x00x0000x0000');
      });
      
      it('should yield parameters', function() {
        expect(params).to.be.an('object');
        expect(params).to.deep.equal({
          type: 'oob',
          secret: 'XXXX0XXXXXXX0XXXXXXXXXXXXXXXX0XX',
          barcodeURL: 'otpauth://totp/HansonHQ:foofoo?secret=XXXX0XXXXXXX0XXXXXXXXXXXXXXXX0XX&enrollment_tx_id=X0XXxxXX0xx00XXXxXxxXxxXxxx0XXx0&issuer=HansonHQ&id=dev_xxxXxxX0XXXxXx0X&base_url=https%3A%2F%2Fhansonhq.guardian.auth0.com&digits=6&counter=0&period=30',
          context: {
            id: 'dev_xxxXxxX0XXXxXx0X',
            transactionToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhdXRoMHwwMHh4MDB4MDAwMHgwMHgwMDAweDAwMDAiLCJleHAiOjE0ODE3NTgzMjMsImlzcyI6Imh0dHBzOi8vYWNtZS5ndWFyZGlhbi5hdXRoMC5jb20iLCJhdWQiOiJodHRwczovL2FjbWUuZ3VhcmRpYW4uYXV0aDAuY29tL2FwaSIsImF6cCI6ImJyb3dzZXIiLCJ0eGlkIjoidHhuX1hYeFhYWHgwMHhYMFh4eFh4WFhYMDB4eHhYMFh4MCJ9.aOSBJGPl6Wxn85i2wdYHREdR1u6X3aazAn0mn3zt042ayjp4MUZNE30gmFnZ2u511cfiQj-K5oIqsbLGlxXjxJRh_vZB7mlAhV7rzDD50pfw7NuaiXyMyE9Pd80eRA9K44IoZ5WP1EXVrMhjqvX_kYQ_fxuET7hKsNN-l_OL46c'
          }
        });
      });
    }); // something
    
  });
  
});
