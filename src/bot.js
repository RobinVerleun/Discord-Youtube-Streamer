import log from './logger';
const auth = require('./config/auth.js');
const config = require('./config/config.js');

import Discord from 'discord.js';
import { joinChannel, leaveChannel } from './bot-utils';

/*
* The strategy here is we're going to attach callbacked to certain events for the client.
*/
const client = new Discord.Client();

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

  const { content } = msg;

  switch(content) {
    case 'yt play':
      joinChannel(msg);
      break;
    case 'yt gtfo':
      leaveChannel(msg);
      break;
    case 'yt ping':
      msg.channel.send(msg.member.joinedAt.toDateString());
  }
});

// Log the bot in
client.login(auth.token);



// logger.debug(member.joinedAt.toDateString);
// msg.channel.send(member.joinedAt.toDateString());