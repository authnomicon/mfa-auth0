exports = module.exports = function(client) {
  
  
  return function verify(authenticator, transactionID, cb) {
    client.transactionState(transactionID, function(err, txn) {
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

exports['@require'] = [
  'http://schemas.modulate.io/js/opt/auth0/guardian/Client'
];
