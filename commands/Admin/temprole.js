const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
let ms = require('ms');

module.exports = {
  data : new SlashCommandBuilder()
    .setName("temprole")
    .setDescription("To Give Someone A Temp Role")
    .addUserOption(option => 
       option
         .setName("user")          
         .setDescription("User To Give Him The Role")
         .setRequired(true))
    .addRoleOption(option => 
       option
         .setName("role")          
         .setDescription("Role To Give To The User")
         .setRequired(true))
    .addStringOption(option => 
       option
         .setName("time")          
         .setDescription("Time Of The Role")
         .setRequired(true)),


   async execute(interaction, client) {
    try {
      let user = interaction.options.getMember('user')
      let role = interaction.options.getRole("role")
      let time = interaction.options.getString("time")
      
       if (!interaction.member.permissions.has("ManageRoles")) return interaction.reply({content:`**😕 You don't have permission**`, ephemeral: true})
        if (user.id === interaction.user.id) return interaction.reply("You cannot give a rank to yourself")
        if (user.id === client.user.id) return interaction.reply("It is not possible to assign a rank to the bot")
     user.roles.add(role).catch(err => {
       interaction.reply({content: 'check my roles please !', ephemeral: true})
     })

     const addEmbed = new EmbedBuilder()
                    .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL() })
                    .setColor('Green')
                    .setDescription(`**Added ${role} to ${user} Successfully, For ${ms(ms(time))} ✅**`)
                    .setTimestamp();

      interaction.reply({ embeds: [addEmbed] });
        setTimeout(() => {
            user.roles.remove(role)
        }, ms(time))
} catch (err) {
      console.log(err)
  }
 }
}