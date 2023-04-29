const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('🎉 start a giveaway in your server !')
    .addStringOption((option) => option.setName('prize').setDescription('set the prize of the giveaway').setRequired(true))
    .addIntegerOption((option) => option.setName('duration').setDescription('set the duration of the giveaway by Minutes ').setRequired(true))
    .addChannelOption((option) => option.setName('channel').setDescription('set the giveaway channel').setRequired(true)),
  
  async execute(interaction) {
    const prize = interaction.options.getString('prize');
    const duration = interaction.options.getInteger('duration');
    const channel = interaction.options.getChannel('channel');

    const firstEmbed = new EmbedBuilder()
      .setDescription(`> **🎉 Click the button to participate !**\n\n> **⏰ Duration: ${duration}** minute(s)\n\n> **🎁 Prize: ${prize}**`)
      .setTimestamp()
      .setColor('Red');

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('giveaway')
          .setLabel('🎉 Participate')
          .setStyle(ButtonStyle.Primary),
      );

      interaction.reply({ content: 'Giveaway Created Successfully !', ephemeral: true })

    let message = await channel.send({ embeds: [firstEmbed], components: [row] });

    const filter = (interaction) => {
      return interaction.customId === 'giveaway' && !interaction.user.bot;
    };

    const collector = message.createMessageComponentCollector({ filter, time: duration * 60000 });

    let participants = [];

    collector.on('collect', (interaction) => {

      participants.push(interaction.user);
      interaction.reply({ content: "You've entered the giveaway !", ephemeral: true })
    });

    collector.on('end', async () => {
      if (participants.length > 0) {
        const winner = participants[Math.floor(Math.random() * participants.length)];


        const secondEmbed = new EmbedBuilder()
            .setDescription(`> **🎉 Congrats **\n\n> **🥇 The winner is: ${winner}**\n\n> **🎁 Prize: ${prize}**`)
            .setTimestamp()
            .setColor('Green');

        const disableRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('giveaway')
                .setLabel('🎉 Participate')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
        );

        await winner.send({ embeds: [secondEmbed] })


        await message.edit({ embeds: [secondEmbed], components: [disableRow] });
      } else {
        await message.edit(`💫 Sorry, there's no member entered the giveaway for **${prize}**. 🎉`, { components: [] });
      }
    });
  },
};
