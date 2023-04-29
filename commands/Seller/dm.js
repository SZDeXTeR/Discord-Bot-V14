const { EmbedBuilder , SlashCommandBuilder, Client, ChatInputCommandInteraction , PermissionsBitField, MessageActionRow , MessageButton } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName("dm")
    .setDescription("Send A Private Message To A Member")
    .addUserOption((option) => option .setName('user') .setDescription('Select User') .setRequired(true) )
    .addStringOption((option) => option.setName('message').setDescription('Enter the Message That You Want Send').setRequired(true)),

    async execute(interaction, client) {
    try {
      let user = interaction.options.getUser("user")
      let text = interaction.options.getString("message")
          interaction.reply(`
> **Done Send Private to ${user} ✅** 

> **Please Wait For Him To Read This Message ⏰**
`)
    user.send(`${text} \n\n **Sent From Here ${interaction.channel} ✨ \n\n **By ${user} 🎇**`)
      
} catch (err) {
      console.log(err)
  }
 }
}