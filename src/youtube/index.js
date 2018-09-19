const getLikeVideos = require('./videoCall').getLikeVideos;
const requestConfig = require('./videoCall').requestConfig;

const getVideos = async () => {
  
  let videos = [];
  let result = await getLikeVideos(requestConfig);
  parseResult(result.items, videos);

  while(result.nextPageToken) {
    requestConfig.params.pageToken = result.nextPageToken;
    result = await getLikeVideos(requestConfig);
    parseResult(result.items, videos);
  };

  return videos;
};

const parseResult = (items, videos) => {
  items.forEach( (item) => {
    videos.push({
      title: item.snippet.title,
      id: item.id
    });
  });
}

getVideos();

// Get all the videos here.... most likey get them in sets of 20 per request.
// Upon completion, parse the video links and store their titles and ID's.
// Then, query again until the field nextPageToken is absent.

// params.pageToken = res.nextPageToken;

module.exports = getVideos;