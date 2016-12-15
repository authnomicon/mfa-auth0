var guardian = require('auth0-guardian-js');


function BrowserishClient(options, getCredential) {
  this._domain = options.domain;
  this._getCredential = getCredential;
}

BrowserishClient.prototype.sendPush = function(userID, deviceID, cb) {
  this._getCredential(userID, function(err, token) {
    if (err) { return cb(err); }
    
    var client = guardian({
      serviceUrl: 'https://hansonhq.guardian.auth0.com',
      requestToken: token
    });
    
    // https://github.com/auth0/auth0-mfa-api/wiki/API-Design#post-apisend-push-notification
    client.httpClient.post('/api/send-push-notification', client.credentials, null, function(err, out) {
      if (err) {
        return cb(err);
      }
      
      // TODO: Parse result and return something...
      return cb();
    });
    
  });
};

BrowserishClient.prototype.verifyOTP = function(userID, otp, cb) {
  this._getCredential(userID, function(err, token) {
    if (err) { return cb(err); }
    
    var client = guardian({
      serviceUrl: 'https://hansonhq.guardian.auth0.com',
      requestToken: token
    });
    
    // https://github.com/auth0/auth0-mfa-api/wiki/API-Design#post-apiverify-otp
    var data = {
      type: 'manual_input',
      code: otp
    };
    
    client.httpClient.post('/api/verify-otp', client.credentials, data, function(err) {
      if (err) {
        return cb(err);
      }
      return cb();
    });
  });
};




exports = module.exports = function(getCredential) {
  var client = new BrowserishClient({
    domain: 'hansonhq.auth0.com'
  }, getCredential);
  return client;
};

exports['@singleton'] = true;
exports['@require'] = [ './browserish/credential' ];
