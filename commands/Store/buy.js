const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Buy a product from the store.')
    .addStringOption(option =>
      option
        .setName('product')
        .setDescription('The name of the product you want to buy.')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('count')
        .setDescription('The number of products you want to buy.')
        .setRequired(true)
        .setMinValue(1)
    ),

  async execute(interaction) {
    const guildId = interaction.guildId;
    const userId = interaction.user.id;

    const filePath = path.join(__dirname, `./stores/${guildId}.json`);
    if (!fs.existsSync(filePath)){
      await interaction.reply({ content: 'This server does not have a store yet.', ephemeral: true });
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const productName = interaction.options.getString('product');
    const productCount = interaction.options.getInteger('count');

    const product = data.products[productName];

    if (!product) {
      return await interaction.reply({ content: `${productName} is not available...`, ephemeral: true });
    }

    if (productCount > product.accounts.length) {
      return await interaction.reply({ content: `There are only ${product.accounts.length.toString()} ${productName}(s) left in the stock.`, ephemeral: true });
    }

    const totalPrice = product.price * productCount;
    const finalPrice = Math.floor(totalPrice * 20 / 19);
    const buyer = interaction.user;
    const creditsFilePath = path.join(__dirname, '../../JSON/credits.json');
    const credits = JSON.parse(fs.readFileSync(creditsFilePath, 'utf-8'));

    if (finalPrice > credits[buyer.id]) {
      await interaction.reply(`You don't have sufficient credits ❌.`);
    }

    const confirmationEmbed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('Confirm Purchase')
      .setDescription(`> **Are you sure you want to purchase ${productCount} ${productName}(s) for ${finalPrice} credits 💰?**\n\n> **React with  ✅ / ❌ to confirm or cancel the purshase**\n\n> **You have 1 minute to decide 🔮!**\n\n> **📢 If you accept the amount of credits will be subtracted from your zixel coins balance .**`);

    const confirmationMessage = await interaction.reply({ embeds: [confirmationEmbed], fetchReply: true });

    // Add reaction buttons to the confirmation message
    await confirmationMessage.react('✅'); // Yes
    await confirmationMessage.react('❌'); // No

    const filter = (reaction, user) => {
      // Only listen to reactions from the buyer
      return ['✅', '❌'].includes(reaction.emoji.name) && user.id === buyer.id;
    };

    const collector = confirmationMessage.createReactionCollector({
      filter,
      time: 60000, // 1 minute
      max: 1,
    });

    collector.on('end', async (reactions) => {
      if (reactions.size === 0) {
        return await interaction.editReply({ content: 'No confirmation received. Purchase cancelled.', ephemeral: true });
      }

      const confirmationResponse = reactions.first().emoji.name;

      if (confirmationResponse === '✅') {
        const purchasedAccounts = product.accounts.splice(0, productCount);
        credits[userId] -= finalPrice;
        credits[data.ownerId] += finalPrice;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        // Send a message to the buyer with their purchased accounts
        const mailEmbed = new EmbedBuilder()
        .setColor('Green')
        .setThumbnail(`${data.logoUrl}`)
        .setDescription(`> **Hello, here are your purshased ${productName}(s): **\n\n> \`\`\`${purchasedAccounts.join(`\n\n> `)}\`\`\``);
        await buyer.send({ embeds: [mailEmbed] });

        const purchaseEmbed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Purchase Successful ✅')
        .setDescription(`> **You have successfully purchased ${productCount} ${productName}(s) for ${finalPrice} credits ✅.**\n\n> **:bank: ${interaction.user.username}, your current balance is \`\`$${credits[interaction.user.id]}\`\`.**\n\n> **Check your DM for the account(s) you've purshased ! 📨**`);

        await interaction.editReply({ embeds: [purchaseEmbed] });

      } else {

        const cancelled = new EmbedBuilder()
        .setColor('Red')
        .setThumbnail(`${data.logoUrl}`)
        .setDescription(`> **Operation Canceled ❌**\n\n> **You've passed the minute 🔺**`);

        await  interaction.editReply({ embeds: [cancelled] })


      }
    })
  }
}