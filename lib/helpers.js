/*
 * Helpers for various tasks
 *
 * Written : Mar 3, 2022
 * Written By : JWong
 * 
 */

// Dependencies
let config = require('./config');

// Container for all the helpers
let helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = (str) => {
  try{
    let obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = (strLength) => {
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength){
    // Define all the possible characters that could go into a string
    let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    let str = '';
    for(i = 1; i <= strLength; i++) {
        // Get a random charactert from the possibleCharacters string
        let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        // Append this character to the string
        str+=randomCharacter;
    }
    // Return the final string
    return str;
  } else {
    return false;
  }
};

// check if string is numeric
helpers.isNumeric = (n,callback) => {
  if (!isNaN(parseFloat(n)) && isFinite(n) ) {
    callback(false);
  } else {
    callback(true);
  }
};

// return current datetime as string
helpers.now = () => {
  let date = new Date();
  let aaaa = date.getFullYear();
  let gg = date.getDate();
  let mm = (date.getMonth() + 1);
  if (gg < 10)
      gg = "0" + gg;
  if (mm < 10)
      mm = "0" + mm;
  let cur_day = aaaa + "-" + mm + "-" + gg;
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds();
  if (hours < 10)
      hours = "0" + hours;
  if (minutes < 10)
      minutes = "0" + minutes;
  if (seconds < 10)
      seconds = "0" + seconds;
  return cur_day + " " + hours + ":" + minutes ;
}

// Export the module
module.exports = helpers;



