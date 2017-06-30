exports = module.exports = function() {
  
  return function id(user, cb) {
    //return cb(null, 'auth0|54ef72e7845d70b0424d3210');
    // authenticator id = dev_SZemho2CDBx666ut
    return cb(null, user.id);
  };
};

exports['@singleton'] = true;
exports['@require'] = [];
