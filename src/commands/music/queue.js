'use strict';
const Command = require('../../plugin/Command');
const language = require('../../i18n');

/**
 * Command class
 */
class Queue extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'queue',
      category: 'music',
      description: 'command_queue_description',
      usage: 'queue (clear [all | number])',
      nsfw: false,
      enable: true,
      guildOnly: true,
      aliases: [],
      mePerm: [
        'EMBED_LINKS',
      ],
    });
    this.client = client;
  };
  /**
   * @param {Message} message - message
   * @param {Array} query - argument
   * @param {Object} options - options
   * @param {Object} options.guild - guild data
   * @return {Message}
   */
  async launch(message, query, {guild}) {
    if (!guild.player_history || guild.player_history.length < 1) {
      return message.channel.send(language(guild.lg, 'command_music_notQueue'));
    };
    const player = new (require('./play'))(this.client);
    if (!query.join('')) {
      return message.channel.send({
        embed: {
          color: '#2F3136',
          title: language(guild.lg, 'command_queue_select')
              .replace(/{{emote}}+/g, this.client.config.emote.no.id),
          description: `arguments: \`clear [all or number]\`\n\n`+
          `${guild.player_history.map((v, i) =>
            `[${i+1}] ${v.snippet.title}`).join('\n')}`,
        },
      });
    };
    const act = query.shift();
    if (act !== 'clear') {
      // eslint-disable-next-line max-len
      return message.channel.send(
          language(guild.lg, 'command_queue_select'),
      );
    };
    if (query.join('') === 'all') {
      guild.player_history = [];
      guild = await player.updateQueue(guild.player_history, message);
      return message.react(this.client.config.emote.yes.snowflake);
    } else if (guild.player_history[query.join('')-1]) {
      guild.player_history.splice(query.join('')-1, 1);
      guild = await player.updateQueue(guild.player_history, message);
      return message.react(this.client.config.emote.yes.snowflake);
    } else {
      // eslint-disable-next-line max-len
      return message.channel.send(
          language(guild.lg, 'command_queue_choose')
              .replace(/{{emote}}+/g, this.client.config.emote.no.id),
      );
    }
  };
};

module.exports = Queue;
