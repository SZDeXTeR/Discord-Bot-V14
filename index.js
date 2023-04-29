const { Events, Client, IntentsBitField, AttachmentBuilder, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { TOKEN } = require("./JSON/config.json");
const dotenv = require('dotenv');
const MONGO_URL = "mongodb+srv://zixel:zixel@zixel.n3stgnt.mongodb.net/?retryWrites=true&w=majority";
const { readdirSync } = require('fs');
const { REST } = require('@discordjs/rest');
const { Player } = require('discord-player');
const fs = require('fs')
const path = require("path");

const client = new Client({
     intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildVoiceStates
    ]
});

const process = require('node:process');

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});



client.on("messageCreate", (msg) => {
    if (msg.content === `<@${client.user.id}>`) {
      let embed = new EmbedBuilder()
        .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() })
        .setDescription(`
        **Zixel makes things easier for you on your own private server**
                **➬  Use : /help**
                **➬ My Links :  **`)
        .setColor("#FF0000")
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setLabel(`Invite Me`)
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=1074083057650372789&permissions=8&scope=bot%20applications.commands`),
        new ButtonBuilder()
        .setLabel(`Support Server`)
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.gg/HJUYcxGBwN`),
  );
      msg.reply({ embeds: [embed], components: [row] });
    }
})


// welcome sys

const Canvas = require('canvas');

var welcomeCanvas = {};
    welcomeCanvas.create = Canvas.createCanvas(1024, 500)
    welcomeCanvas.context = welcomeCanvas.create.getContext('2d')
    welcomeCanvas.context.font = "72px sans-serif";
    welcomeCanvas.context.fillStyle = '#ffffff';

    Canvas.loadImage("./img/bg.jpeg").then(async (img) => {
        welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500)
    })


client.on('guildMemberAdd', async member => {

    let userData = {
        username: member.user.username,
        discriminator: member.user.discriminator,
        avatarURL: member.user.displayAvatarURL({ format: 'png' }),
        guildName: member.guild.name
      };

    
    welcomeCanvas.context.fillText('welcome', 360, 360)
    welcomeCanvas.context.beginPath()
    welcomeCanvas.context.arc(512, 166, 128, 0, Math.PI * 2, true)
    welcomeCanvas.context.stroke()
    welcomeCanvas.context.fill()

    const guildId = member.guild.id;
    const filePath = path.join(__dirname, `./JSON/Welcome/welcome-${guildId}.json`);
  
    if (!fs.existsSync(filePath)) {
      return;
    }
  
    const welcomeData = JSON.parse(fs.readFileSync(filePath));
  
    if (!welcomeData.enabled) {
      return;
    }
  
    let canvas = welcomeCanvas;
    canvas.context.font = '42px sans-serif'
    canvas.context.textAlign = 'center';
    canvas.context.fillText(member.user.tag.toUpperCase(), 512, 410)
    canvas.context.font = '32px sans-serif'
    canvas.context.fillText(`You are the ${member.guild.memberCount}th`, 512, 455)
    canvas.context.beginPath()
    canvas.context.arc(512, 166, 119, 0, Math.PI * 2, true)
    canvas.context.closePath()
    canvas.context.clip()
    console.log('avatar hash: ' + member.user.avatarURL({ format: 'png' }))
    await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .then(img => {
        canvas.context.drawImage(img, 393, 47, 238, 238);
    }).catch((err) => {
        Canvas.loadImage('./img/discord.png').then((img) => {
            canvas.context.drawImage(img, 393, 47, 238, 238)
        }).catch((err) => {
            console.log(err)
        })
    })
    

    const attachment = new AttachmentBuilder(canvas.create.toBuffer(), `welcome-${member.id}.png`);

    
    const channel = member.guild.channels.cache.get(welcomeData.channelId);
    if (channel) {
      channel.send({ files: [attachment] });
    }

  });


const afkSchema = require('./schemas/afkSchema');

client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;

    const check = await afkSchema.findOne({ GuildID: message.guild.id, User: message.author.id });

    if (check) {
        const nick = check.Nickname;

        await afkSchema.deleteMany({ GuildID: message.guild.id, User: message.author.id })
        await message.member.setNickname(`${nick}`).catch(err => {
            return;
        })
        const m1 = await message.reply({ content: `** Welcome Back ${message.author}, I've Removed Your AFK** `, ephemeral: true });
        setTimeout(() => {
            m1.delete();
        }, 4000)
    }else {
        const members = message.mentions.users.first();
        
        if (!members) return;
        const Data = await afkSchema.findOne({ GuildID: message.guild.id, User: members.id });
        if (!Data) return;

        const member = message.guild.members.cache.get(members.id);
        const asg = Data.Message || 'No Reason Provided';
        
        if (message.content.includes(members)) {
            const m = await message.reply({ content: `**${member.user.username} Is Currently AFK, Dont Tag Please \n\n Reason: ${asg}**` });
            setTimeout(() => {
                m.delete();
                message.delete();
            }, 4000)
        }
    }
})

readdirSync('./handlers').forEach(handler => {
    require(`./handlers/${handler}`)(client);
});


module.exports = client;

client.login(TOKEN);
