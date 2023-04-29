const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hide')
        .setDescription('Hides a specified room from @everyone')
        .addChannelOption(option =>
            option.setName('room')
                .setDescription('The room to hide from @everyone')
                .setRequired(true)),

                /**
                 * @param {ChatInputCommandInteraction} interaction
                 */
    async execute(interaction) {
        const channel = interaction.options.getChannel('room');

        // Check if user has the MANAGE_CHANNELS permission
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({content: 'You do not have permission to hide channels.', ephemeral: true});
        }

        // Update channel permissions to hide from @everyone
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            [PermissionFlagsBits.ViewChannel]: false
        });

        return interaction.reply(`**The ${channel} room has been hidden from @everyone.**`);
    },
};
