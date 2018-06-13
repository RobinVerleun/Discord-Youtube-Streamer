import log from './logger';
const auth = require('./config/auth.js');
const config = require('./config/config.js');

import Discord from 'discord.js';
import VoiceController from './voiceController';
import TextController from './textController';

/*
* The strategy here is we're going to attach callbacked to certain events for the client.
*/
const client = new Discord.Client();
const voiceController = new VoiceController(client);
const textController = new TextController(client);

// The ready event is vital. It means the bot will only start reacting to information
// from discord _after_ the ready is emitted.
client.on('ready', () => {
  log.info(`Logged in as ${client.user.tag}!`);
});


client.on('message', msg => {

  // Ignore other bots.
  if(msg.author.bot) return;

  // Ignore all requests which don't begin with the proper prefix.
  if(msg.content.indexOf(config.prefix) !== 0) return;
  
  // Get the command and args
  const { content } = msg;

  let args = msg.content.substring(config.prefix_length).split(' ');
  let cmd = args[0];
  args = args.splice[1] || [];

  switch(cmd) {
    case 'play':
      voiceController.playYoutubeAudio(msg, args[0]);
      return;
    case 'gtfo':
      voiceController.leaveChannel(msg);
      return;
    case 'ping':
      textController.messageChannel(msg.channel, msg.member.joinedAt.toDateString());
      return;
  }
});

// Log the bot in
client.login(auth.token);



// logger.debug(member.joinedAt.toDateString);
// msg.channel.send(member.joinedAt.toDateString());