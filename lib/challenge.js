exports = module.exports = function(idmap, client) {
  
  
  return function challenge(user, authenticatorID, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    var type = options.type || 'oob';
    
    switch (type) {
      case 'oob': {
        idmap(user, function(err, userID) {
          if (err) { return cb(err); }
          
          /*
          client.sendSMS(userID, authenticatorID, function(err, token) {
            if (err) { return cb(err); }
            // TODO: Parse and supply parameters (txnid)
            //return cb(null, { type: 'oob', transactionID: token });
            return cb(null);
          });
          return;
          */
          
          client.sendPush(userID, authenticatorID, function(err, token) {
            if (err) { return cb(err); }
            // TODO: Parse and supply parameters (txnid)
            return cb(null, { type: 'oob', transactionID: token });
          });
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
  './idm/map',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/Client'
];
