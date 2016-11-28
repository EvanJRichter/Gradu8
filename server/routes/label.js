// GET, GET/id, POST, PUT/id, DELETE
var secrets = require('../config/secrets');
var Label = require('../models/label');
var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = function(router) {

  var labelsRoute = router.route('/labels');
  var labelRoute = router.route('/labels/:id');

  // ENDPOINT: users
  labelsRoute.get(function(req, res) {
    var where = eval("("+req.query.where+")");
    var sort = eval("("+req.query.sort+")");
    var select = eval("("+req.query.select+")");
    var skip = eval("("+req.query.skip+")");
    var limit = eval("("+req.query.limit+")");
    var count = eval("("+req.query.count+")");
    if (count) {
      if (where) {
        Label.find({})
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
        Label.find({})
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
        Label.find({})
        .where(where)
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .exec(function(err, result) {
          if (err) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).send({message: "Labels not found", data: []});
          }
          else {
            console.log(result);
            if (!result) {
              return res.status(404).send({message: "Labels Not Found", data: []});
            }
            else {
              return res.status(200).send({message: "Labels found", data: result});
            }
          }
        });
      }
      else {
        Label.find({})
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .exec(function(err, result) {
          if (err) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).send({message: "Labels not found", data: []});
          }
          else {
            if (!result) {
              return res.status(404).send({message: "Labels Not Found", data: []});
            }
            else {
              return res.status(200).send({message: "Labels found", data: result});
            }
          }
        });
      }
    }
  });

  labelsRoute.post(function(req, res) {
    var name = req.body.name;
    var color = req.body.color;
    var _public = req.body.public;

    var label = new Label({
      name: name,
      color: color,
      public: _public
    });

    Label.find({name: name}, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({message: "Label not found", data: []});
      }
      else {
        console.log(result);
        if (result.length == 0) {
          label.save(function(err, result) {
            if (err) {
              res.setHeader('Content-Type', 'application/json');
              return res.status(500).send({message: "Label not added", data: []});
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              return res.status(201).send({message: "Label added", data: result});
            }
          });
        }
        else {
          return res.status(201).send({message: "This Label already exists", data: result});
        }
      }
    });
  });

  labelsRoute.options(function(req, res) {
    res.writeHead(200);
    res.end();
  });

  // ENDPOINT: labels/:id
  labelRoute.get(function(req, res) {
    var id = req.params.id;
    Label.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "Label Not Found", data: []});
      }
      else {
        if (!result) {
          return res.status(404).send({message: "Label Not Found", data: []});
        }
        else {
          res.setHeader('Content-Type', 'application/json');
          return res.status(200).send({message: "OK", data: result});
        }
      }
    });
  });

  // Adithya is the gr8est human being this side of the Mississippi

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
        if (!result) {
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
        if (!result) {
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
