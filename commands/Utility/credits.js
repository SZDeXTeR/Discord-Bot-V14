const fs = require('fs');
const path = require('path');
const { ChatInputCommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const creditsFilePath = path.join(__dirname, '../../JSON/credits.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('credits')
    .setDescription('View or transfer your credits')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user you want to view or transfer credits')
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('The amount of credits you want to transfer')
        .setRequired(false)
    ),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @returns 
     */
  async execute(interaction) {
    const senderId = interaction.user.id;
    const recipient = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    const credits = JSON.parse(fs.readFileSync(creditsFilePath, 'utf-8'));

    if (!recipient && !amount) {
      const userCredits = credits[senderId] || 0;
      return interaction.reply(`**:bank: ${interaction.user.username}, your account balance is \`\`$${userCredits}\`\`.**`);
    }

    if (!recipient && amount) {
      const userCredits = credits[senderId] || 0;
      return interaction.reply(`**🎃 huh? | What are you doing ?**`);
    }

    if (!amount) {
      const userCredits = credits[recipient.id] || 0;
      return interaction.reply(`**:bank: ${recipient.username}, account's balance is \`\`$${userCredits}\`\`.**`);
    }

    if (senderId === recipient.id) {
      return interaction.reply('** :thinking: | You cannot transfer credits to yourself!**');
    }

    const senderCredits = credits[senderId] || 0;
    let recipientCredits = credits[recipient.id];
    if (!recipientCredits) recipientCredits = 0; // If recipient does not have an existing balance, set it to 0.
    if (senderCredits < amount) {
      return interaction.reply(`** :thinking: | ${interaction.user.username}, Your balance is not enough for that!**`);
    }
    const tax = Math.floor(amount * 0.1);
    const transferAmount = amount - tax;
    credits[senderId] -= amount;
    credits[recipient.id] = recipientCredits + transferAmount; // Add transfer amount to recipient's balance.
    fs.writeFileSync(creditsFilePath, JSON.stringify(credits, null, 2));

    return interaction.reply(
        `**:moneybag: | ${interaction.user.username}, has transferred \`$${transferAmount}\` to ${recipient}**`
    );
  },
};
