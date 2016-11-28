// GET/id, POST, PUT/id, GET (for calendar galleries?)
var secrets = require('../config/secrets');
var User = require('../models/user');
var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = function(router) {

  var usersRoute = router.route('/users');
  var userRoute = router.route('/users/:id');

  // ENDPOINT: users
  usersRoute.get(function(req, res) {
    var where = eval("("+req.query.where+")");
    var sort = eval("("+req.query.sort+")");
    var select = eval("("+req.query.select+")");
    var skip = eval("("+req.query.skip+")");
    var limit = eval("("+req.query.limit+")");
    var count = eval("("+req.query.count+")");
    if (count) {
      if (where) {
        User.find({})
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
        User.find({})
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
        User.find({})
        .where(where)
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .exec(function(err, result) {
          if (err) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).send({message: "Users not found", data: []});
          }
          else {
            console.log(result);
            if (!result) {
              return res.status(404).send({message: "Users Not Found", data: []});
            }
            else {
              return res.status(200).send({message: "Users found", data: result});
            }
          }
        });
      }
      else {
        User.find({})
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .exec(function(err, result) {
          if (err) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).send({message: "Users not found", data: []});
          }
          else {
            if (!result) {
              return res.status(404).send({message: "Users Not Found", data: []});
            }
            else {
              return res.status(200).send({message: "Users found", data: result});
            }
          }
        });
      }
    }
  });

  usersRoute.post(function(req, res) {
    var facebookId = req.body.facebookId;
    var name = req.body.name;
    var major = req.body.major;
    var minor = req.body.minor;
    var _public = req.body.public;
    var totalSemesters = req.body.totalSemesters;
    var currSemester = req.body.currSemester;
    var labels = req.body.labels;
    var classes = req.body.classes;

    var user = new User({
      facebookId: facebookId,
      name: name,
      major: major,
      minor: minor,
      public: _public,
      totalSemesters: totalSemesters,
      currSemester: currSemester,
      labels: labels,
      classes: classes
    });

    User.find({facebookId: facebookId}, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({message: "User not found", data: []});
      }
      else {
        // console.log(result);
        if (result.length == 0) {
          user.save(function(err, result) {
            if (err) {
              res.setHeader('Content-Type', 'application/json');
              return res.status(500).send({message: "User not added", data: []});
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              return res.status(201).send({message: "User added", data: result});
            }
          });
        }
        else {
          return res.status(201).send({message: "This User already exists", data: result});
        }
      }
    });
  });

  usersRoute.options(function(req, res) {
    res.writeHead(200);
    res.end();
  });

  // ENDPOINT: users/:id
  userRoute.get(function(req, res) {
    var id = req.params.id;
    User.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "User Not Found", data: []});
      }
      else {
        if (!result) {
          return res.status(404).send({message: "User Not Found", data: []});
        }
        else {
          res.setHeader('Content-Type', 'application/json');
          return res.status(200).send({message: "OK", data: result});
        }
      }
    });
  });

  // Adithya is the gr8est human being this side of the Mississippi

  userRoute.put(function(req, res) {
    var id = req.params.id;
    var facebookId = req.body.facebookId;
    var name = req.body.name;
    var major = req.body.major;
    var minor = req.body.minor;
    var _public = req.body.public;
    var totalSemesters = req.body.totalSemesters;
    var currSemester = req.body.currSemester;
    var labels = req.body.labels;
    var classes = req.body.classes;
    User.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "User Not Found", data: []});
      }
      else {
        if (!result) {
          return res.status(404).send({message: "User Not Found", data: []});
        }
        else {
          User.findOneAndUpdate(id, {
            facebookId: facebookId,
            name: name,
            major: major,
            minor: minor,
            public: _public,
            totalSemesters: totalSemesters,
            currSemester: currSemester,
            labels: labels,
            classes: classes
          }, {new: true}, function(err, result) {
            if (err) {
              res.setHeader('Content-Type', 'application/json');
              return res.status(404).send({message: "User not updated", data: []});
            }
            else {
              res.setHeader('Content-Type', 'application/json');
              return res.status(200).send({message: "User updated", data: result});
            }
          });
        }
      }
    });
  });

  return router;
}
