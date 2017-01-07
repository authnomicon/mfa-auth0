exports = module.exports = function(makeCredential, store, mfaClient) {
  
  var enrollmentUriHelper = require('auth0-guardian-js/lib/utils/enrollment_uri_helper');
  
  
  function begin(req, res, next) {
    makeCredential({ id: 1, username: 'johndoe' }, function(err, params) {
      if (err) { return next(err) }
      
      console.log(err);
      console.log(params);
      
      //res.locals.secret = params.secret;
      
      // https://github.com/google/google-authenticator/wiki/Key-Uri-Format
      var qrUrl = enrollmentUriHelper({
        issuerName: 'HansonHQ',
        accountLabel: 'johndoe',
        otpSecret: params.secret,  // secret
        algorith: params.algorithm,
        digits: params.digits,
        counter: 0,
        period: params.period,
        enrollmentTransactionId: params.txnID,
        baseUrl: params.auth0.url,
        enrollmentId: params.auth0.authenticatorID
      });
      
      console.log('QR URL: ' + qrUrl);
      var qrImage = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(qrUrl);
      console.log(qrImage)
      
      res.locals.qrImage = qrImage;
      
      var state = { name: 'mfa/registration' };
      state.accessToken = params.accessToken;
      
      // TODO: preserve existing state, if any
      //if (options.state) { state.prev = options.state; }
      
      /*
      mfaClient.enrollViaSMS(params.auth0.authenticatorID, '+18885551234', params.accessToken, function(err) {
        console.log('SMS?');
        console.log(err);
      
      });
      */
      
      store.save(req, state, function(err, h) {
        console.log('PERSISTED STATE!');
        console.log(h);
        
        res.locals.state = h;
        next();
        
        //q = qs.stringify({ state: h });
        //return res.redirect('/login' + (q ? '?' + q : ''));
      });
    });
  }
  
  
  function prompt(req, res, next) {
    
    res.render('mfa-auth0-register');
  }


  return [
    begin,
    prompt
  ];
  
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/makeCredential',
  'http://i.bixbyjs.org/www/ceremony/StateStore',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/Client'
];
