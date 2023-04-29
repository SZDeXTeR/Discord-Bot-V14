const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('store-admin')
    .setDescription('Manage the server store.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create a new store.')
        .addStringOption(option =>
          option.setName('name')
            .setDescription('The name of the store.')
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('description')
            .setDescription('The description of the store.')
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('logo')
            .setDescription('The logo URL of the store.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('edit')
        .setDescription('Edit the store details.')
        .addStringOption(option =>
          option.setName('name')
            .setDescription('The new name of the store.')
        )
        .addStringOption(option =>
          option.setName('description')
            .setDescription('The new description of the store.')
        )
        .addStringOption(option =>
          option.setName('logo')
            .setDescription('The new logo URL of the store.')
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('delete')
        .setDescription('Delete the store.')
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const creditsFilePath = path.join(__dirname, `./stores/${interaction.guildId}.json`);

    switch (subcommand) {
        case 'create':
          const serverId = interaction.guildId;
          console.log(`File ${creditsFilePath} created successfully.`);

          if (fs.existsSync(creditsFilePath)) {
            await interaction.reply({ content: 'This server already has a store.', ephemeral: true });
            return;
          } else {
            fs.writeFileSync(creditsFilePath, '{}');
          }
      
          // Get store info from user input
          const storeName = interaction.options.getString('name');
          const storeDescription = interaction.options.getString('description');
          const storeLogoUrl = interaction.options.getString('logo');
          const storeOwner = interaction.user.id;
      
          // Create store data object
          const storeData = {
            name: storeName,
            description: storeDescription,
            logoUrl: storeLogoUrl,
            ownerId: storeOwner,
            sellers: [],
            products: {},
          };
      
          // Write store data to file

          fs.writeFileSync(creditsFilePath, JSON.stringify(storeData));
      
          await interaction.reply({ content: 'Store created successfully!', ephemeral: true });
          break;


      case 'edit':

        if (!fs.existsSync(creditsFilePath)) {
          await interaction.reply({ content: 'The store does not exist.', ephemeral: true });
          return;
        }

        const store = JSON.parse(fs.readFileSync(creditsFilePath));

        if (interaction.guild.ownerId !== interaction.user.id) {
          await interaction.reply({ content: 'Only the server owner can edit the store.', ephemeral: true });
          return;
        }

        const newName = interaction.options.getString('name');
        const newDescription = interaction.options.getString('description');
        const newLogo = interaction.options.getString('logo');

        if (newName) store.name = newName;
        if (newDescription) store.description = newDescription;
        if (newLogo) store.logoUrl = newLogo;

        fs.writeFileSync(creditsFilePath, JSON.stringify(store));

        await interaction.reply({ content: 'Store edited!', ephemeral: true });
        break;

      case 'delete':

        if (!fs.existsSync(creditsFilePath)) {
          await interaction.reply({ content: 'The store does not exist.', ephemeral: true });
          return;
        }

        if (interaction.guild.ownerId !== interaction.user.id) {
          await interaction.reply({ content: 'Only the server owner can delete the store.', ephemeral: true });
          return;
        }
        fs.unlinkSync(creditsFilePath);

        await interaction.reply({ content: 'Store deleted!', ephemeral: true });
        break;
    
      default:
        await interaction.reply({ content: 'Invalid subcommand.', ephemeral: true });
        break;
    }
    },
};