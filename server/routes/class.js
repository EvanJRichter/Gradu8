// GET, GET/id, POST, PUT/id, DELETE/id
var secrets = require('../config/secrets');
var Class = require('../models/class');
var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = function(router) {

  var classesRoute = router.route('/classes');
  var classRoute = router.route('/classes/:id');

  // ENDPOINT: classes
  classesRoute.get(function(req, res) {
    var where = eval("("+req.query.where+")");
    var sort = eval("("+req.query.sort+")");
    var select = eval("("+req.query.select+")");
    var skip = eval("("+req.query.skip+")");
    var limit = eval("("+req.query.limit+")");
    var count = eval("("+req.query.count+")");
    if (count) {
      if (where) {
        Class.find({})
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
        Class.find({})
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
        Class.find({})
        .where(where)
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .exec(function(err, result) {
          if (err) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).send({message: "Classes not found", data: []});
          }
          else {
            console.log(result);
            if (!result) {
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
        .exec(function(err, result) {
          if (err) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).send({message: "Classes not found", data: []});
          }
          else {
            if (!result) {
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

    Class.find({number:number, department:department}, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).send({message: "Class not found", data: []});
      }
      else {
        // console.log(result);
        if (result.length == 0) {
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
        }
        else {
          return res.status(201).send({message: "This class already exists", data: result});
        }
      }
    });
  });

  classesRoute.options(function(req, res) {
    res.writeHead(200);
    res.end();
  });

  // ENDPOINT: classes/:id
  classRoute.get(function(req, res) {
    var id = req.params.id;
    Class.findById(id, function(err, result) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).send({message: "Class Not Found", data: []});
      }
      else {
        if (!result) {
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
        if (!result) {
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
        if (!result) {
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
