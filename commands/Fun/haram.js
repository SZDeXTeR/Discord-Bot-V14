const { EmbedBuilder, Client, SlashCommandBuilder, ChatInputCommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, SelectMenuBuilder, ButtonStyle, AttachmentBuilder, GuildTemplate, PermissionsBitField, Component } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('haram')
    .setDescription('A Powerfull Command Gives You Some GIFs About Haram !'),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        try {
            let haram = [
                'https://media.tenor.com/WeC1jPTccQUAAAAd/islam-astaghfirullah.gif',
                'https://media.tenor.com/OntziS_jkEMAAAAC/haram.gif',
                'https://media.tenor.com/L0fXyUeWq7oAAAAd/its-haram-its-haran-bro.gif',
                'https://media.tenor.com/Zh5ttpOH1zsAAAAC/haram-alah.gif',
                'https://media.tenor.com/LSdPTJ_Uki4AAAAC/haram-heisenberg.gif'
            ];

            const response = haram[Math.floor(Math.random() * haram.length)]

            interaction.reply(response);
        } catch (error) {
            return console.log(error);
        }
    }
}