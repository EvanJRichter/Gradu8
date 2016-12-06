// GET, GET/id, POST, PUT/id, DELETE/id
var secrets = require('../config/secrets');
var Class = require('../models/class');
var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = function(router) {
  var classRoute = router.route('/classes/:id');

  // ENDPOINT: classes/:id
  classRoute.get(function(req, res) {
    var id = req.params.id;
    Class.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "Class Not Found", data: []});
      }
      else {
        if (result === null) {
          return res.status(404).send({message: "Class Not Found", data: []});
        }
        else {
          res.setHeader('Content-Type', 'application/json');
          return res.status(200).send({message: "OK", data: result});
        }
      }
    });
  });

  classRoute.put(function(req, res) {
    var id = req.params.id;
    var number = req.body.number;
    var department = req.body.department;
    var title = req.body.title;
    var description = req.body.description;
    var fall = req.body.fall;
    var spring = req.body.spring;
    var credit = req.body.credit;
    var average_gpa = req.body.gpa;
    var _public = req.body.public;
    Class.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "Class Not Found", data: []});
      }
      else {
        if (result === null) {
          return res.status(404).send({message: "Class Not Found", data: []});
        }
        else {
          Class.findOneAndUpdate(id, {
            number: number,
            department: department,
            title: title,
            description: description,
            fall: fall,
            spring: spring,
            credit: credit,
            average_gpa: average_gpa,
            public: _public
          }, {new: true}, function(err, result) {
            if (err) {
              res.setHeader('Content-Type', 'application/json');
              return res.status(404).send({message: "Class not updated", data: []});
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              return res.status(200).send({message: "Class updated", data: result});
            }
          });
        }
      }
    });
  });

  classRoute.delete(function(req, res) {
    var id = req.params.id;
    Class.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "Class Not Found", data: []});
      }
      else {
        if (result === null) {
          return res.status(404).send({message: "Class Not Found", data: []});
        }
        else {
          Class.findByIdAndRemove(id, function(err, result) {
            if (err) {
              res.setHeader('Content-Type', 'application/json');
              return res.status(404).send({message: "Class not deleted", data: []});
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              return res.status(200).send({message: "Class deleted", data: result});
            }
          });
        }
      }
    });
  });

  return router;
}
