module.exports = {
  name: 'joiner plugin',
  type: 'private',
  matcher: /^join (#.*)/,
  authorized: function(nick) {
    return nick == 'bthesorceror';
  },
  onMatch: function(channel) {
    this.join(channel);
    this.reply("Joining " + channel);
  },
  help: "type 'join {channel}' to cause the bot to join a channel"
}

