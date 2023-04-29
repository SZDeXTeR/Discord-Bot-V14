const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Activate or disable the welcome message.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('activate')
        .setDescription('Activate the welcome message.')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('The channel where the welcome message should be sent.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('disable')
        .setDescription('Disable the welcome message.')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;
    const filePath = path.join(__dirname, `../../JSON/Welcome/welcome-${guildId}.json`);

    if (subcommand === 'activate') {
      const channel = interaction.options.getChannel('channel');
      const welcomeData = {
        enabled: true,
        channelId: channel.id
      };

      fs.writeFileSync(filePath, JSON.stringify(welcomeData, null, 2));

      
      await interaction.reply({ content: `Welcome message has been activated in ${channel}.`, ephemeral: true });
    } else if (subcommand === 'disable') {
      if (!fs.existsSync(filePath)) {
        return await interaction.reply({ content: 'Welcome message is already disabled.', ephemeral: true });
      }
      fs.unlinkSync(filePath);
      await interaction.reply({ content: 'Welcome message has been disabled.', ephemeral: true });
    }
  }
};
