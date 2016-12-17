exports = module.exports = function(idmap, client) {
  // Load modules.
  var verify = require('../../lib/otp/verify');
  
  return verify(client, idmap);
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/otp/verify',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/otp/verify'
];
exports['@singleton'] = true;
exports['@require'] = [
  '../idm/map',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/Client'
];
