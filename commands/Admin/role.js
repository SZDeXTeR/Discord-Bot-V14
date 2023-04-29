const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction } = require('discord.js');
const { trusted } = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder().setName('role').setDescription('Manage User Roles').setDefaultMemberPermissions(PermissionFlagsBits.Administrator).addSubcommand(subcommand => subcommand.setName("add").setDescription('Add A Role To A Specific User.').addUserOption(option => option.setName('user').setDescription('User To Add The Role To').setRequired(true)).addRoleOption(option => option.setName('role').setDescription('role To Add To The User').setRequired(true))).addSubcommand(subcommand => subcommand.setName("remove").setDescription('Remove A Role From A Specific User.').addUserOption(option => option.setName('user').setDescription('User To Remove The Role From').setRequired(true)).addRoleOption(option => option.setName('role').setDescription('role To Add To The User').setRequired(true))),
    


    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        const { options } = interaction;

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: "You don't have permissions to use this command", ephemeral: true, })

        const subcommand = options.getSubcommand();
        const user = options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id);
        const role = options.getRole('role');

        try {

            switch (subcommand) {
                case "add":
                    const addEmbed = new EmbedBuilder()
                    .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL() })
                    .setDescription(`**Added ${role} to ${user} Successfully ✅**`)
                    .setColor('Green')
                    .setTimestamp();

                    await member.roles.add(role);
                    await interaction.reply({ embeds: [addEmbed] }).catch(err => {
                        console.log(err);
                    });
                break;

                case "remove":
                    const removeEmbed = new EmbedBuilder()
                    .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL() })
                    .setDescription(`**Removed ${role} From ${user} Successfully ✅**`)
                    .setColor('Green')
                    .setTimestamp();

                    await member.roles.remove(role);
                    await interaction.reply({ embeds: [removeEmbed] }).catch(err => {
                        console.log(err);
                    });
                break;
            }

        } catch (err) {
            console.log(err);
            return interaction.reply({ content: "Something went wrong !", ephemeral: true });
        }

    }
}