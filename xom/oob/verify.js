exports = module.exports = function(client) {
  // Load modules.
  var verify = require('../../lib/verify');
  
  return verify(client);
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/oob/verify',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/oob/verify'
];
exports['@singleton'] = true;
exports['@require'] = [
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/Client'
];
