exports = module.exports = function(container) {
  return container.create('./id');
};

exports['@singleton'] = true;
exports['@require'] = [ '!container' ];
