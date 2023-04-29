const { REST, Routes, ApplicationCommandType, Collection, Events } = require('discord.js');
const { TOKEN } = require('../JSON/config.json');
const rest = new REST({version: '10'}).setToken(TOKEN);
const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const table = new ascii('Commands').setJustify();



module.exports = (client) => {
    client.commands = new Collection();
    const commands = [];
    readdirSync("./commands").forEach((folder) => {
        const commandFiles = readdirSync(`./commands/${folder}`).filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);

            if (command.name && command.description){
                commands.push({
                    type: ApplicationCommandType.ChatInput,
                    name: command.name,
                    description: command.description,
                    options: command.option || []

                })
                client.commands.set(command.name, command);
                table.addRow(`/${command.name}`, '🟢 Working !');
            }else if(command.data?.name && command.data?.description){
                commands.push(command.data.toJSON());
                client.commands.set(command.data.name, command);
                table.addRow(`/${command.data.name}`, '🟢 Working !');
            } else {
                table.addRow(file, '🔴 Not Working !');
            }
        }
    });
    
    console.log(table.toString());

    client.once(Events.ClientReady, async c => {
        try {
            console.log(`🟡 | Started refreshing ${commands.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationCommands(c.user.id),
                { body: commands },
            );

		console.log(`🟢 | Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })
}