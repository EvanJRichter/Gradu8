// GET, GET/id, POST, PUT/id, DELETE
var secrets = require('../config/secrets');
var Major = require('../models/major');
var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = function(router) {

  var majorsRoute = router.route('/majors');
  var majorRoute = router.route('/majors/:id');

  // ENDPOINT: users
  majorsRoute.get(function(req, res) {
    var where = eval("("+req.query.where+")");
    var sort = eval("("+req.query.sort+")");
    var select = eval("("+req.query.select+")");
    var skip = eval("("+req.query.skip+")");
    var limit = eval("("+req.query.limit+")");
    var count = eval("("+req.query.count+")");
    if (count) {
      if (where) {
        Major.find({})
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
        Major.find({})
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
        Major.find({})
        .where(where)
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .exec(function(err, result) {
          if (err) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).send({message: "Majors not found", data: []});
          }
          else {
            if (!result) {
              return res.status(404).send({message: "Majors Not Found", data: []});
            }
            else {
              return res.status(200).send({message: "Majors found", data: result});
            }
          }
        });
      }
      else {
        Major.find({})
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .exec(function(err, result) {
          if (err) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).send({message: "Majors not found", data: []});
          }
          else {
            if (!result) {
              return res.status(404).send({message: "Majors Not Found", data: []});
            }
            else {
              return res.status(200).send({message: "Majors found", data: result});
            }
          }
        });
      }
    }
  });

  majorsRoute.post(function(req, res) {
    var name = req.body.name;
    var major = new Major({
      name: name
    });

    Major.find({name: name}, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({message: "Major not found", data: []});
      }
      else {
        if (result.length == 0) {
          major.save(function(err, result) {
            if (err) {
              res.setHeader('Content-Type', 'application/json');
              return res.status(500).send({message: "Major not added", data: []});
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              return res.status(201).send({message: "Major added", data: result});
            }
          });
        }
        else {
          return res.status(201).send({message: "This Major already exists", data: result});
        }
      }
    });
  });

  majorsRoute.options(function(req, res) {
    res.writeHead(200);
    res.end();
  });

  // ENDPOINT: labels/:id
  majorRoute.get(function(req, res) {
    var id = req.params.id;
    Major.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "Major Not Found", data: []});
      }
      else {
        if (!result) {
          return res.status(404).send({message: "Major Not Found", data: []});
        }
        else {
          res.setHeader('Content-Type', 'application/json');
          return res.status(200).send({message: "OK", data: result});
        }
      }
    });
  });

  // Adithya is the gr8est human being this side of the Mississippi

  majorRoute.put(function(req, res) {
    var name = req.body.name;
    Major.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "Major Not Found", data: []});
      }
      else {
        if (!result) {
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
        if (!result) {
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
