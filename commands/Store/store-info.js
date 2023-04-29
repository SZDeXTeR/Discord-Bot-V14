const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('store')
    .setDescription('Displays information about the server store.'),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */
  async execute(interaction, client) {
    const serverId = interaction.guildId;
    const storeFile = path.join(__dirname, `./stores/${interaction.guildId}.json`);

    // Check if the store file exists
    if (!fs.existsSync(storeFile)) {
      await interaction.reply({ content: 'This server does not have a store yet.', ephemeral: true });
      return;
    }

    // Read store data from file
    const storeData = fs.readFileSync(storeFile);
    const store = JSON.parse(storeData);

    const sellerMentions = [];
    for (const sellerId of store.sellers) {
      const seller = await client.users.fetch(sellerId);
      sellerMentions.push(seller.toString());
    }

    const embed = 
      new EmbedBuilder()
      .setColor('Random')
      .setTitle(`🛒 Store Informations 🛒`)
      .setThumbnail(`${store.logoUrl}`)
      .setTimestamp()
      .addFields(
        {name: 'Store Name ✨', value: store.name, inline: true},
        {name: 'Store Owner 👑', value: `<@${store.ownerId}>`, inline: true},
        {name: 'Description 📖', value: store.description},
        {name: 'Sellers 💸', value: sellerMentions.length > 0 ? sellerMentions.join(', ') : 'None'},
      )

    await interaction.reply({ embeds: [embed] });
  },
};
