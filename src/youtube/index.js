const getLikeVideos = require('./videoCall').getLikeVideos;
const requestConfig = require('./videoCall').requestConfig;

let videos;


// Get all the videos here.... most likey get them in sets of 20 per request.
// Upon completion, parse the video links and store their titles and ID's.
// Then, query again until the field nextPageToken is absent.

// params.pageToken = res.nextPageToken;