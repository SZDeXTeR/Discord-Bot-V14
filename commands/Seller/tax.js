const { EmbedBuilder, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('tax')
    .setDescription('Claculate Zixel Credits Taxs.')
    .addIntegerOption(option => option.setName('amount').setDescription('The Amount Of Credits').setRequired(true)),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        let amount = interaction.options.getInteger('amount');
        // let amount2 = amount.replace("k","000").replace("m", "000000").replace('M', "000000").replace('K', "000").replace('b',"000000000000").replace('B',"000000000000")
        // let tax = Math.floor(amount2 * (20) / (19) + (1));
        // let tax2 = Math.floor(amount2 * (20) / (19) + (1)-(amount2));
        // let tax3 = Math.floor(tax2 * (20) / (19) + (1));
        // let tax4 = Math.floor(tax2 + tax3 + amount2);

        let tax = Math.floor(amount * 0.1)

        let embed = new EmbedBuilder()
        .setThumbnail(`${interaction.user.displayAvatarURL()}`)
        .setDescription(`> **Done Send all Tax**\n\n> **Tax Here  \`${amount + tax}\`**`)
        .setColor('Red')
        .setTimestamp();

        if (!tax) return await interaction.reply({ content: "Invalid Input", ephemeral: true });
        if (isNaN(amount)) return await interaction.reply({ content: "Invalid Input", ephemeral: true });

        await interaction.reply({ embeds: [embed] });


    }
}