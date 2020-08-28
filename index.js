const path = require('path');

if(process.env.NODE_ENV !== 'production') {
    console.log("Hello")
    require('dotenv').config({path: path.resolve(__dirname, '.env')});
}

const wilbur = require('./src/wilbur/wilburCardCreator')
const dilbert = require('./src/dilbert/dilbert')
const trello = require('./src/trello/trello')
const weather = require('./src/weather/weather')

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
            trello.getInProgress(sendMessage)
        }
    }

    if(lowerCaseMessage === '/wilbur') {
        wilbur.createWilburCard(sendMessage);
    }
    
    if(lowerCaseMessage === '/dilbert') {
        dilbert.getDilbertStrip(sendMessage);
    }

    if(lowerCaseMessage === '/echo') {
        message.channel.send('ECHO');
        message.channel.send('ECHo');
        message.channel.send('ECho');
        message.channel.send('Echo');
        message.channel.send('echo');
    }

    if(lowerCaseMessage.includes('weather')) {
        if(lowerCaseMessage === '/weather') {
            sendMessage("Please specify more either a city or latitude and longitude for example:");
            sendMessage("/weather Carlisle");
            sendMessage("/weather 54.476422 -3.042244");
        } else {
            var splitMessage = lowerCaseMessage.split(' ');

            if (splitMessage.length === 3) {
                let lat = splitMessage[1];
                let lon = splitMessage[2];
                weather.getWeatherByLatLon(sendMessage, lat, lon);
            } else if (splitMessage.length === 2) {
                let cityName = splitMessage[1];
                weather.getWeatherByCity(sendMessage, cityName);
            }
        }
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
            trello.getInProgress(sendMessage)
        }
    }

    function sendMessage(data) {
        message.channel.send(data);
    }
});

