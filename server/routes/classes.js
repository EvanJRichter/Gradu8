// GET, GET/id, POST, PUT/id, DELETE/id
var secrets = require('../config/secrets');
var Class = require('../models/class');
var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = function(router) {

  var classesRoute = router.route('/classes');

  // ENDPOINT: classes
  classesRoute.get(function(req, res) {
    var where = eval("("+req.query.where+")");
    var sort = eval("("+req.query.sort+")");
    var select = eval("("+req.query.select+")");
    var skip = eval("("+req.query.skip+")");
    var limit = eval("("+req.query.limit+")");
    var count = eval("("+req.query.count+")");
    var distinct = eval("("+req.query.distinct+")");
    if (count) {
      if (where) {
        Class.find({})
        .where(where)
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .distinct(distinct)
        .count(function(err, count) {
          if (err) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).send({message: "Count not returned", data: []});
          }
          else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(201).send({message: "Count of query returned", data: count});
          }
        });
      }
      else {
        Class.find({})
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .distinct(distinct)
        .count(function(err, count) {
          if (err) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).send({message: "Count not returned", data: []});
          }
          else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).send({message: "Count of query returned", data: count});
          }
        });
      }
    }
    else {
      if (where) {
        Class.find({})
        .where(where)
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .distinct(distinct)
        .exec(function(err, result) {
          if (err) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).send({message: "Classes not found", data: []});
          }
          else {
            if (result === null) {
              return res.status(404).send({message: "Classes Not Found", data: []});
            }
            else {
              return res.status(200).send({message: "Classes found", data: result});
            }
          }
        });
      }
      else {
        Class.find({})
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .distinct(distinct)
        .exec(function(err, result) {
          if (err) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).send({message: "Classes not found", data: []});
          }
          else {
            if (result === null) {
              return res.status(404).send({message: "Classes Not Found", data: []});
            }
            else {
              return res.status(200).send({message: "Classes found", data: result});
            }
          }
        });
      }
    }
  });

  classesRoute.post(function(req, res) {
    var number = req.body.number;
    var department = req.body.department;
    var title = req.body.title;
    var description = req.body.description;
    var fall = req.body.fall;
    var spring = req.body.spring;
    var credit = req.body.credit;
    var average_gpa = req.body.average_gpa;
    var _public = req.body.public;

    var _class = new Class({
      number: number,
      department: department,
      title: title,
      description: description,
      fall: fall,
      spring: spring,
      credit: credit,
      average_gpa: average_gpa,
      public: _public
    });
    _class.save(function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({message: "Class not added", data: []});
      }
      else {
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).send({message: "Class added", data: result});
      }
    });
  });

  classesRoute.options(function(req, res) {
    res.writeHead(200);
    res.end();
  });

  return router;
}
