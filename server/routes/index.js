/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
  app.use('/api', require('./home.js')(router));
  app.use('/api', require('./label.js')(router));
  app.use('/api', require('./class.js')(router));
  app.use('/api', require('./user.js')(router));
  app.use('/api', require('./major.js')(router));
  app.use('/api', require('./minor.js')(router));
  app.use('/api', require('./school.js')(router));
};
