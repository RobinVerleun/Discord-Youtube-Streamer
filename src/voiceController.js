import log from './logger';
import ytdl from 'ytdl-core';

import TextController from './textController';

export default class VoiceChannelController {

  constructor(client) {
    this.client = client;
    client.voiceController = this;
    
    this.currentVoiceChannel = null;
    this.dispatcher = null;
  }

  /**
   * This is the function called when the user asks the bot to begin playing.
   * If the channel is joined successfully, the bot begins to pull in stream data from youtube and begin playing.
   * TODO: Use the youtube API to get a collection of links to the videos in the playlist. Generate
   * a linkData object, pass it in to streamAudio.
   * 
   * @param {*} msg : A Message object from the Discord.js API. Used to access the voice channel of a user.
   */
  playYoutubeAudio(msg, videos, _uri) {

    const { textController } = this.client;
    
    if(!msg.member.voiceChannel) {
      textController.messageChannel(
      msg.channel, `Looks like you're not in a voice channel ${msg.member.user} - please join one and try again.`);
      return;
    }
      
    const voiceChannel = msg.member.voiceChannel;

    if(voiceChannel.joinable) {
      voiceChannel.join()
      .then(connection => {
        this.currentVoiceChannel = voiceChannel;

        if(_uri) {
          this.streamAudio(connection, _uri);
        } 
        // else {
        //   this.streamPlaylist(connection, videos);
        // }

        log.debug(`Joined voiceChannel: ${voiceChannel.name}.`);
      }).catch( e => {
          this.client.textController.messageChannel(msg.channel, 'Uh oh - there was a problem playing that link.');
          log.error(e);
        }
      )
    } else {
      textController.messageChannel(msg.channel, 'I don\'t have permission to join this channel. :(');
    } 
  }

  /**
   * Function for handling the repeatable task of converting the youtube link to audio and sending it to discord.
   * Private function for use in playYoutubeAudio.
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
   * @param {string} uri     : json object which contains information relevant to the yt link
   */
  streamAudio(connection, uri) {
    log.debug(uri);
    const stream = (
      ytdl(
        uri, {filter : 'audioonly'} 
      )
    );
    const dispatcher = connection.playStream(stream);
    dispatcher.once('end', (reason) => {
      log.debug('Ended: ' + reason);
      this.leaveChannel();
    });
    dispatcher.on('error', (reason) => {
      log.debug('Ended: ' + reason);
      this.leaveChannel();
    });
  }

  streamPlaylist(connection, videos) {
    this.shuffleArray(videos);
    
    let index = 0;
    let playing = false;
    while(index < videos.length) {
      if(!playing) {
        const stream = (
          ytdl(
            `https://www.youtube.com/watch?v=${videos[index].id}`, {filter : 'audioonly'} 
          )
        );
        const dispatcher = connection.playStream(stream);
        dispatcher.once('end', (reason) => {
          log.debug('Ended: ' + reason);
          if(index === videos.length - 1) {
            this.leaveChannel();
          } else {
            index++;
          }
        });
        playing = true;
      }
    }
  };

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Checks if the current channel has a state. If so, leaves.
   */
  leaveChannel() {
    if(this.currentVoiceChannel) {
      this.currentVoiceChannel.leave();
      this.currentVoiceChannel = null;
    };
  }
  
}