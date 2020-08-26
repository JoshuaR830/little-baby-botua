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
    
    function sendEmbedMessage(data) {
        message.channel.send(data);
    }
});

