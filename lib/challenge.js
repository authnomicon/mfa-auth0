exports = module.exports = function(client, idmap) {
  
  return function challenge(user, authenticatorID, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    //return cb(); // For OTP
    
    idmap(user, function(err, userID) {
      if (err) { return cb(err); }
      
      client.sendPush(userID, authenticatorID, function(err) {
        if (err) { return cb(err); }
        // TODO: Parse and supply parameters (txnid)
        return cb();
      });
    });
  };
};
