exports = module.exports = function(idmap, client) {
  // Load modules.
  var Directory = require('../../lib/creds/directory');
  
  var directory = new Directory(client, idmap);
  return directory;
};

// TODO: Rename this to pip/users/credentials

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/CredentialDirectory',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/CredentialDirectory'
];
exports['@singleton'] = true;
exports['@require'] = [
  '../idm/map',
  'http://schemas.authnomicon.org/js/opt/auth0/mgmt/Client'
];
