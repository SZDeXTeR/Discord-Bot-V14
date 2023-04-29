const wait = require('node:timers/promises').setTimeout
const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick A Member")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) => option .setName('user') .setDescription('Select User') .setRequired(true) )
    .addStringOption((option) => option.setName('reason').setDescription('Enter the reason for the kick').setRequired(false)),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */

  async execute(interaction, client){
    try {
      await interaction.deferReply({ ephemeral: false })
      const user      = interaction.options.getUser("user");
      const reason    = interaction.options.getString("reason");
      const member    = await interaction.guild.members.fetch(user.id).catch(console.error);
      if(!member) return interaction.editReply(`⚠ | This member is not in your server `);
      if(member.user.id == interaction.user.id) return interaction.editReply(`**⚠ | You can't fire yourself **🤨`);
      if(member.user.id == client.user.id) return interaction.editReply(`**⚠ | You can't kick me **😂`);
      await interaction.editReply(`✈️ <@${member.id}> **has been succesfully kicked !**`);
      wait(3000);
      member.kick().catch(console.error);
    } catch (err) {
      await interaction.editReply(err.message);
      console.error(err)
    }
  },
};