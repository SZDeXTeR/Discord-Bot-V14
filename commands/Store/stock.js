const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stock')
        .setDescription('Shows available products, their prices, and the accounts count.'),

        async execute(interaction) {
            // read the JSON file and parse the data
            const filePath = path.join(__dirname, `./stores/${interaction.guildId}.json`);
            const data = JSON.parse(fs.readFileSync(filePath));

            const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${data.name} Products`)
            .setThumbnail(data.logoUrl);

            // iterate over the products in the JSON data
            for (const [key, value] of Object.entries(data.products)) {
                // embed.addFields({name: key.toString(), value: `Price: ${value.price.toString()} USD\nAccounts: ${value.accounts.length.toString()}`, inline: true});
                embed.addFields({name: `+++++[ ${key.toString()} ]+++++`,
                value: `
                  > **Price :** ${value.price.toString()}
                  > **Stock :** ${value.accounts.length.toString()}
                  > **To buy:** \`/buy\` 
                  `})
            }

            // embed.addFields({name: 'Account Count', value: data.sellers.length.toString(), inline: true});

            await interaction.reply({ embeds: [embed] });
        },
};