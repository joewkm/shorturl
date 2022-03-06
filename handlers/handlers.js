/*
 * General request handlers
 *
 * Date written : 01 Mar, 2002
 * Written by : JWong
 * 
 */

// Dependencies
let fs = require('fs');
let config = require('../lib/config');

// handlers container
let handlers = {};

const CONST_URL_PREFIX = config.urlPrefix;
const CONST_DATA_PATH = config.dataPath;
const CONST_STATSFILE = config.statsFile;


// Ping to see if alive
handlers.ping = ( req, res ) => {
  let now = new Date();
  res.status(200).json({'response' : now});
};


// handle not-found
handlers.notFound = ( req, res ) => {
  res.status(400).json({'response' : 'not found'});
};


// use to test whatever
handlers.test = ( req, res ) => {
  let data = req.body;
  res.status(200).json(g_stats);
};


/*
  /addURL method (post)
  This method register the long url with the API.
  It creates a json file that store the info in the following format
  in the ./data folder

  file name format :
  <identifier>.json

  json file content:
  {
    "shortURL":"https://mini.url/1o5f8a8",
    "longURL":"https://www.google.ca/maps/place/Eiffel+Tower,+Paris,+France/@48.853909,2.2825967,14z/data=!3m1!4b1!4m5!3m4!1s0x47e6701f7e8337b5:0xa2cb58dd28914524!8m2!3d48.8560934!4d2.2930458?hl=en",
    "description":"Eiffel Tower, Paris"
  }

  The API returns a json object
  {
    "shortURL": "https://mini.url/iqa8i80i",
    "longURL": "https://www.google.ca/maps/place/Victoria,+BC/@48.4262362,-123.376732,14z/data=!3m1!4b1!4m5!3m4!1s0x548f738bddb06171:0x38e8f3741ebb48ed!8m2!3d48.4284207!4d-123.3656444?hl=en",
    "description": "Victoria, British Columbia"
  }

  Requires the following in the body when invoked:
  {
    "url" : "....long url...",
    "description" : "...description of url..."
  }

  e.g.
  {
      "url" : "https://www.google.ca/maps/place/Victoria,+BC/@48.4262362,-123.376732,14z/data=!3m1!4b1!4m5!3m4!1s0x548f738bddb06171:0x38e8f3741ebb48ed!8m2!3d48.4284207!4d-123.3656444?hl=en",
      "description" : "Victoria, British Columbia"
  }
*/
handlers.addURL = ( req, res ) => {

  /* 
    this function generate a random string of 7 chars 
  */
  const miniURL = () => {
    return (Math.random() + 1).toString(36).substring(5);
  };

  let rand_str = miniURL();
  let short_url = CONST_URL_PREFIX + rand_str;
  let fname = CONST_DATA_PATH + rand_str + '.json';

  /* 
    check if generated filename conflict with
    existing one. If yes, regen until unique 
    filename. Keep trying for 50 times, then give up.
  */
  let gotMiniStr = false;
  for (let step = 1; step < 10; step++) {
    if (fs.existsSync(fname)) {
      rand_str = miniURL();
      short_url = CONST_URL_PREFIX + rand_str;
      fname = CONST_DATA_PATH + rand_str + '.json';
    } else {
      gotMiniStr = true;
      break;
    }
  }

  /*
    give up after trying more than 50 times
  */
  if (!gotMiniStr){
    res.status(404).json({'response' : 'error generating mini url'});
    return;
  };
  
  const response = {
    'shortURL': short_url,
    'longURL' : req.body.url,
    'description' : req.body.description
  }

  /*
    write file to data folder
  */
  fs.writeFileSync(fname, JSON.stringify(response), (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });

  res.status(200).json(response);

};


