exports = module.exports = function(container) {
  return container.create('./new/id');
};

exports['@singleton'] = true;
exports['@require'] = [ '!container' ];
