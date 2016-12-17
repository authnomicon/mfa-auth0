function UserAuthenticators(client, idmap) {
  this._client = client;
  this._idmap = idmap;
}

UserAuthenticators.prototype.list = function(user, options, cb) {
  if (typeof options == 'function') {
    cb = options;
    options = undefined;
  }
  options = options || {};
  
  
  var self = this;
  this._idmap(user, function(err, userID) {
    if (err) { return cb(err); }
    
    self._client.users.getEnrollments({ id: userID }, function(err, enrollments) {
      var devices = enrollments, device;
      var credentials = [], credential;
      var i, len;
    
      for (i = 0, len = devices.length; i < len; ++i) {
        device = devices[i];
        credential = {};
        credential.id = device.id;
        credential.methods = [ 'otp' ];
        
        credentials.push(credential);
      }
      
      return cb(null, credentials);
    });
  });
};

UserAuthenticators.prototype.revoke = function(user, authenticatorID, options, cb) {
  if (typeof options == 'function') {
    cb = options;
    options = undefined;
  }
  options = options || {};
  
  var self = this;
  this._idmap(user, function(err, userID) {
    if (err) { return cb(err); }
    
    self._client.guardian.enrollments.delete({ id: authenticatorID }, function(err, out) {
      if (err) { return cb(err); }
      return cb();
    });
  });
};




exports = module.exports = function(idmap, client) {
  var directory = new UserAuthenticators(client, idmap);
  return directory;
};

// TODO: Rename this to pip/users/credentials

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/UserAuthenticatorsDirectory',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/UserAuthenticatorsDirectory'
];
exports['@singleton'] = true;
exports['@require'] = [
  '../../idm/map',
  'http://schemas.authnomicon.org/js/opt/auth0/mgmt/v2/Client'
];