/*
  /delURL method (post)
  This method de-register the short URL with the API.
  It basically delete the json file in the ./data folder.
  requires the following in the body:
  {
    "url" : "....shortened url...",
  }

  e.g.
  {
      "url" : "https://mini.url/iqa8i80i",
  }
*/
handlers.delURL = ( req, res ) => {

  let fname = '';
  try {
  fname = req.body.url;
  fname = CONST_DATA_PATH + fname.replace(CONST_URL_PREFIX,'') + '.json';
  } catch (e) {
    res.status(404).json({'response' : 'error deleting file'});
    return;
  };

  /*
    check if file exists - delete 
  */
  if (fs.existsSync(fname)) {
    fs.unlink(fname, (err) => {
      if (err) {
        throw err;
      }
    });
    response = {"response" : "url deregistered"};
  } else {
    response = {"response" : "url not registered"};
  }

  res.status(200).json(response);

};


/*
  /get method (get)
  This method get the long URL from the API.
  API returns the entire registered objects which includes the following:
  . shortened URL
  . originnal URL
  . description
  requires the following in the body:
  {
    "url" : "....shortened url...",
  }

  e.g.
  {
      "url" : "https://mini.url/iqa8i80i",
  }
*/
handlers.getURL = ( req, res ) => {

  let fname = '';
  try {
    fname = req.body.url;
    id = fname;
    fname = CONST_DATA_PATH + fname.replace(CONST_URL_PREFIX,'') + '.json';
  } catch(e) {
    res.status(404).json({'response' : 'error reading shortened url'});
    return;
  }

  let response = {};
  let data = {};
  if (fs.existsSync(fname)) {
    let buffer = fs.readFileSync(fname);
    data = JSON.parse(buffer);
    response = {data};
  } else {
    res.status(404).json({'response' : 'url not registered'});
    return;
  }

  // is ok to return response and still continue code execution!
  res.status(200).json(response);

  logStats(data);

};


/*
  /listURL method (get)
  This method get the long URL from the API.
  API returns a list of all registered objects in an array object

  {
    "response": [
      {
        "shortURL": "https://mini.url/05q20wgg",
        "longURL": "https://www.google.ca/maps/place/The+Great+Pyramid+of+Giza/@29.9792345,31.1320132,17z/data=!3m1!4b1!4m9!1m2!2m1!1spyramids+of+giza!3m5!1s0x14584587ac8f291b:0x810c2f3fa2a52424!8m2!3d29.9792345!4d31.1342019!15sChBweXJhbWlkcyBvZiBnaXphWhIiEHB5cmFtaWRzIG9mIGdpemGSAQdweXJhbWlk?hl=en",
        "description": "The Great Pyramid of Giza"
      },
      {
        "shortURL": "https://mini.url/zf3c9nd",
        "longURL": "https://www.google.ca/maps/place/Big+Ben/@51.5007292,-0.1268141,17z/data=!3m1!4b1!4m5!3m4!1s0x487604c38c8cd1d9:0xb78f2474b9a45aa9!8m2!3d51.5007292!4d-0.1246254?hl=en",
        "description": "Big Ben Clock Tower, London"
      }
    ]
  }
*/
handlers.listURL = ( req, res ) => {

  /*
    list all files in the data folder
  */
  let files = fs.readdirSync(CONST_DATA_PATH);
  let fileArray = new Array();

  files.forEach(function(file) {
    let fdata = fs.readFileSync(CONST_DATA_PATH + '/' + file, 'utf8');
    fileArray.push(JSON.parse(fdata));
  });
  let response = {'response' : fileArray};

  res.status(200).json( response );

};


/*
  This handler returns the stats
*/
handlers.listStats = ( req, res ) => {
  res.status(200).json( g_stats );
};


/*
  This function gathers the stats and write to file
*/
const logStats = (data) => {

  const containsId = (element) => element.id === data.shortURL;
  const idx = g_stats.findIndex(containsId);
  
  if (idx === -1) {
    // if not found, log stats
    g_stats.push({
      id : data.shortURL,
      desc : data.description,
      clickCount : 1
    });
  } else {
    // if found, increment counter
    const inc = g_stats[idx].clickCount + 1;
    g_stats[idx].clickCount = inc;
  }
  
  // write stats to disk to persist using asynchronous write
  const CONST_STATSFILE = config.statsPath + '/' + config.statsFile;
  fs.writeFile(CONST_STATSFILE, JSON.stringify(g_stats), err => {})

}


// Export the handlers
module.exports = handlers;
