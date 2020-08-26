const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

const wilbur = require('./wilbur/wilburCardCreator')
const dilbert = require('./dilbert/dilbert')

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

    if(!message.channel.name.contains('meme') || !message.channel.name.contains('joshua')) {
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

