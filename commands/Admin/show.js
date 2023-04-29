const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('show')
        .setDescription('show a specified room to @everyone')
        .addChannelOption(option =>
            option.setName('room')
                .setDescription('The room to show to @everyone')
                .setRequired(true)),

                /**
                 * @param {ChatInputCommandInteraction} interaction
                 */
    async execute(interaction) {
        const channel = interaction.options.getChannel('room');

        // Check if user has the MANAGE_CHANNELS permission
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({content: 'You do not have permission to show channels.', ephemeral: true});
        }

        // Update channel permissions to hide from @everyone
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            [PermissionFlagsBits.ViewChannel]: true
        });

        return interaction.reply(`**The ${channel} room has been showed for @everyone.**`);
    },
};
