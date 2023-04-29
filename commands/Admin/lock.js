const { SlashCommandBuilder } = require('@discordjs/builders');
const { alignAuto } = require('ascii-table');
const { MessageEmbed, Client, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, ChannelType, Embed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Locks A Channel.')
    .addChannelOption(option => option.setName('channel').setDescription('the channel you want to lock').addChannelTypes(ChannelType.GuildText).setRequired(true)),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     */

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: "You don't have permissions to use this command ❌", ephemeral: true, })

    let channel = interaction.options.getChannel('channel');

    channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: false })

    const embed = new EmbedBuilder()
    .setTitle(` :white_check_mark:  ${channel} **has been locked 🔒**`)
    .setColor('Red');

    await interaction.reply({ embeds: [embed] })
  },
};
