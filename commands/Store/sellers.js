const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sellers')
        .setDescription('Add or remove sellers from the store')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a seller to the store')
                .addUserOption(option => 
                    option.setName('seller')
                    .setDescription('The user to add as a seller')
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a seller from the store')
                .addUserOption(option => 
                    option.setName('seller')
                    .setDescription('The user to remove as a seller')
                    .setRequired(true))),
    async execute(interaction) {
        const serverId = interaction.guildId;
        const sellerId = interaction.options.getUser('seller').id;
        const filePath = path.join(__dirname, `./stores/${interaction.guildId}.json`);

        if (!fs.existsSync(filePath)) {
            await interaction.reply({ content: `This Server don't have a store, create one using \`\`/store-admin create\`\``, ephemeral: true })
            return;
        }

        try {
            let data = fs.readFileSync(filePath);
            let store = JSON.parse(data);

            switch (interaction.options.getSubcommand()) {
                case 'add':
                    if (interaction.user.id !== store.ownerId) await interaction.reply({ content: 'You are not the store owner ! ❌', ephemeral: true })
                    if (!store.sellers.includes(sellerId)) {
                        store.sellers.push(sellerId);
                        fs.writeFileSync(filePath, JSON.stringify(store, null, 2));
                        await interaction.reply(`**${interaction.options.getUser('seller').username} has been added as a seller. ✅ **`);
                    } else {
                        await interaction.reply(`**${interaction.options.getUser('seller').username} is already a seller. :thinking: **`);
                    }
                    break;
                case 'remove':
                    if (interaction.user.id !== store.ownerId) await interaction.reply({ content: '**You are not the store owner ! ❌**', ephemeral: true })
                    if (store.sellers.includes(sellerId)) {
                        store.sellers = store.sellers.filter(id => id !== sellerId);
                        fs.writeFileSync(filePath, JSON.stringify(store, null, 2));
                        await interaction.reply(`**${interaction.options.getUser('seller').username} has been removed from sellers. ✅ **`);
                    } else {
                        await interaction.reply(`**${interaction.options.getUser('seller').username} is not a seller. :thinking: **`);
                    }
                    break;
                default:
                    await interaction.reply('Invalid subcommand.');
            }
        } catch (error) {
            console.log(error);
            await interaction.reply('An error occurred while executing the command.');
        }
    },
};
