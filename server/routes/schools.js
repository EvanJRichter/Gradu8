// GET, GET/id, POST, PUT/id, DELETE
var secrets = require('../config/secrets');
var School = require('../models/school');
var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = function(router) {

  var schoolsRoute = router.route('/schools');

  // ENDPOINT: users
  schoolsRoute.get(function(req, res) {
    var where = eval("("+req.query.where+")");
    var sort = eval("("+req.query.sort+")");
    var select = eval("("+req.query.select+")");
    var skip = eval("("+req.query.skip+")");
    var limit = eval("("+req.query.limit+")");
    var count = eval("("+req.query.count+")");
    if (count) {
      if (where) {
        School.find({})
        .where(where)
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
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
        School.find({})
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
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
        School.find({})
        .where(where)
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .exec(function(err, result) {
          if (err) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).send({message: "Schools not found", data: []});
          }
          else {
            if (result === null) {
              return res.status(404).send({message: "Schools Not Found", data: []});
            }
            else {
              return res.status(200).send({message: "Schools found", data: result});
            }
          }
        });
      }
      else {
        School.find({})
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .exec(function(err, result) {
          if (err) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).send({message: "Schools not found", data: []});
          }
          else {
            if (result === null) {
              return res.status(404).send({message: "Schools Not Found", data: []});
            }
            else {
              return res.status(200).send({message: "Schools found", data: result});
            }
          }
        });
      }
    }
  });

  schoolsRoute.post(function(req, res) {
    var name = req.body.name;
    var majors = req.body.majors;
    var minors = req.body.minors;
    var school = new School({
      name: name,
      majors: majors,
      minors: minors
    });

    school.save(function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({message: "School not added", data: []});
      }
      else {
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).send({message: "School added", data: result});
      }
    });
  });

  schoolsRoute.options(function(req, res) {
    res.writeHead(200);
    res.end();
  });

  return router;
}
