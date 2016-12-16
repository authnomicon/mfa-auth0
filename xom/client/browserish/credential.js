exports = module.exports = function(client) {
  // Load modules.
  var guardian = require('auth0-guardian-js');
  
  
  return function getCredential(userID, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    } else if (typeof options == 'string') {
      options = { type: options }
    }
    options = options || {};
    
    
    // https://auth0.com/docs/api/management/v2#!/Guardian/post_ticket
    var data = {
      user_id: userID,
      send_mail: false
    }
    
    client.guardian.enrollmentTickets.create(data, function(err, ticket) {
      if (err) { return cb(err); }
      if (options.type == 'ticket') {
        return cb(null, ticket.ticket_id);
      }
      
      var mfaClient = guardian({
        serviceUrl: 'https://hansonhq.guardian.auth0.com',
        ticket: ticket.ticket_id
      });
      
      
      var data = null;
      if (options.stateTransport) {
        data = { state_transport: options.stateTransport };
      }
      
      // https://github.com/auth0/auth0-mfa-api/wiki/API-Design#post-apistart-flow
      mfaClient.httpClient.post('/api/start-flow', mfaClient.credentials, data, function(err, txn) {
        return cb(null, txn.transactionToken);
      });
    });
  };
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/opt/auth0/mgmt/Client'
];
