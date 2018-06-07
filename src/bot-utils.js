import log from './logger';

const joinChannel = msg => {

  // TODO: Error handle alllll over this function.
  const { member } = msg;
  const { voiceChannel } = member;
  voiceChannel.join()
    .then(connection => {
      const dispatcher = connection.playFile('E:/iTunes/iPhone Music/Barenaked Ladies/[Barenaked Ladies][One Week][i-funbox.com].mp3');
    }).catch( e => 
      log.error(e)
  );
}

const leaveChannel = msg => {
  // Check if the bot already is in the voice channel, and provide a message accordingly
  //log.debug(msg.member.voiceChannel.members.keys());
  msg.member.voiceChannel.leave();
}

exports.joinChannel = joinChannel;
exports.leaveChannel = leaveChannel;