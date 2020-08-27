const path = require('path');

if(process.env.NODE_ENV !== 'production') {
    console.log("Hello")
    require('dotenv').config({path: path.resolve(__dirname, '.env')});
}

const wilbur = require('./src/wilbur/wilburCardCreator')
const dilbert = require('./src/dilbert/dilbert')
const trello = require('./src/trello/trello')

console.log("Hi")

const Discord = require('discord.js');
const bot = new Discord.Client();

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);


bot.on('ready', () => {
    console.log(bot.user.tag);
});

bot.on('message', function(message) {
    
    let lowerCaseMessage = message.content.toLowerCase()
    
    if(message.author.id === bot.user.id) {
        return;
    }
    
    if(process.env.NODE_ENV !== 'production') {
        if(lowerCaseMessage.includes("update")) {
            trello.getInProgress(sendEmbedMessage)
        }
    }


    if(lowerCaseMessage === '/wilbur') {
        wilbur.createWilburCard(sendEmbedMessage);
    }
    
    if(lowerCaseMessage === '/dilbert') {
        dilbert.getDilbertStrip(sendEmbedMessage);
    }

    if(lowerCaseMessage === '/echo') {
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
    if(lowerCaseMessage.includes('joshua')) {
        message.channel.send('https://drive.google.com/file/d/1JQ3lYbHxGa-KbctUAtepN1R-rPA5fB9r/view?usp=sharing');
    }
    
    if(process.env.NODE_ENV === 'production') {
        if(lowerCaseMessage.includes("update") && message.channel.name === 'joshuas-updates') {
            trello.getInProgress(sendEmbedMessage)
        }
    }

    function sendEmbedMessage(data) {
        message.channel.send(data);
    }
});

