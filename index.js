exports = module.exports = {
  'client': require('./xom/client'),
  'mfaclient': require('./xom/mfaclient'),
  'challenge': require('./xom/challenge'),
  'makecredential': require('./xom/makecredential'),
  'ds/credentials': require('./xom/ds/credentials'),
  'oob/verify': require('./xom/oob/verify'),
  'otp/verify': require('./xom/otp/verify')
};

exports.load = function(id) {
  try {
    return require('./xom/' + id);
  } catch (ex) {
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
  }
};
