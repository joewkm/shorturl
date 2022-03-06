/*
 * router.js
 * This module contains routing handlers for the entire apps
 * Date Written : Mar 3, 2022
 * Written By : JWong
 */

var handlers = require('./handlers/handlers');

let appRouter = function (app) {

  app.get("/shorturl", function(req, res) {
      res.status(200).send('OK');
  });

  app.use(function(req, res, next){
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "*");
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      next();
  });
  app.get('/ping', handlers.ping);
  app.get('/test', handlers.test);
  app.post('/addURL', handlers.addURL);
  app.post('/delURL', handlers.delURL);
  app.post('/getURL', handlers.getURL);
  app.get('/listURL', handlers.listURL);
  app.get('/listStats', handlers.listStats);
}

module.exports = appRouter;
