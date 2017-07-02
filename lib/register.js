
exports = module.exports = function(idmap, client) {
  var enrollmentUriHelper = require('auth0-guardian-js/lib/utils/enrollment_uri_helper');
  
  
  return function register(cb) {
    console.log('REGISTER AUTH0...');
    
    var user = { id: 'TODO' };
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
        
      });
      
    });
  };
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/register',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/register'
];
exports['@singleton'] = true;
exports['@require'] = [
  './idm/map',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/Client'
];
