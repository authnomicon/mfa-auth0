exports = module.exports = function(idmap, client) {
  var AuthenticatorService = require('../lib/authenticatorservice');
  
  
  return function() {
    return new AuthenticatorService(client, idmap);
  };
};

exports['@implements'] = 'http://schemas.modulate.io/js/login/AuthenticatorServiceProvider';
exports['@name'] = 'auth0';
exports['@require'] = [
  './idm/map',
  'http://schemas.modulate.io/js/opt/auth0/mgmt/v2/Client'
];
