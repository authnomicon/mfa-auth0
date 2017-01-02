exports = module.exports = function(idnew, client, request) {
  request || require('request');
  
  console.log(request);
  
  
  return function make(user, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    console.log('MAKE A CREDENTIAL...');
    
    // https://en.wikipedia.org/wiki/Transaction_verification
    // https://en.wikipedia.org/wiki/Transaction_authentication
    
    
    idnew(user, function(err, userID) {
      if (err) { return cb(err); }
    
      client.enroll(userID, function(err, txn) {
        if (err) { return cb(err); }
        
        console.log('MAKE IT!');
        console.log(txn)
        
        var params = {};
        // OTP
        params.secret = txn.deviceAccount.otpSecret;
        params.algorithm = 'sha1';
        params.digits = 6;
        params.period = 30;
        
        // Auth0 Guardian
        params.txnID = txn.enrollmentTxId;
        params.auth0 = {};
        params.auth0.url = 'https://hansonhq.guardian.auth0.com';
        params.auth0.authenticatorID = txn.deviceAccount.id;
        
        // enrollmentTransactionId: this.enrollmentAttempt.getEnrollmentTransactionId(),
        // txLegacyData.enrollmentTxId
        // enrollmentId: this.enrollmentAttempt.getEnrollmentId(),
        // txLegacyData.deviceAccount.id
        // baseUrl: this.enrollmentAttempt.getBaseUri(),
        // https://{{ userData.tenant }}.guardian.auth0.com
        
        // ...
        params.accessToken = txn.transactionToken;
        
        return cb(null, params);
      });
    });
    
    
    return;
    
    
    idmap(user, function(err, userID) {
      console.log(err);
      console.log(userID)
      
      var data = {
        user_id: userID,
        //email: 'johndoe@gmail.com',
        //send_mail: false
      }
      
      client.guardian.enrollmentTickets.create(data, function(err, ticket) {
        console.log('CREATE TICKET')
        console.log(err);
        console.log(ticket);
        
        var opts = {
          headers: {
            'Authorization': 'Ticket id="' + ticket.ticket_id + '"'
          }
        }
    
        request.post('https://hansonhq.guardian.auth0.com/api/start-flow', opts, function(err, res, body) {
          console.log(err);
          console.log(res.statusCode)
          console.log(body);
          
          body = JSON.parse(body);
    
          return cb(null, { secret: body.device_account.otp_secret, accessToken: body.transaction_token });
        });
        
        
      });
      
    });
  };
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/makeCredential',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/makeCredential'
];
exports['@singleton'] = true;
exports['@require'] = [
  './idm/new',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/Client'
];
