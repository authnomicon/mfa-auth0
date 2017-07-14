exports = module.exports = function(idmap, client) {
  var enrollmentUriHelper = require('auth0-guardian-js/lib/utils/enrollment_uri_helper');
  
  
  return function associate(user, cb) {
    idmap(user, function(err, userID) {
      if (err) { return cb(err); }
      
      client.enroll(userID, function(err, txn) {
        if (err) { return cb(err); }
        
        // https://github.com/google/google-authenticator/wiki/Key-Uri-Format
        var barcodeURL = enrollmentUriHelper({
          issuerName: 'HansonHQ',
          accountLabel: 'foofoo',
          otpSecret: txn.deviceAccount.otpSecret, // secret
          algorith: 'sha1',
          digits: 6,
          counter: 0,
          period: 30,
          enrollmentTransactionId: txn.enrollmentTxId,
          baseUrl: 'https://hansonhq.guardian.auth0.com',
          enrollmentId: txn.deviceAccount.id
        });
        
        var params = {
          // TODO: Only in OTP mode
          //secret: txn.deviceAccount.otpSecret,
          barcodeURL: barcodeURL
        }
        
        // TODO: Add types to authnr
        var authnr = {
          id: txn.deviceAccount.id
        }
        
        return cb(null, authnr, txn.transactionToken, params);
      });
    });
  };
};

exports['@require'] = [
  '../idm/map',
  'http://schemas.modulate.io/js/opt/auth0/guardian/Client'
];
