// GET, GET/id, POST, PUT/id, DELETE
var secrets = require('../config/secrets');
var Label = require('../models/label');
var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = function(router) {
  var labelRoute = router.route('/labels/:id');

  // ENDPOINT: labels/:id
  labelRoute.get(function(req, res) {
    var id = req.params.id;
    Label.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "Label Not Found", data: []});
      }
      else {
        if (result === null) {
          return res.status(404).send({message: "Label Not Found", data: []});
        }
        else {
          res.setHeader('Content-Type', 'application/json');
          return res.status(200).send({message: "OK", data: result});
        }
      }
    });
  });

  labelRoute.put(function(req, res) {
    var name = req.body.name;
    var color = req.body.color;
    var _public = req.body.public;
    Label.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "Label Not Found", data: []});
      }
      else {
        if (result === null) {
          return res.status(404).send({message: "Label Not Found", data: []});
        }
        else {
          Label.findOneAndUpdate(id, {
            name: name,
            color: color,
            public: _public
          }, {new: true}, function(err, result) {
            if (err) {
              res.setHeader('Content-Type', 'application/json');
              return res.status(404).send({message: "Label not updated", data: []});
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              return res.status(200).send({message: "Label updated", data: result});
            }
          });
        }
      }
    });
  });

  labelRoute.delete(function(req, res) {
    var id = req.params.id;
    Label.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "Label Not Found", data: []});
      }
      else {
        if (result === null) {
          return res.status(404).send({message: "Label Not Found", data: []});
        }
        else {
          Label.findByIdAndRemove(id, function(err, result) {
            if (err) {
              res.setHeader('Content-Type', 'application/json');
              return res.status(404).send({message: "Label not deleted", data: []});
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              return res.status(200).send({message: "Label deleted", data: result});
            }
          });
        }
      }
    });
  });

  return router;
}
