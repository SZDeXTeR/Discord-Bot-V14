const { SlashCommandBuilder } = require("@discordjs/builders")
const { Permissions, EmbedBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans A Specified Discord User")
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("The user to be banned")
            .setRequired(true)),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */

     async execute(interaction, client) {
        const user = interaction.options.getUser("user");
      
        if(!interaction.guild) return interaction.reply({ content: "an error was occured !", ephemeral: true, });
        const member = await interaction.guild.members.fetch(interaction.user.id);
        if(!member.permissions.has([PermissionFlagsBits.BanMembers])) return interaction.reply({ content: "You don't have permisssions to use this command", ephemeral: true });
      const embed_success = new EmbedBuilder()
                                        .setTitle('Success ✅')
                                        .setDescription(`✈ ${user} has been banned succesfully ✅`)
                                        .setColor('#82db5c')
                                        .setTimestamp()

                                        const dmMail = new EmbedBuilder()
                                        .setTitle('Oh, no ! ❌')
                                        .setDescription(`✈ You've been banned from ${interaction.guild.name} !`)
                                        .setColor('Red')
                                        .setTimestamp()
                                    
        user.send({ embeds: [dmMail] });
        
        await interaction.guild.bans.create(user)
          .then(interaction.reply({ embeds: [embed_success] }))
          .catch(() => interaction.reply({ content: "an error was occured !", ephemeral: true, }))
    }
}