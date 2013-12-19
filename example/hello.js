module.exports = {
  name: 'hello plugin',
  type: 'private',
  matcher: /^hello (.*)/,
  authorized: function(nick) {
    return nick == 'bthesorceror';
  },
  onMatch: function(name) {
    this.reply("Hello, " + name);
  },
  help: "there is a command in my beer!"
}

