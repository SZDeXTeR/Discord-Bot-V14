const { EmbedBuilder , SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionsBitField } = require('discord.js');
module.exports = {
 

  data: new SlashCommandBuilder()
    .setName("come")
    .setDescription("Notify A Member And Invite Him To The Channel")
    .addUserOption((option) => option .setName('user') .setDescription('Select A User') .setRequired(true) ),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
    try {
        const user = interaction.options.getUser("user");

        interaction.reply(`
> **Done Send Private to ${user} ✅** 

> **Please Wait ⏰** 
`)
    user.send(`> **Hello ${user},**
    
> **You've Been Invited To This Channel <#${interaction.channel.id}> ✨**

> **Come On Now 🎈**`)
      
} catch (err) {
      console.log(err)
  }
 }
}