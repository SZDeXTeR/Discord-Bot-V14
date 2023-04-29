const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('product')
    .setDescription('Manage products in the store.')
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName('create')
      .setDescription('Create a new product.')
      .addStringOption(option => option.setName('name').setDescription('The name of the product.').setRequired(true))
      .addNumberOption(option => option.setName('price').setDescription('The price of the product.').setRequired(true)))
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName('edit')
      .setDescription('Edit an existing product.')
      .addStringOption(option => option.setName('name').setDescription('The name of the product.').setRequired(true))
      .addNumberOption(option => option.setName('price').setDescription('The new price of the product.').setRequired(true)))
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName('add')
      .setDescription('Add an account to a product.')
      .addStringOption(option => option.setName('name').setDescription('The name of the product.').setRequired(true))
      .addStringOption(option => option.setName('account').setDescription('The account to add.').setRequired(true)))
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName('delete')
      .setDescription('Delete an existing product.')
      .addStringOption(option => option.setName('name').setDescription('The name of the product.').setRequired(true))),
    
      /**
       * @param {ChatInputCommandInteraction} interaction 
       * @returns 
       */

  async execute(interaction) {
    const serverId = interaction.guildId;
    const storeFile = path.join(__dirname, `./stores/${interaction.guildId}.json`);

    // Check if the store file exists
    if (!fs.existsSync(storeFile)) {
      await interaction.reply({ content: 'This server does not have a store yet.', ephemeral: true });
      return;
    }
    
    // Read store data from file
    const storeData = fs.readFileSync(storeFile);
    const store = JSON.parse(storeData);


    // Handle subcommands
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'create') {
      const name = interaction.options.getString('name');
      const price = interaction.options.getNumber('price');

      // Check if the product already exists
      if (store.products[name]) {
        await interaction.reply({ content: 'A product with that name already exists.', ephemeral: true });
        return;
      }
      
      // Create the new product
      store.products[name] = { name, price, accounts: [] };

      // Save the updated store data
      fs.writeFileSync(storeFile, JSON.stringify(store, null, 2));

      const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle(`New Product Added! 🎉`)
        .setDescription(`Product name: ${name}\nProduct price: ${price}`)
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'edit') {
      const name = interaction.options.getString('name');
      const price = interaction.options.getNumber('price');

      // Check if the product exists
      if (!store.products[name]) {
        await interaction.reply({ content: 'A product with that name does not exist.', ephemeral: true });
        return;
      }

      // Update the product
      store.products[name].price = price
        // Save the updated store data
    fs.writeFileSync(storeFile, JSON.stringify(store, null, 2));

    const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle(`Product Updated! 🎉`)
        .setDescription(`Product name: ${name}\nNew product price: ${price}`)
        .setTimestamp();
    await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'add') {
    const name = interaction.options.getString('name');
    const account = interaction.options.getString('account');

    // Check if the product exists
    if (!store.products[name]) {
        await interaction.reply({ content: 'A product with that name does not exist.', ephemeral: true });
        return;
    }

    // Add the account to the product
    store.products[name].accounts.push(account);

    // Save the updated store data
    fs.writeFileSync(storeFile, JSON.stringify(store, null, 2));

    const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle(`Account Added to Product! 🎉`)
        .setDescription(`Product name: ${name}\nAccount added: ${account}`)
        .setTimestamp();
    await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'delete') {
        const name = interaction.options.getString('name');

        // Check if the product exists
        if (!store.products[name]) {
            await interaction.reply({ content: 'A product with that name does not exist.', ephemeral: true });
            return;
        }

        // Delete the product
        delete store.products[name];

        // Save the updated store data
        fs.writeFileSync(storeFile, JSON.stringify(store, null, 2));

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle(`Product Deleted! 🎉`)
            .setDescription(`Product name: ${name}`)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
        }
    },
};
