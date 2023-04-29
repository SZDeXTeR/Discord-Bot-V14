const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const afkSchema = require('../../schemas/afkSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Manage AFK Status In Current Server !')
    .addSubcommand(command => command.setName('set').setDescription('Activate The AFK Mode').addStringOption(option => option.setName('reason').setDescription('Reason For Activating The AFK Mode').setRequired(false)))
    .addSubcommand(command => command.setName('remove').setDescription('Disactivate The AFK Mode').addStringOption(option => option.setName('reason').setDescription('Reason For Disactivating The AFK Mode').setRequired(false))),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        const { options } = interaction;
        const sub = options.getSubcommand();

        const Data = await afkSchema.findOne({ GuildID: interaction.guild.id, User: interaction.user.id })

        switch (sub) {
            case 'set':
            if (Data) return await interaction.reply({ content: "You Are Already Activated The AFK Mode", ephemeral: true })
            else {
                const message = options.getString('reason');
                const nickname = interaction.member.nickname || interaction.user.username;

                await afkSchema.create({
                    User: interaction.user.id,
                    GuildID: interaction.guild.id,
                    Message: message,
                    Nickname: nickname,
                })

                const name = `[AFK] ${nickname}`

                await interaction.member.setNickname(`${name}`).catch(err => {
                    return;
                })

                const embed = new EmbedBuilder()
                .setColor('Blue')
                .setDescription('** :white_check_mark: You Are Now AFK Within This Server !  Send A Message Or Use `/afk remove` To Desactivate It **')

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
                break;
        
            case 'remove':
            if (!Data) return await interaction.reply({ content: "You Are Not AFK Within This Server !", ephemeral: true });
            else {
                const nick = Data.Nickname;
                await afkSchema.deleteMany({ GuildID: interaction.guild.id, User: interaction.user.id,  });

                await interaction.member.setNickname(`${nick}`).catch(err => {
                    return;
                })

                const embed = new EmbedBuilder()
                .setColor('Blue')
                .setDescription('** :white_check_mark: Your AFK Has Been Removed Within This Server ! **');

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    }
}