const { Wordle } = require('discord-gamecord')
const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('wordle')
    .setDescription('Play The Wordle Game !'),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const Game = new Wordle({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: "wordle",
                color: '#5865F2'
            },
            customWord: null,
            timeoutTime: 60000,
            winMessage: "** 🎉 You Won !  The Word Was {word} **",
            loseMessage: "** ❌ You Lost ! The Word Was {word} **",
            playerOnlyMessage: "Only {player} Can Use These Buttons ‼"
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        })
    }
}