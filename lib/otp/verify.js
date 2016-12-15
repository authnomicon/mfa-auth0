exports = module.exports = function(client, idmap) {
  
  return function verify(user, authenticatorID, otp, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    idmap(user, function(err, userID) {
      if (err) { return cb(err); }
      
      client.verifyOTP(userID, otp, options, function(err) {
        if (err) {
          if (err.errorCode == 'invalid_otp') {
            return cb(null, false);
          }
          return cb(err);
        }
        return cb(null, true);
      });
    });
  };
};
