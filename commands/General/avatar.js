const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Shows The Avatar Of A User")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user")
    ),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(interaction, client) {
    let user = interaction.options.getUser("user");

    if (!user) {
      user = interaction.user;
    }

    const avatarEmbed = new discord.EmbedBuilder()
      .setColor("#0155b6")
      .setTitle(`**${user.username}**\'s Avatar`)
      .setImage(
        `${user.displayAvatarURL({
          size: 256,
        })}`
      );

    const avatarRow = new discord.ActionRowBuilder().addComponents(
      new discord.ButtonBuilder()
        .setLabel("Avatar Link")
        .setStyle(discord.ButtonStyle.Link)
        .setURL(
          `${user.avatarURL({
            size: 256,
          })}`
        )
    );

    await interaction.reply({
      embeds: [avatarEmbed],
      components: [avatarRow],
    });
  },
};