const { alignAuto } = require('ascii-table');
const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionsBitField, time } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutes A Sever Member')
    .addUserOption(option => option.setName('user').setDescription('The user you want to mute').setRequired(true))
    .addIntegerOption(option => option.setName('duration').setDescription('The duration of the mute (by minutes)').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for muting the user')),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     */ 

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member1 = await interaction.guild.members.fetch(user.id).catch(console.error);
        let duration = interaction.options.getInteger('duration');
        
        let reason = interaction.options.getString('reason');

        if (!reason) reason = 'No Reason Provided.'
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: 'You must to be a moderator to use this command', ephemeral: true });
        if (!member1) return await interaction.reply({ content: "The user mentioned in no longer within the server", ephemeral: true });
        if (!member1.kickable) return await interaction.reply({ content: 'I cannot  this member this is because his role or himself is above me', ephemeral: true })
        if (member1.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: 'I cannot mute a member with the admin permissions', ephemeral: true })

        

        const embed = new EmbedBuilder()
        .setTitle('Success ✅')
        .setColor('Green')
        .setDescription(`> :white_check_mark: ** ${user} has been mutes for ${duration} minute(s).**\n\n> **Reason: ${reason} **`);

        const dmEmbed = new EmbedBuilder()
        .setTitle('Warning ❗')
        .setColor('Red')
        .setDescription(`> :warning: ** You Have Been Muted In ${interaction.guild.name}.**\n\n> **Reason: ${reason} **`)

        await member1.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        })

        duration = duration * 60 * 1000;
        await member1.timeout(duration, reason);

        await interaction.reply({ embeds: [embed] })
    }   
}