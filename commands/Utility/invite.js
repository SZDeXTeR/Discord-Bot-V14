const { EmbedBuilder, Client, SlashCommandBuilder, ChatInputCommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, SelectMenuBuilder, ButtonStyle, AttachmentBuilder, GuildTemplate, PermissionsBitField, Component } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Used To Invite The Bot To Your Server !"),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */

    async execute(interaction, client) {
        try {
            const link = `https://discord.com/api/oauth2/authorize?client_id=1074083057650372789&permissions=8&scope=bot%20applications.commands`
            const Response = new EmbedBuilder()
            .setTitle("💌 Invite Me")
            .setColor('Purple')

            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Invite Me')
                .setStyle(ButtonStyle.Link)
                .setURL(link)
            )


            await interaction.reply({embeds: [Response], components: [row]})
        } catch (error) {
            return console.log(error);
        }
    }
}