const { EmbedBuilder, Client, SlashCommandBuilder, ChatInputCommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, SelectMenuBuilder, ButtonStyle, AttachmentBuilder, GuildTemplate, PermissionsBitField, Component } = require('discord.js');
const SnakeGame = require('snakecord');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('snake')
    .setDescription('Play The Snake Game !'),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction, client) {
        const snakeGame = new SnakeGame({
            title: 'Snake Game',
            color: 'GREEN',
            timestamp: false,
            gameOverTitle: 'Game Over !'
        })

        return snakeGame.newGame(interaction)
    }
}