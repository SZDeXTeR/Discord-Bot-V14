const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');
const { Configuration, OpenAIApi  } = require('openai');
const openai_api = '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';

const configuration = new Configuration({
    apiKey: openai_api
})

const openai = new OpenAIApi(configuration)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask-gpt')
        .setDescription('ask Chat-GPT a question !')
        .addStringOption((option) => option.setName('question').setDescription('the question that you want to ask !').setRequired(true)),

        /**
         * 
         * @param {ChatInputCommandInteraction} interaction 
         */

        async execute(interaction) {
            try {
                const question = interaction.options.getString('question');

                await interaction.channel.sendTyping() // Bot Will Start Typing
                
                const response = await openai.createChatCompletion({
                    model: 'gpt-3.5-turbo',
                    messages: [{ content: question }]
                })

                const reply = response.data.choices[0].message
                if (reply.length > 4000) return interaction.reply({ content: 'The reply of your question is too long !', ephemeral: true });

                await interaction.reply(reply);

            } catch (error) { // If Any Errors
                if (error.response) {
                    console.log(error.response.status)
                    console.log(error.response.data)
                    return
                } else {
                    return console.log(error.message)
                }
            }
        }
}