const AuthInstance = require('./auth');
const { google } = require('googleapis');

/**
 * Remove parameters that do not have values.
 *
 * @param {Object} params A list of key-value pairs representing request
 *                        parameters and their values.
 * @return {Object} The params object minus parameters with no values set.
 */
function removeEmptyParameters(params) {
  for (var p in params) {
    if (!params[p] || params[p] == 'undefined') {
      delete params[p];
    }
  }
  return params;
}

const videosListMyRatedVideos = async(requestData) => {
  let auth = await AuthInstance();
  var service = google.youtube('v3');
  var parameters = removeEmptyParameters(requestData['params']);
  parameters['auth'] = auth;
  
  let res = await service.videos.list(parameters)
  .catch( err => {
    console.log('The API returned an error: ' + err);
  });
  console.log(res.data);
  return res.data;
}

const requestData = {
  'params': {
    'myRating': 'like',
    'part': 'snippet'
  }
}

module.exports.getLikeVideos=videosListMyRatedVideos;
module.exports.requestConfig=requestData;