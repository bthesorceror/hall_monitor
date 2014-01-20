var assert       = require('assert');
var Bot          = require('../index');
var EventEmitter = require('events').EventEmitter;

describe("Bot", function() {
  beforeEach(function(done) {
    this.client = new EventEmitter();

    this.bot = new Bot('irc.freenode.net', {
      client: this.client
    });

    done();
  });

  it("is initialized", function() {
    assert.ok(this.bot);
  });

  describe("with plugins", function() {

    describe("for private messages", function() {

      beforeEach(function(done) {
        this.plugin = {
          name: 'joiner plugin',
          type: 'private',
          matcher: /^join (#.*)/,
          onMatch: function(channel) {},
          help: "type 'join {channel}' to cause the bot to join a channel"
        }

        this.bot.register(this.plugin);

        done();
      });

      it("receives correct context on match", function(done) {
        this.bot.channels = function() { return [1, 2, 3]; };

        this.plugin.onMatch = function(channel) {
          assert.equal(this.nick, 'john');
          assert.equal(this.raw_message, 'join #rain');
          assert.deepEqual(this.channels(), [1, 2, 3]);
          assert.ok(this.join);
          assert.ok(this.reply);
          done();
        }

        this.client.emit('pm', 'john', 'join #rain');
      });

      it("receives message on match", function(done) {
        this.plugin.onMatch = function(channel) {
          assert.equal(channel, '#rain');
          done();
        }

        this.client.emit('pm', 'john', 'join #rain');
      });

      it("does not receives message on mismatch", function(done) {
        this.bot.on('pm', function() {
          done();
        });

        this.client.emit('pm', 'john', 'join rain');
      });

      it("does not receives message when not authorized", function(done) {
        this.plugin.authorized = function(nick) {
          assert.equal(nick, 'john');
          return false;
        };

        this.bot.on('pm', function() {
          done();
        });

        this.client.emit('pm', 'john', 'join #rain');
      });

      it("receives message when authorized", function(done) {
        this.plugin.authorized = function(nick) {
          assert.equal(nick, 'john');
          return true;
        };

        this.plugin.onMatch = function(channel) {
          assert.equal(channel, '#rain');
          done();
        }

        this.client.emit('pm', 'john', 'join #rain');
      });
    });

  });
});
