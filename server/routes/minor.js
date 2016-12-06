// GET, GET/id, POST, PUT/id, DELETE
var secrets = require('../config/secrets');
var Minor = require('../models/minor');
var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = function(router) {
  var minorRoute = router.route('/minors/:id');

  // ENDPOINT: labels/:id
  minorRoute.get(function(req, res) {
    var id = req.params.id;
    Minor.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "Minor Not Found", data: []});
      }
      else {
        if (result === null) {
          return res.status(404).send({message: "Minor Not Found", data: []});
        }
        else {
          res.setHeader('Content-Type', 'application/json');
          return res.status(200).send({message: "OK", data: result});
        }
      }
    });
  });

  minorRoute.put(function(req, res) {
    var name = req.body.name;
    Minor.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "Minor Not Found", data: []});
      }
      else {
        if (result === null) {
          return res.status(404).send({message: "Minor Not Found", data: []});
        }
        else {
          Minor.findOneAndUpdate(id, {
            name: name
          }, {new: true}, function(err, result) {
            if (err) {
              res.setHeader('Content-Type', 'application/json');
              return res.status(404).send({message: "Minor not updated", data: []});
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              return res.status(200).send({message: "Minor updated", data: result});
            }
          });
        }
      }
    });
  });

  minorRoute.delete(function(req, res) {
    var id = req.params.id;
    Minor.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "Minor Not Found", data: []});
      }
      else {
        if (result === null) {
          return res.status(404).send({message: "Minor Not Found", data: []});
        }
        else {
          Minor.findByIdAndRemove(id, function(err, result) {
            if (err) {
              res.setHeader('Content-Type', 'application/json');
              return res.status(404).send({message: "Minor not deleted", data: []});
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              return res.status(200).send({message: "Minor deleted", data: result});
            }
          });
        }
      }
    });
  });

  return router;
}
