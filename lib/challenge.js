exports = module.exports = function(client) {
  
  
  return function challenge(authenticator, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    // TODO: Pull type from authenticator?
    var type = options.type || 'oob';
    
    switch (type) {
      case 'oob': {
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
      }
      break;
      
      case 'otp': {
        return cb();
      }
      break;
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
