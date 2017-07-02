function UserAuthenticatorsDirectory(client, idmap) {
  this._client = client;
  this._idmap = idmap;
}

UserAuthenticatorsDirectory.prototype.list = function(user, options, cb) {
  if (typeof options == 'function') {
    cb = options;
    options = undefined;
  }
  options = options || {};
  
  
  var self = this;
  this._idmap(user, function(err, userID) {
    if (err) { return cb(err); }
    
    self._client.users.getEnrollments({ id: userID }, function(err, enrollments) {
      if (err) { return cb(err); }
      
      var authenticators = []
        , authenticator, enrollment
        , i, len;
    
      for (i = 0, len = enrollments.length; i < len; ++i) {
        enrollment = enrollments[i];
        if (enrollment.status != 'confirmed') { continue; }
        
        authenticator = {};
        authenticator.id = enrollment.id;
        switch (enrollment.type) {
        case 'pn':
          authenticator.type = [ 'oob', 'otp', 'lookup-secret' ];
          authenticator.channels = [ 'pns' ];
          break;
        case 'sms':
          authenticator.type = [ 'oob', 'lookup-secret' ];
          authenticator.channels = [ 'sms' ];
          authenticator.confirmation = {
            channel: 'primary'
          }
          break;
        case 'authenticator':
          authenticator.type = [ 'otp', 'lookup-secret' ];
          break;
        default:
          continue;
        }
        
        authenticator._userID = userID;
        
        authenticators.push(authenticator);
      }
      
      return cb(null, authenticators);
    });
  });
};

UserAuthenticatorsDirectory.prototype.get = function(user, aid, cb) {
  this.list(user, function(err, authenticators) {
    if (err) { return cb(err); }
    
    var i, len;
    for (i = 0, len = authenticators.length; i < len; ++i) {
      if (authenticators[i].id == aid) {
        return cb(null, authenticators[i]);
      }
    }
    return cb(null);
  });
};

UserAuthenticatorsDirectory.prototype.revoke = function(user, authenticatorID, options, cb) {
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
  var directory = new UserAuthenticatorsDirectory(client, idmap);
  return directory;
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/UserAuthenticatorsDirectory',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/UserAuthenticatorsDirectory'
];
exports['@singleton'] = true;
exports['@require'] = [
  '../../idm/map',
  'http://schemas.authnomicon.org/js/opt/auth0/mgmt/v2/Client'
];
