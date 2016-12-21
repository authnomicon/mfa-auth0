exports = module.exports = function(idnew, client) {
  // Load modules.
  var make = require('../lib/make');
  
  return make(client, idnew);
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/makeCredential',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/makeCredential'
];
exports['@singleton'] = true;
exports['@require'] = [
  './idm/new',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/Client'
];
