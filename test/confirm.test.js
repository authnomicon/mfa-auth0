/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../lib/confirm');


describe('confirm', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('confirm', function() {
    var client = {
      guardian: {
        enrollments: { get: function(){} }
      }
    };
    
    
    describe('confirmed', function() {
      var params;
      
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
        
        sinon.stub(client.guardian.enrollments, 'get').yields(null, result);
      });
    
      after(function() {
        client.guardian.enrollments.get.restore();
      });
      
      before(function(done) {
        var confirm = factory(client);
        
        confirm({ authenticatorID: 'dev_xxxXxxX0XXXxXx0X' }, function(_err, _params) {
          if (_err) { return done(_err); }
          params = _params;
          done();
        });
      });
    
      it('should perform authentication via Auth API', function() {
        expect(client.guardian.enrollments.get).to.have.been.calledOnce;
        var call = client.guardian.enrollments.get.getCall(0);
        expect(call.args[0]).to.deep.equal({
          id: 'dev_xxxXxxX0XXXxXx0X'
        });
      });
      
      it('should yield parameters', function() {
        expect(params).to.equal(true);
      });
    }); // confirmed
    
  });
  
});
