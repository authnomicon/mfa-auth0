exports = module.exports = function(challenge, verify) {
  
  return {
    challenge: challenge,
    verify: verify
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/security/authentication/oob/Channel';
exports['@channel'] = 'auth0';

exports['@singleton'] = true;
exports['@require'] = [
  './challenge',
  './verify'
];
