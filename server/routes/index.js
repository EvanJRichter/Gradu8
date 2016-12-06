/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
  app.use('/api', require('./home.js')(router));
  
  app.use('/api', require('./label.js')(router));
  app.use('/api', require('./labels.js')(router));

  app.use('/api', require('./class.js')(router));
  app.use('/api', require('./classes.js')(router));

  app.use('/api', require('./user.js')(router));
  app.use('/api', require('./users.js')(router));

  app.use('/api', require('./major.js')(router));
  app.use('/api', require('./majors.js')(router));

  app.use('/api', require('./minor.js')(router));
  app.use('/api', require('./minors.js')(router));

  app.use('/api', require('./school.js')(router));
  app.use('/api', require('./schools.js')(router));
};
