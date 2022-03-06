/*
 * Primary file for rest API
 *
 * Date written : 01 Mar, 2002
 * Written by : JWong
 */

// external dependencies
let express = require("express");
let bodyParser = require("body-parser");
let cors = require('cors');
let compression = require('compression');
let serveStatic = require('serve-static')
let https = require('https');
let fs = require('fs');
var path = require('path')

// internal dependencies
let config = require('./lib/config');
let routes = require('./routers');

let privateKey  = fs.readFileSync('ssl/key.pem', 'utf8');
let certificate = fs.readFileSync('ssl/certificate.pem', 'utf8');
let credentials = {key: privateKey, cert: certificate};

let app = express();

// setup global variable for stats gathering
global.g_stats = [];

// read stats file from disk
const CONST_STATSFILE = config.statsPath + '/' + config.statsFile;
if (fs.existsSync(CONST_STATSFILE)) {
  let buffer = fs.readFileSync(CONST_STATSFILE);
  g_stats = JSON.parse(buffer);
}

app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

let httpsServer = https.createServer(credentials, app);

httpsServer.listen(config.httpsPort, () => {
  console.log("API running https on port : " + config.httpsPort);
})

https.createServer(credentials, app).listen(config.adminPort, function(){
  console.log("Express server listening on port " + config.httpsPort);
})

// function setHeaders (res, path) {
//   res.setHeader('Content-Type', 'text/html');
// }
// app.use(serveStatic(path.join(__dirname, 'admin'), {
//   setHeaders: setHeaders
// }))

// for adminstrators
app.use('/admin', express.static('admin'))

// for public users
app.use('/public', express.static('public'))

/* 
  Setting servers timeout
  (NOTE this is in milliseconds - 30 seconds) 

  httpsServer.timeout = 30000; 

 */