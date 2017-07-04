exports = module.exports = function(client, mgmtClient) {
  
  
  return function verify(authenticator, transactionID, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    // TODO: Switch to vector of trust?
    if (options.enroll) {
      // TODO: Docuemnt why this is necessary.  Some 'transport not allowed' error.
    
      mgmtClient.guardian.enrollments.get({ id: authenticator.id }, function(err, enrollment) {
        if (err) { return cb(err); }
        
        switch (enrollment.status) {
        case 'confirmation_pending':
          return cb(null, undefined);
        case 'confirmed':
          return cb(null, true);
        }
      });
      return;
    }
    
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
  'http://schemas.modulate.io/js/opt/auth0/guardian/Client',
  'http://schemas.modulate.io/js/opt/auth0/mgmt/v2/Client'
];
