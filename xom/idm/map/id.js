exports = module.exports = function() {
  
  return function id(user, cb) {
    return cb(null, user.id);
  };
};

exports['@singleton'] = true;
exports['@require'] = [];
