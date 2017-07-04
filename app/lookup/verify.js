exports = module.exports = function(client) {
  
  
  return function verify(authenticator, secret, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    console.log('AUTH0 RECOVERY!');
    console.log(secret);
    console.log(options)
    
      
    client.recoverAccount(authenticator._userID, secret, function(err) {
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
  'http://schemas.authnomicon.org/js/login/mfa/lookup/verify',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/lookup/verify'
];
exports['@singleton'] = true;
exports['@require'] = [
  'http://schemas.modulate.io/js/opt/auth0/guardian/Client'
];
