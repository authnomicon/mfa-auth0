exports = module.exports = function(idmap, client) {
  
  
  return function verify(user, authenticatorID, otp, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    idmap(user, function(err, userID) {
      if (err) { return cb(err); }
      
      client.verifyOTP(userID, otp, options, function(err) {
        if (err) {
          if (err.errorCode == 'invalid_otp') {
            return cb(null, false);
          }
          return cb(err);
        }
        return cb(null, true);
      });
    });
  };
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/otp/verify',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/otp/verify'
];
exports['@singleton'] = true;
exports['@require'] = [
  '../idm/map',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/Client'
];
