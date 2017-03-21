/// TODO: Rename directory to "registration"

exports = module.exports = function(client, mfaClient, ceremony, verify) {
  
  console.log('MFA CLIENT CREATED');
  console.log(mfaClient)
  
  var request = require('request')
  var guardian = require('auth0-guardian-js');
  var enrollmentUriHelper = require('auth0-guardian-js/lib/utils/enrollment_uri_helper');
  var jwtToken = require('auth0-guardian-js/lib/utils/jwt_token');
  
  
  function register(req, res, next) {
    console.log('AUTH0 REGISTER:')
    console.log(req.body);
  
    /*
    client.getUsers(function(err, users) {
      if (err) {
        // handle error.
      }
      
      console.log(err);
      console.log(users);
    });
    */
    
    client.users.getEnrollments({ id: 'auth0|11111' }, function(err, users) {
      if (err) {
        // handle error.
      }
      
      console.log('GET ENROLLMENTS')
      console.log(err);
      console.log(users);
      
      client.guardian.enrollments.get({ id: users[0].id }, function(err, users) {
        console.log('GET ENROLLMENT')
        console.log(err);
        console.log(users);
      
        //next();
      
        /*
  [ { trial_expired: false, enabled: false, name: 'sms' },
    { trial_expired: false,
      enabled: false,
      name: 'push-notification' } ]*/
      
      });
      
      
      /*
      null
      []
      */
      
      /*
null
[ { id: 'dev_xxxxx',
    status: 'confirmation_pending',
    type: 'authenticator',
    enrolled_at: null } ]
      */
    });
    
    //return;
    
    client.guardian.factors.getAll(function(err, users) {
      console.log('GET FACTORS')
      console.log(err);
      console.log(users);
      
      next();
      
      /*
[ { trial_expired: false, enabled: false, name: 'sms' },
  { trial_expired: false,
    enabled: false,
    name: 'push-notification' } ]*/
      
    });
  
  }
  
  function guardianAPIStuff(req, res, next) {
    var opts = {
      user_id: 'auth0|5555555',
      email: 'johndoe@gmail.com',
      send_mail: false
    }
    
    
    client.guardian.enrollmentTickets.create(opts, function(err, ticket) {
      console.log('GET TICKETS')
      console.log(err);
      console.log(ticket);
      
      //var ticket = JSON.parse(ticket);
      
      
      var client = guardian({
        serviceUrl: 'https://hansonhq.guardian.auth0.com',
        ticket: ticket.ticket_id
      });
      
      res.locals.client = client;
      
      client.httpClient.post('/api/start-flow', client.credentials, null, function(err, txLegacyData) {
        console.log('GUARDIAN STUFF!');
        console.log(err);
        console.log(txLegacyData);
        
        /*
{ deviceAccount: 
   { id: 'dev_xxxxxxx',
     otpSecret: 'xxxxxxxxxx',
     status: 'confirmation_pending',
     recoveryCode: 'xxxxxxxxx' },
  enrollmentTxId: 'xxxxxxxx',
  featureSwitches: { mfaApp: { enroll: false }, mfaSms: { enroll: false } },
  transactionToken: 'ey',
  availableAuthenticationMethods: [],
  availableEnrollmentMethods: [] }
        */
        
        
        var qrUrl = enrollmentUriHelper({
          issuerName: 'HansonHQ',
          otpSecret: txLegacyData.deviceAccount.otpSecret,
          accountLabel: 'johndoe'
        });
        
        console.log('QR URL: ' + qrUrl);
        var qrImage = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(qrUrl);
        console.log(qrImage)
      
        next();
      
      });
      
      /*
      var creds = {
        getAuthHeader: function() {
          console.log('GETTING CREDS!');
          return 'Ticket id="' + ticket.ticket_id + '"';
        }
      }
      
      mfaClient.httpClient.post('/api/start-flow', creds, null, function(err, txLegacyData) {
        console.log('GUARDIAN STUFF!');
        console.log(err);
        console.log(txLegacyData);
      
      });
      */
      
      /*
      request.get(ticket.ticket_url, function(err, res, body) {
        if (err) {
          console.log(err)
          return;
        }
        
        console.log(res.statusCode);
        console.log(res.headers);
        console.log(body);
        
        
      });
      */
      
      
      //next();
      
      /*
[ { trial_expired: false, enabled: false, name: 'sms' },
  { trial_expired: false,
    enabled: false,
    name: 'push-notification' } ]*/
      
    });
    
    /*
    mfaClient.httpClient.post('/api/start-flow', mfaClient.credentials, null, function(err, txLegacyData) {
      console.log('GUARDIAN STUFF!');
      console.log(err);
      console.log(txLegacyData);
      
    });
    */
  }
  
  function enrollOtp(req, res, next) {
    var client = res.locals.client;
    
    var jwt = jwtToken('ey');
    
    var opts = {
      type: 'manual_input',
      code: '1111111'
    }
    
    client.httpClient.post('/api/verify-otp', jwt, opts, function(err, txLegacyData) {
      console.log('GUARDIAN STUFF VERIFY!');
      console.log(err);
      console.log(txLegacyData);
      
    });
  }
  
  
  
  function goodRegister(req, res, next) {
    console.log('!! REGISTER')
    console.log(req.state);
    console.log(req.body);
    
    /*
    mfaClient.sendSMS(null, req.state.accessToken, function(err, out) {
      console.log('SMS?');
      console.log(err);
      console.log(out);
      
    });
    */
    
    //return;
    
    verify(null, null, req.body.otp, { accessToken: req.state.accessToken }, function(err) {
      console.log('VERIFIED!');
      console.log(err);
    });
  }


  return [
    require('body-parser').urlencoded({ extended: false }),
    ceremony.loadState('mfa/registration'),
    goodRegister,
    //register,
    //guardianAPIStuff,
    //enrollOtp
  ];
  
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/opt/auth0/mgmt/v2/Client',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/Client',
  'http://i.bixbyjs.org/http/state/Dispatcher',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/otp/verify'
];
