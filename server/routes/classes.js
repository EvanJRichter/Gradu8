// GET, GET/id, POST, PUT/id, DELETE/id
var secrets = require('../config/secrets');
var Class = require('../models/class');
var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = function(router) {

  var classesRoute = router.route('/classes');

  // GET
  classesRoute.get(function(req, res) {
    var where = eval('(' + req.query.where + ')');
    var sort = eval('(' + req.query.sort + ')');
    var select = eval('(' + req.query.select + ')');
    var skip = eval('(' + req.query.skip + ')');
    var limit = eval('(' + req.query.limit + ')');
    var count = eval('(' + req.query.count + ')');
    var distinct = eval("("+req.query.distinct+")");

    if (distinct) {
      var classes = Class.find(where, function(err, data) {
        if (err) {
          res.status(500).send({ message: 'Error', data: []});
        }
        else {
          res.status(200).send({message: 'OK', data: data});
        }
      });
      classes.distinct(distinct);
      return classes;
    }

    if (count) {
      var classes = Class.count(where, function(err, data) {
        if (err) {
          res.status(500).send({ message: 'Error', data: [] });
        }
        else {
          res.status(200).send({ message: 'OK', data: data });
        }
      });
      return classes;
    }

    else {
      var classes = Class.find(where, function(err, data) {
        if (err) {
          res.status(500).send({ message: 'Error', data: [] });
        }
        else {
          res.status(200).send({ message: 'OK', data: data });
        }
      });
      classes.skip(skip).select(select).limit(limit).sort(sort);
      return classes;
    }

  });

  // POST
  classesRoute.post(function(req, res) {
    var _class = new Class();
    _class.number = req.body.number;
    _class.department = req.body.department;
    _class.title = req.body.title;
    _class.description = req.body.description;
    _class.fall = req.body.fall;
    _class.spring = req.body.spring;
    _class.average_gpa = req.body.average_gpa;
    _class.public = req.body.public;

    _class.save(function(err) {
      if (err) {
        res.status(500).send({
          err: err,
          message: 'Server error: Class not added',
          data: []
        });
      }
      else {
        res.status(201).send({
          message: 'Class added',
          data: _class
        });
      }
    });

  });

  classesRoute.options(function(req, res) {
    res.writeHead(200);
    res.end();
  });

  return router;
}
