/* eslint-disable */
'use strict';
const Command = require('../../plugin/Command');

/**
   * Command class
   */
class Staff extends Command {
  /**
     * @param {Client} client - Client
     */
  constructor(client) {
    super(client, {
      name: 'staff',
      category: 'japanese',
      description: 'command_staff_description',
      usage: 'staff',
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
    if (!query.join('')) {
      return message.channel.send({
        embed: {
          color: '#2F3136',
          title: 'Rechercher un staff',
          // eslint-disable-next-line max-len
          description: 'Voicie les différent parametre de recherche:\n`id`: [nombre],\n`id_page`: [caractère] Si vous voulez afficher les personnages de fiches différentes vous devez mettre les id comme cela 1,25,50,65,\n`prenom` [caractère],\n`nom` [caractère],\n`native` [caractère],\n`alternative`: [caractère]\n\nexemple: `'+
            guild.prefix + 'personnage -prenom Tatsuya`',
          footer: {
            text: 'Powered by Anemy',
            icon_url: 'https://gblobscdn.gitbook.com/spaces%2F-M4jTJ1TeTR2aTI4tuTG%2Favatar-1586713303918.png?generation=1586713304401821&alt=media',
          },
        },
      });
    };
    let serialize = query.join(' ');
    serialize = serialize.split(/-+/g);
    serialize.shift();
    const mapping = [];
    serialize.map((v) => mapping.push([v.split(/ +/g).shift(), v.split(/ +/g).slice(1).join(' ')]));
    const params = Object.fromEntries(mapping);
    let data = await this.client.anemy.getStaff(params);
    if (!data || data.length < 1) {
      return message.channel.send('Aucun résultat trouvé');
    };
    const result = [];
    if (!data.result) result.push(data);
    data = data.result || result;
    if (!data || data.length < 1) {
      return message.channel.send('Aucun résultat trouvé');
    };
    this.client.anime[message.guild.id] = {
      message: null,
      pagination: 0,
      data,
      type: 'staff',
    };
    this.client.anime[message.guild.id].message =
        await message.channel.send({
          embed: {
            color: '#2F3136',
            title: data[this.client.anime[message.guild.id].pagination].prenom +
              ' '+
              data[this.client.anime[message.guild.id].pagination].nom +
              '  -  ID: ' +
              data[this.client.anime[message.guild.id].pagination].id + ' · ' +
              data[this.client.anime[message.guild.id].pagination].id_page.slice(1, data[this.client.anime[message.guild.id].pagination].id_page.length-1),
            description: data[
                  this.client.anime[message.guild.id].pagination].biographie || 'aucune donnée',
            thumbnail: data[this.client.anime[message.guild.id].pagination].image ?
            {url: encodeURI(data[this.client.anime[message.guild.id].pagination].image)} :
            {},
            fields: [
              {
                name: 'native',
                value: data[
                    this.client.anime[message.guild.id].pagination].native || 'aucune donnée',
                inline: true,
              },
              {
                name: 'alternative',
                value: data[
                    this.client.anime[message.guild.id].pagination].alternative|| 'aucune donnée',
                inline: true,
              },
              {
                name: 'liked',
                value: data[
                    this.client.anime[message.guild.id].pagination].liked || 'aucune donnée',
                inline: true,
              },
            ],
            footer: {
              // eslint-disable-next-line max-len
              text: `Powered by Anemy - page ${this.client.anime[message.guild.id].pagination+1}/${data.length}`,
              icon_url: 'https://gblobscdn.gitbook.com/spaces%2F-M4jTJ1TeTR2aTI4tuTG%2Favatar-1586713303918.png?generation=1586713304401821&alt=media',
            },
          },
        }).catch(e => console.log(e, 'embed'));
    if (data.length > 1) {
      await this.client.anime[message.guild.id].message
          .react('704554846073782362');
      await this.client.anime[message.guild.id].message
          .react('704554845813866506');
    };
  };
};

module.exports = Staff;
