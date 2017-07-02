


exports = module.exports = function(client, mfaClient) {
  
  return function confirm(options, cb) {
    console.log('CONFIRM AUTH0...');
    
    var params = {};
    // deviceAccount.id
    params.id = options.authenticatorID;
    
    client.guardian.enrollments.get(params, function(err, enrollment) {
      console.log('GET ENROLLMENTS')
      console.log(err);
      console.log(enrollment);
      
      switch (enrollment.status) {
      case 'confirmed':
        return cb(null, true);
      }
    });
  };
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/confirm',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/confirm'
];
exports['@singleton'] = true;
exports['@require'] = [
  'http://schemas.authnomicon.org/js/opt/auth0/mgmt/v2/Client',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/Client'
];
