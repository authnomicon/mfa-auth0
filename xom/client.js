exports = module.exports = function(container) {
  return container.create('./client/browserish');
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/Client';
exports['@singleton'] = true;
exports['@require'] = [ '!container' ];
