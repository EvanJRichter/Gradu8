// GET/id, PUT/id
var secrets = require('../config/secrets');
var User = require('../models/user');
var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = function(router) {
  var userRoute = router.route('/users/:id');

  // ENDPOINT: users/:id
  userRoute.get(function(req, res) {
    var id = req.params.id;
    User.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "User Not Found", data: []});
      }
      else {
        if (result === null) {
          return res.status(404).send({message: "User not Found", data: []});
        }
        else {
          res.setHeader('Content-Type', 'application/json');
          return res.status(200).send({message: "OK", data: result});
        }
      }
    });
  });

  userRoute.put(function(req, res) {
    var id = req.body._id;
    var facebookId = req.body.facebookId;
    var university = req.body.university;
    var major = req.body.major;
    var minor = req.body.minor;
    var _public = req.body.public;
    var totalSemesters = req.body.totalSemesters;
    var currSemester = req.body.currSemester;
    var labels = req.body.labels;
    var classes = req.body.classes;
    User.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "User Not Found", data: []});
      }
      else {
        if (result = null) {
          return res.status(404).send({message: "User Not Found", data: []});
        }
        else {
          var updated_user = {
            facebookId: facebookId,
            university: university,
            major: major,
            minor: minor,
            public: _public,
            totalSemesters: totalSemesters,
            currSemester: currSemester,
            labels: labels,
            classes: classes
          };
          User.findByIdAndUpdate(id, updated_user, {new: true}, function(err, result) {
            if (err) {
              res.setHeader('Content-Type', 'application/json');
              return res.status(404).send({message: "User not updated", data: []});
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              return res.status(200).send({message: "User updated", data: result});
            }
          });
        }
      }
    });
  });

  return router;
}
