exports = module.exports = function() {
  
  
  function prompt(req, res, next) {
    
    res.render('mfa-auth0');
  }


  return [
    prompt
  ];
  
};

exports['@require'] = [];
