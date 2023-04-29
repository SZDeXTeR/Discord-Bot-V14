const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embedsay')
        .setDescription('Send a message in an embed')
        .addStringOption(option =>
            option.setName('line1')
                .setDescription('The first line of text for the embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('line2')
                .setDescription('The second line of text for the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('line3')
                .setDescription('The third line of text for the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('line4')
                .setDescription('The fourth line of text for the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('line5')
                .setDescription('The fifth line of text for the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('line6')
                .setDescription('The sixtsh line of text for the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('image')
                .setDescription('The image to display in the embed')
                .setRequired(false)),

    async execute(interaction) {
        const image = interaction.options.getString('image');
        const line1 = interaction.options.getString('line1');
        const line2 = interaction.options.getString('line2');
        const line3 = interaction.options.getString('line3');
        const line4 = interaction.options.getString('line4');
        const line5 = interaction.options.getString('line5');
        const line6 = interaction.options.getString('line6');

        const descriptionParts = [];

if (line1) {
  descriptionParts.push(`> **${line1}**`);
}

if (line2) {
  descriptionParts.push(`> **${line2}**`);
}

if (line3) {
  descriptionParts.push(`> **${line3}**`);
}

if (line4) {
  descriptionParts.push(`> **${line4}**`);
}

if (line5) {
  descriptionParts.push(`> **${line5}**`);
}

if (line6) {
    descriptionParts.push(`> **${line6}**`);
  }

const embed = new EmbedBuilder()
  .setColor('#FF0000')
  .setDescription(descriptionParts.join('\n\n'));

        if (image) {
            if (image.startsWith('http')) {
                embed.setImage(image);
            } else {
                return interaction.reply('Invalid image URL provided.');
            }
        }

        return interaction.reply({ embeds: [embed] });
    },
};
