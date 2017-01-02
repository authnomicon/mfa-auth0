exports = module.exports = function(client) {
  
  
  return function verify(user, credID, txid, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    client.transactionState(txid, function(err, txn) {
      if (err) { return cb(err); }
      
      switch (txn.state) {
      case 'pending':
        return cb(null, undefined);
        break;
      case 'rejected':
        return cb(null, false);
        break;
      case 'accepted':
        return cb(null, true);
        break;
      }
    });
  };
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/oob/verify',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/oob/verify'
];
exports['@singleton'] = true;
exports['@require'] = [
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/Client'
];
