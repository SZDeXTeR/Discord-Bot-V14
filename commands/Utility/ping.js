const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Your Current Ping !'),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
	async execute(interaction, client) {
		await interaction.reply(`**Pong! API Latency is ${Math.round(client.ws.ping)}ms 🛰️, Last heartbeat calculated ms${(Date.now() - client.ws.shards.first().lastPingTimestamp, { long: true })} ago**`)
	},
};