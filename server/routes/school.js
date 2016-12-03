// GET, GET/id, POST, PUT/id, DELETE
var secrets = require('../config/secrets');
var School = require('../models/school');
var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = function(router) {

  var schoolsRoute = router.route('/schools');
  var schoolRoute = router.route('/schools/:id');

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
            if (result.length == 0) {
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
            if (result.length == 0) {
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

    School.find({name: name}, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({message: "School not found", data: []});
      }
      else {
        if (result.length == 0) {
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
        }
        else {
          return res.status(201).send({message: "This School already exists", data: result});
        }
      }
    });
  });

  schoolsRoute.options(function(req, res) {
    res.writeHead(200);
    res.end();
  });

  // ENDPOINT: labels/:id
  schoolRoute.get(function(req, res) {
    var id = req.params.id;
    School.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "School Not Found", data: []});
      }
      else {
        if (!result) {
          return res.status(404).send({message: "School Not Found", data: []});
        }
        else {
          res.setHeader('Content-Type', 'application/json');
          return res.status(200).send({message: "OK", data: result});
        }
      }
    });
  });

  // Adithya is the gr8est human being this side of the Mississippi

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
        if (!result) {
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
        if (!result) {
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
