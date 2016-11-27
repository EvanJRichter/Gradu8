// GET, GET/id, POST, PUT/id, DELETE/id
var secrets = require('../config/secrets');
var Class = require('../models/class');

module.exports = function(router) {

  var classesRoute = router.route('/classes');
  var classRoute = router.route('/classes/:id');

  // ENDPOINT: classes
  classesRoute.get(function(req, res) {

  });

  classesRoute.post(function(req, res) {
    var name = req.body.name;
    var department = req.body.email;
    var user = new User({
      name: name,
      email: email,
      dateCreated: Date.now()
    });
  });

  // ENDPOINT: classes/:id
  classRoute.get(function(req, res) {

  });

  classRoute.put(function(req, res) {

  });

  classRoute.delete(function(req, res) {

  });

  return router;
}
