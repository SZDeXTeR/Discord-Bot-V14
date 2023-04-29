const { SlashCommandBuilder } = require("discord.js");

// Store the active broadcasts in a Map
const activeBroadcasts = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('broadcast')
        .setDescription('Send a message to all server members')
        .addStringOption(option =>
            option
                .setName('message')
                .setDescription('Enter your message')
                .setRequired(true)),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        if (interaction.user.id !== interaction.guild.ownerId) return await interaction.reply('you are not allowed to use this command !')
        // Check if there's an active broadcast in the same server
        const serverId = interaction.guildId;
        if (activeBroadcasts.has(serverId)) {
            const remainingTime = activeBroadcasts.get(serverId);
            return interaction.reply({ content: `❌ A broadcast is already running in this server. Please wait ${remainingTime} seconds before running this command again.`, ephemeral: true });
        }

        // Set a 5 minute cooldown for the same server
        activeBroadcasts.set(serverId, 300);

        const message = interaction.options.getString('message');
        const members = await interaction.guild.members.fetch();
        let errorCount = 0;

        members.forEach((member, index) => {
            if (member.user.bot) return;

            setTimeout(() => {
                member.send({ content: `${message}\n\n${member}` })
                    .then(() => {
                        console.log(`🟢 | ${member.user.tag} has received the message`);
                    })
                    .catch((error) => {
                        console.error(`🔴 | ${member.user.tag} did not receive the message:`, error);
                        errorCount++;
                    });
            }, index * 500); // Delay by 0.5 seconds per member
        });

        const replyMessage = errorCount === 0
            ? `✅ Message sent to all members successfully.`
            : `⚠️ Some members did not receive the message. ${errorCount} errors occurred.`;

        interaction.reply({ content: replyMessage, ephemeral: true });

        // Remove the server from the active broadcasts map after 5 minutes
        setTimeout(() => {
            activeBroadcasts.delete(serverId);
        }, 300000);
    }
};
