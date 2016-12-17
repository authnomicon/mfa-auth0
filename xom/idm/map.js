exports = module.exports = function(container) {
  return container.create('./map/id');
};

exports['@singleton'] = true;
exports['@require'] = [ '!container' ];
