exports = module.exports = function(authenticators) {
  
  
  // TODO: Must validate that this user owns this authenticator
  
  function revoke(req, res, next) {
    authenticators.revoke({ username: 'joe'}, 'dev_xxxxxx', function(err) {
      console.log('REMOVED!');
      console.log(err);
      
    });
  }


  return [
    require('body-parser').urlencoded({ extended: false }),
    revoke
  ];
  
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/UserAuthenticatorsDirectory'
];
