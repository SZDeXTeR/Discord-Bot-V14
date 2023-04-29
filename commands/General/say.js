const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Repeats your message and optionally attaches an image.')
        .addStringOption(option =>
            option
                .setName('message')
                .setDescription('Enter the message you want to send.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('image')
                .setDescription('Enter a URL or upload an image to send as an attachment.')),

    async execute(interaction) {
        const message = interaction.options.getString('message');
        const image = interaction.options.getString('image');

        const messageContent = image ? `${message} 📷` : message;

        const attachment = image
            ? { files: [image] }
            : undefined;

        await interaction.reply({ content: messageContent, ...attachment });
    }
};