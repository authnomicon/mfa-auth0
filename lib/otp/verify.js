exports = module.exports = function(client) {
  
  
  return function verify(authenticator, otp, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
      
    client.verifyOTP(authenticator._userID, otp, options, function(err) {
      if (err) {
        if (err.errorCode == 'invalid_otp') {
          return cb(null, false);
        }
        return cb(err);
      }
      return cb(null, true);
    });
  };
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/otp/verify',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/otp/verify'
];
exports['@singleton'] = true;
exports['@require'] = [
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/Client'
];
