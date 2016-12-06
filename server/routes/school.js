// GET, GET/id, POST, PUT/id, DELETE
var secrets = require('../config/secrets');
var School = require('../models/school');
var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = function(router) {
  var schoolRoute = router.route('/schools/:id');

  // ENDPOINT: labels/:id
  schoolRoute.get(function(req, res) {
    var id = req.params.id;
    School.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "School Not Found", data: []});
      }
      else {
        if (result === null) {
          return res.status(404).send({message: "School Not Found", data: []});
        }
        else {
          res.setHeader('Content-Type', 'application/json');
          return res.status(200).send({message: "OK", data: result});
        }
      }
    });
  });

  schoolRoute.put(function(req, res) {
    var name = req.body.name;
    var majors = req.body.majors;
    var minors = req.body.minors;
    School.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "School Not Found", data: []});
      }
      else {
        if (result === null) {
          return res.status(404).send({message: "School Not Found", data: []});
        }
        else {
          School.findOneAndUpdate(id, {
            name: name
          }, {new: true}, function(err, result) {
            if (err) {
              res.setHeader('Content-Type', 'application/json');
              return res.status(404).send({message: "School not updated", data: []});
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              return res.status(200).send({message: "School updated", data: result});
            }
          });
        }
      }
    });
  });

  schoolRoute.delete(function(req, res) {
    var id = req.params.id;
    School.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "School Not Found", data: []});
      }
      else {
        if (result === null) {
          return res.status(404).send({message: "School Not Found", data: []});
        }
        else {
          School.findByIdAndRemove(id, function(err, result) {
            if (err) {
              res.setHeader('Content-Type', 'application/json');
              return res.status(404).send({message: "School not deleted", data: []});
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              return res.status(200).send({message: "School deleted", data: result});
            }
          });
        }
      }
    });
  });

  return router;
}
