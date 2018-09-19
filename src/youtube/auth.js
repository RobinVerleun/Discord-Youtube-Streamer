const fs = require('fs');
const { google } = require('googleapis');
const readlineSync = require('readline-sync');
const ytDataTokenPath = require('../config/auth').ytDataTokenPath;
let OAuth2 = google.auth.OAuth2;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
let SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
let TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
let TOKEN_PATH = TOKEN_DIR + ytDataTokenPath;

const getAuthInstance = async () => {
  let atToken = false; 
  let oauth2client, token;

  try {

    let raw = fs.readFileSync('./client_secret.json');
    let credentials = JSON.parse(raw);

    let clientSecret = credentials.installed.client_secret;
    let clientId = credentials.installed.client_id;
    let redirectUrl = credentials.installed.redirect_uris[0];
    oauth2client = new OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token
    atToken = true;
    token = JSON.parse(fs.readFileSync(TOKEN_PATH));

  } catch (e) {

    if(!atToken) {
        console.log("Error reading client secret file:", e);
        return;
    } else {
      token = await getNewToken(oauth2client);
      return;
    }

  } finally {

    if(atToken) {
      oauth2client.credentials = token;
      return oauth2client;
    }
  }
}

const getNewToken = async (oauth2client) => {
  let authUrl = oauth2client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authroize this app by visiting this url: ', authUrl);
  let code = readlineSync.question('Enter the code from that page here: ');
  token = (await oauth2client.getToken(code)).data;
  storeToken(token);
  return token;
}

const storeToken = (token) => {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (e) {
    if(err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
  console.log('Token stored to ' + TOKEN_PATH);
}

module.exports = getAuthInstance;

