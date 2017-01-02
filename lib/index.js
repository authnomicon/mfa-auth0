exports = module.exports = {
  'client': require('./client'),
  'challenge': require('./challenge'),
  'makecredential': require('./makecredential'),
  'ds/users/authenticators': require('./ds/users/authenticators'),
  'oob/verify': require('./oob/verify'),
  'otp/verify': require('./otp/verify')
};

exports.load = function(id) {
  try {
    return require('./' + id);
  } catch (ex) {
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
  }
};
