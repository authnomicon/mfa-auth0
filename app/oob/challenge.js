exports = module.exports = function(client) {
  
  return function challenge(authenticator, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    
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
      return cb(null, token);
    });
  };
};

exports['@require'] = [
  'http://schemas.modulate.io/js/opt/auth0/guardian/Client'
];
