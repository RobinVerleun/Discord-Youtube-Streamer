import log from './logger';
import ytdl from 'ytdl-core';

// 

/**
 * This is the function called when the user asks the bot to begin playing.
 * If the channel is joined successfully, the bot begins to pull in stream data from youtube and begin playing.
 * 
 * TODO: Error handle alllll over this function.
 * TODO: Use the youtube API to get a collection of links to the videos in the playlist. Generate
 * a linkData object, pass it in to playVideo.
 * 
 * @param {*} msg : A Message object from the Discord.js API. Used to access the voice channel of a user.
 */
const joinChannel = msg => {
  if(!msg.member.voiceChannel) {
    msg.channel.send(`Looks like you're not in a voice channel ${msg.member.user} - please join one and try again.`);
    return;
  }

  const { voiceChannel } = msg.member;

  //This is mock linkData
  let linkData = {
    uri: 'https://www.youtube.com/watch?v=3SDBTVcBUVs',
    fileName: 'You Say Run',
    author: 'My Hero Academia'
  };

  voiceChannel.join()
    .then(connection => {
      playVideo(connection, linkData.uri);
      msg.channel.send(`Now playing: ${linkData.fileName} by ${linkData.author}`);
    }).catch( e => 
      log.error(e)
    );
  }
  
  /**
   * Function for handling the repeatable task of converting the youtube link to audio and sending it to discord.
   * Private function for use in joinChannel.
   * 
   * The stream is a large output of data from ytdl which begins to accumulate in this variable.
   * This is passed into Discord.js playStream, which reads the byte data and begins to play. 
   * 
   * The dispatcher is a StreamDispatcher object (https://discord.js.org/#/docs/main/stable/class/StreamDispatcher)
   * It emits an 'end' event which is probably how we'll tap into moving on to the next video in the playlist
   * It also has a 'destroy' call, which is probably what we'll need to use to kill it? Or we just disconnect the bot.
   * Potential issues with stream continuing while the bot is not in the voice channel. 
   * 
   * @param {object} connection : discord.js connection object, passed in on successful voiceChannel.join()
   * @param {JSON} linkData     : json object which contains information relevant to the yt link
   */
  const playVideo = (connection, uri) => {

    const stream = (
      ytdl(
        uri, {filter : 'audioonly'} 
      ));

    const dispatcher = connection.playStream(stream);
    return;
  }
  
  const leaveChannel = msg => {
    // Check if the bot already is in the voice channel, and provide a message accordingly
    // TODO: Find if possible to make the bot leave from any channel. 
    msg.member.voiceChannel.leave();
  }
  
  exports.joinChannel = joinChannel;
  exports.leaveChannel = leaveChannel;





  // const dispatcher = connection.playFile('E:/iTunes/iPhone Music/Barenaked Ladies/[Barenaked Ladies][One Week][i-funbox.com].mp3');