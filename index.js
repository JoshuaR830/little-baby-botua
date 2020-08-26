const path = require('path');

if(process.env.NODE_ENV !== 'production') {
    console.log("Hello")
    require('dotenv').config({path: path.resolve(__dirname, '.env')});
}

const wilbur = require('./src/wilbur/wilburCardCreator')
const dilbert = require('./src/dilbert/dilbert')

console.log("Hi")

const Discord = require('discord.js');
const bot = new Discord.Client();

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);


bot.on('ready', () => {
    console.log(bot.user.tag);
});

bot.on('message', function(message) {

    if(message.author.id === bot.user.id) {
        return;
    }

    if(message.content.toLowerCase() === '/wilbur') {
        wilbur.createWilburCard(sendEmbedMessage);
    }
    
    if(message.content.toLowerCase() === '/dilbert') {
        dilbert.getDilbertStrip(sendEmbedMessage);
    }

    if(message.content.toLowerCase() === '/echo') {
        message.channel.send('ECHO');
        message.channel.send('ECHo');
        message.channel.send('ECho');
        message.channel.send('Echo');
        message.channel.send('echo');
    }

    if(message.guild.id !== "329759300526407680") {
        return;
    }

    // Server specific magic
    if(message.content.toLowerCase().includes('joshua')) {
        message.channel.send('https://drive.google.com/file/d/1JQ3lYbHxGa-KbctUAtepN1R-rPA5fB9r/view?usp=sharing');
    }
    
    function sendEmbedMessage(data) {
        message.channel.send(data);
    }
});

