const { alignAuto } = require('ascii-table');
const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove unmute From A Sever Member')
    .addUserOption(option => option.setName('user').setDescription('The user you want to unmute').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for the unmute')),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     */ 

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member1 = await interaction.guild.members.fetch(user.id);
        let reason = interaction.options.getString('reason');

        if (!reason) reason = ("No Reason Provided.")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: "You must to be a moderator to use this command !", ephemeral: true });
        if (!member1) return await interaction.reply({ content: "The user mentioned in no longer within the server", ephemeral: true });
        if (!member1.kickable) return await interaction.reply({ content: "I cannot unmute this member this is because his role or himself is above me !", ephemeral: true })
        if (member1.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: "I cannot unmute a member with the admin permissions !", ephemeral: true })

        

        const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Success ✅')
        .setDescription(`> :white_check_mark: ** ${user}'s Mute had been removed.**\n\n> **Reason: ${reason} **`);

        const dmEmbed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Warning ❗')
        .setDescription(`> :warning: ** Your Mute In ${interaction.guild.name} Has Been Removed.**\n\n> **Reason: ${reason} **`)

        await member1.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        })

        await member1.timeout(null, reason);

        await interaction.reply({ embeds: [embed] })
    }   
}