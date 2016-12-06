// GET, GET/id, POST, PUT/id, DELETE
var secrets = require('../config/secrets');
var Major = require('../models/major');
var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = function(router) {
  var majorRoute = router.route('/majors/:id');

  // ENDPOINT: labels/:id
  majorRoute.get(function(req, res) {
    var id = req.params.id;
    Major.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "Major Not Found", data: []});
      }
      else {
        if (result === null) {
          return res.status(404).send({message: "Major Not Found", data: []});
        }
        else {
          res.setHeader('Content-Type', 'application/json');
          return res.status(200).send({message: "OK", data: result});
        }
      }
    });
  });

  majorRoute.put(function(req, res) {
    var name = req.body.name;
    Major.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "Major Not Found", data: []});
      }
      else {
        if (result === null) {
          return res.status(404).send({message: "Major Not Found", data: []});
        }
        else {
          Major.findOneAndUpdate(id, {
            name: name
          }, {new: true}, function(err, result) {
            if (err) {
              res.setHeader('Content-Type', 'application/json');
              return res.status(404).send({message: "Major not updated", data: []});
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              return res.status(200).send({message: "Major updated", data: result});
            }
          });
        }
      }
    });
  });

  majorRoute.delete(function(req, res) {
    var id = req.params.id;
    Major.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "Major Not Found", data: []});
      }
      else {
        if (result === null) {
          return res.status(404).send({message: "Major Not Found", data: []});
        }
        else {
          Major.findByIdAndRemove(id, function(err, result) {
            if (err) {
              res.setHeader('Content-Type', 'application/json');
              return res.status(404).send({message: "Major not deleted", data: []});
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              return res.status(200).send({message: "Major deleted", data: result});
            }
          });
        }
      }
    });
  });

  return router;
}
