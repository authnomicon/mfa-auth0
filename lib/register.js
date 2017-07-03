
exports = module.exports = function(idmap, client) {
  var enrollmentUriHelper = require('auth0-guardian-js/lib/utils/enrollment_uri_helper');
  
  
  return function associate(user, cb) {
    console.log('REGISTER AUTH0...');
    console.log(user);
    
    idmap(user, function(err, userID) {
      console.log('MAPPED USER: ' + userID);
      
      
      client.enroll(userID, function(err, txn) {
        console.log(err);
        console.log(txn);
        
        // https://github.com/google/google-authenticator/wiki/Key-Uri-Format
        var qrUrl = enrollmentUriHelper({
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
        
        console.log(qrUrl);
        
        var qrImage = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(qrUrl);
        console.log(qrImage)
        
        var params = {
          secret: txn.deviceAccount.otpSecret,
          barcodeURL: qrUrl,
          context: {
            id: txn.deviceAccount.id
          }
        }
        
        return cb(null, params);
      });
    });
  };
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/associate',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/associate'
];
exports['@singleton'] = true;
exports['@require'] = [
  './idm/map',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/Client'
];
