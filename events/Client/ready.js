const { Events, Client } = require('discord.js');
const mongoose = require('mongoose');
const MONGO_URL = "mongodb+srv://zixel:zixel@zixel.n3stgnt.mongodb.net/?retryWrites=true&w=majority";
const { GiveawaysManager } = require('discord-giveaways');

module.exports = {
	name: Events.ClientReady,
	once: true,

	/**
	 * @param {Client} client 
	 */

	async execute(client) {
		let acti = ['By DeXTeR','/help',`Active In ${client.guilds.cache.size} Servers.`];

		client.user.setStatus('idle');
		client.user.setActivity('By DeXTeR');

		console.log('🟢 | Ready !')
		console.log(`🟢 | Logged in as ${client.user.tag}`);

		if (!MONGO_URL) return await console.log('No MONGO URL Provided !');

		await mongoose.connect(MONGO_URL || '', {
			keepAlive: true,
			useNewUrlParser: true,
			useUnifiedTopology: true
		})

		if (mongoose.connect) {
			console.log('🟢 | Connected To The Database !')
		}


	},
};
