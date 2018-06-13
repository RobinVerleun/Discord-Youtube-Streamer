


export default class TextController {

  constructor(client) {
    this.client = client;
    client.textController = this;
  }

  messageChannel(channel, message) {
    channel.send(message);
    return;
  }
}