exports = module.exports = function(client, idmap) {
  
  return function challenge(user, authenticatorID, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    var type = options.type || 'oob';
    
    switch (type) {
      case 'oob': {
        idmap(user, function(err, userID) {
          if (err) { return cb(err); }
      
          client.sendPush(userID, authenticatorID, function(err, token) {
            if (err) { return cb(err); }
            // TODO: Parse and supply parameters (txnid)
            return cb(null, { type: 'oob', transactionID: token });
          });
        });
      }
      break;
      
      case 'otp': {
        return cb();
      }
      break;
    }
  };
};
