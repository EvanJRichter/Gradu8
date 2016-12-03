// GET, GET/id, POST, PUT/id, DELETE
var secrets = require('../config/secrets');
var Minor = require('../models/minor');
var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = function(router) {

  var minorsRoute = router.route('/minors');
  var minorRoute = router.route('/minors/:id');

  // ENDPOINT: users
  minorsRoute.get(function(req, res) {
    var where = eval("("+req.query.where+")");
    var sort = eval("("+req.query.sort+")");
    var select = eval("("+req.query.select+")");
    var skip = eval("("+req.query.skip+")");
    var limit = eval("("+req.query.limit+")");
    var count = eval("("+req.query.count+")");
    if (count) {
      if (where) {
        Minor.find({})
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
        Minor.find({})
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
        Minor.find({})
        .where(where)
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .exec(function(err, result) {
          if (err) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).send({message: "Minors not found", data: []});
          }
          else {
            if (result === null) {
              return res.status(404).send({message: "Minors Not Found", data: []});
            }
            else {
              return res.status(200).send({message: "Minors found", data: result});
            }
          }
        });
      }
      else {
        Minor.find({})
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .exec(function(err, result) {
          if (err) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).send({message: "Minors not found", data: []});
          }
          else {
            if (result === null) {
              return res.status(404).send({message: "Minors Not Found", data: []});
            }
            else {
              return res.status(200).send({message: "Minors found", data: result});
            }
          }
        });
      }
    }
  });

  minorsRoute.post(function(req, res) {
    var name = req.body.name;
    var minor = new Minor({
      name: name
    });

    minor.save(function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({message: "Minor not added", data: []});
      }
      else {
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).send({message: "Minor added", data: result});
      }
    });
    // Minor.find({name: name}, function(err, result) {
    //   if (err) {
    //     res.setHeader('Content-Type', 'application/json');
    //     return res.status(500).send({message: "Minor not found", data: []});
    //   }
    //   else {
    //     if (result === null) {
    //       minor.save(function(err, result) {
    //         if (err) {
    //           res.setHeader('Content-Type', 'application/json');
    //           return res.status(500).send({message: "Minor not added", data: []});
    //         }
    //         else {
    //           res.setHeader('Content-Type', 'application/json');
    //           return res.status(201).send({message: "Minor added", data: result});
    //         }
    //       });
    //     }
    //     else {
    //       return res.status(201).send({message: "This Minor already exists", data: result});
    //     }
    //   }
    // });
  });

  minorsRoute.options(function(req, res) {
    res.writeHead(200);
    res.end();
  });

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

  // Adithya is the gr8est human being this side of the Mississippi

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
