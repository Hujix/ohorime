'use strict';
const Command = require('../../plugin/Command');
const language = require('../../i18n');
const {sfw} = new (require('nekos.life'))();

/**
 * Command class
 */
class Kiss extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'kiss',
      category: 'social',
      description: 'command_kiss_description',
      usage: 'kiss (mentions)',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: [],
      mePerm: ['EMBED_LINKS'],
    });
    this.client = client;
  };
  /**
   * @param {Message} message - message
   * @param {Array} query - query
   * @param {Object} options - options
   * @param {Object} options.guild - guild data
   * @return {Message}
   */
  async launch(message, query, {guild}) {
    let self = false;
    const queryMember = query.join(' ');
    let member = message.mentions.members.first() ||
        message.guild.member(
            message.mentions.users.first(),
        ) ||
        message.guild.members.cache.find((member) =>
          member.id === queryMember) ||
        message.guild.members.cache.find((member) =>
          member.displayName === queryMember) ||
        message.guild.members.cache.find((member) =>
          member.user.username === queryMember) ||
        message.guild.members.cache.find((member) =>
          member.toString() === queryMember);
    if (!member) {
      member = message.member;
      self = true;
    };
    const image = await sfw.kiss();
    return message.channel.send({
      embed: {
        color: guild.color,
        title: self ? `${member.displayName} kiss` :
          `${message.member.displayName} kiss ${member.displayName}`,
        description:
          `[${language(guild.lg, 'command_img_notShow')}](${image.url})`,
        image: {
          url: image.url,
        },
      },
    });
  };
};

module.exports = Kiss;
