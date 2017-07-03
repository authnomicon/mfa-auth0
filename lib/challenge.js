exports = module.exports = function(client) {
  
  
  return function challenge(authenticator, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    
    if (authenticator.type.indexOf('oob') != -1) {
      /*
      client.sendSMS(authenticator._userID, function(err, token) {
        if (err) { return cb(err); }
        // TODO: Parse and supply parameters (txnid)
        //return cb(null, { type: 'oob', transactionID: token });
        return cb(null);
      });
      return;
      */
      
      client.sendPush(authenticator._userID, function(err, token) {
        if (err) { return cb(err); }
        // TODO: Parse and supply parameters (txnid)
        return cb(null, { type: 'oob', transactionID: token });
      });
    } else if (authenticator.type.indexOf('otp') != -1) {
      return cb();
    } else {
      // TODO: Error
    }
  };
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/challenge',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/challenge'
];
exports['@singleton'] = true;
exports['@require'] = [
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/Client'
];
