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
      var authenticators = []
        , authenticator, enrollment
        , i, len;
    
      for (i = 0, len = enrollments.length; i < len; ++i) {
        enrollment = enrollments[i];
        authenticator = {};
        authenticator.id = enrollment.id;
        switch (enrollment.type) {
        case 'pn':
          authenticator.type = [ 'oob', 'otp' ];
          authenticator.channels = [ 'pn' ];
          break;
        case 'sms':
          authenticator.type = 'oob';
          authenticator.channels = [ 'sms' ];
          authenticator.confirmation = 'primary';
          //authenticator.confirmation = 'secondary';
          //authenticator.confirmation = 'compare';
          break;
        case 'authenticator':
          authenticator.type = 'otp';
          break;
        default:
          continue;
        }
        
        authenticators.push(authenticator);
      }
      
      return cb(null, authenticators);
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

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/UserAuthenticatorsDirectory',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/UserAuthenticatorsDirectory'
];
exports['@singleton'] = true;
exports['@require'] = [
  '../../idm/map',
  'http://schemas.authnomicon.org/js/opt/auth0/mgmt/v2/Client'
];
