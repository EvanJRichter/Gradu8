// GET/id, PUT/id
var secrets = require('../config/secrets');
var User = require('../models/user');
var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = function(router) {
  var usersRoute = router.route('/users');

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
            if (result === null) {
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
            if (result === null) {
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
    var university = req.body.university;
    var major = req.body.major;
    var minor = req.body.minor;
    var _public = req.body.public;
    var totalSemesters = req.body.totalSemesters;
    var currSemester = req.body.currSemester;
    var labels = req.body.labels;
    var classes = req.body.classes;

    var user = new User({
      facebookId: facebookId,
      university: university,
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
       return res.status(500).send({message: "Email not found", data: []});
     }
     else {
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
         return res.status(201).send({message: "This email already exists", data: result});
       }
     }
    });
  });

  usersRoute.options(function(req, res) {
    res.writeHead(200);
    res.end();
  });

  return router;
}
