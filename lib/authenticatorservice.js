function AuthenticatorService(client, idmap) {
  this._client = client;
  this._idmap = idmap;
}

AuthenticatorService.prototype.list = function(user, options, cb) {
  if (typeof options == 'function') {
    cb = options;
    options = undefined;
  }
  options = options || {};
  
  console.log('LIST AUTHENTICATORS!');
  
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
        
        authenticator = {};
        authenticator.vendor = 'auth0';
        authenticator.id = enrollment.id;
        
        switch (enrollment.status) {
        case 'confirmation_pending':
          authenticator.active = false;
          break;
        default: // confirmed
          authenticator.active = true;
          break;
        }
        
        switch (enrollment.type) {
        case 'pn':
          authenticator.type = [ 'oob', 'otp', 'lookup-secret' ];
          authenticator.channels = [ 'auth0' ];
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


module.exports = AuthenticatorService;
