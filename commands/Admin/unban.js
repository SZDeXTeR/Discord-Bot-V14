const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits, Client, EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans a specified Discord user")
    .addStringOption((option) =>
      option
        .setName("user")
        .setDescription("The user to be unbanned")
        .setRequired(true)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const user = interaction.options.getString("user");
    const embed_unex_error = new EmbedBuilder()
      .setTitle("Warning: There has been an unexpected error while executing the command")
      .setColor("#b03350")
      .setTimestamp();
    const embed_permission_error = new EmbedBuilder()
      .setTitle("You don't have permissions to execute that command")
      .setDescription("Please check your role permissions")
      .setColor("#b03350")
      .setTimestamp();
    if (!interaction.guild)
      return interaction.reply({ embeds: [embed_unex_error] });
    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (!member.permissions.has(PermissionFlagsBits.BanMembers))
      return interaction.reply({ embeds: [embed_permission_error] });
    const embed_success = new EmbedBuilder()
      .setTitle("Success ✅")
      .setDescription(`🛬 <@${user}> has been unbanned successfully ✅`)
      .setColor("#82db5c")
      .setTimestamp();
      
    try {
      await interaction.guild.members.unban(user);
      interaction.reply({ embeds: [embed_success] });
    } catch (error) {
      interaction.reply({
        embeds: [embed_unex_error],
        ephemeral: true,
      });
    }
  },
};
