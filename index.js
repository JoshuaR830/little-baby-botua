const path = require('path');

if(process.env.NODE_ENV !== 'production') {
    console.log("Hi there")
    require('dotenv').config({path: path.resolve(__dirname, '.env')});
}

const wilbur = require('./src/wilbur/wilburCardCreator')
const dilbert = require('./src/dilbert/dilbert')
const trello = require('./src/trello/trello')
const weather = require('./src/weather/weather')
const cat = require('./src/cats/cat')
const friend = require('./src/friends/friends')
const Commands = require('./src/commands')

const Discord = require('discord.js');
const bot = new Discord.Client();

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

jordanDiscordId = process.env.JordanId;
joshuaDiscordId = process.env.JoshuaId;
dayleDiscordId = process.env.DayleId;
declynDiscordId = process.env.DeclynId;
jonnyDiscordId = process.env.JonnyId;
lucasDiscordId = process.env.LucasId;
callanDiscordId = process.env.CallanId;
andrewDiscordId = process.env.AndrewId;
martinDiscordId = process.env.MartinId;

theRoomChannelId = process.env.TheRoomChannelId;

const directMessagesToSend = [joshuaDiscordId]

bot.on('ready', () => {
    console.log("Yarr!!")
    console.log(bot.user.tag);
});


bot.on('voiceStateUpdate', (oldMember, newMember) => {
    console.log("Hi")
    if(process.env.NODE_ENV !== 'production') {
        console.log("Hello")
    }

    if(newMember.channelID != null && newMember.channelID != undefined){
        if(newMember.id === joshuaDiscordId) {
            console.log("Hello Joshua");
            // testChannel = bot.channels.cache.get('746048828368617501');
            // testChannel.send('@here :rotating_light: Breaking News! :rotating_light: Joshua :AndyT: has joined the voice :mega: channel!');
            // testChannel.send(':tada: Hello Joshua :tada:');
            sendJoinedDirectMessage("Joshua")
        }
        
        if(newMember.id === jordanDiscordId) {
            sendJoinedDirectMessage("Jordan");
        }
        if(newMember.id === dayleDiscordId) {
            sendJoinedDirectMessage("Dayle");
        }
        if(newMember.id === declynDiscordId) {
            sendJoinedDirectMessage("Declyn");
        }
        if(newMember.id === jonnyDiscordId) {
            sendJoinedDirectMessage("Jonny");
        }
        if(newMember.id === lucasDiscordId) {
            sendJoinedDirectMessage("Lucas");
        }
        if(newMember.id === callanDiscordId) {
            sendJoinedDirectMessage("Callan");
        }
        if(newMember.id === martinDiscordId) {
            sendJoinedDirectMessage("Martin");
        }
        
        if(newMember.id === andrewDiscordId) {
            console.log("Hello Andrew");
            theRoomChannel = bot.channels.cache.get(theRoomChannelId);
            theRoomChannel.send('@here :rotating_light: Breaking News! :rotating_light: Andrew has joined the voice :mega: channel!');
            theRoomChannel.send(':tada: Hello Andrew! :tada:');
            bot.users.cache.get(joshuaDiscordId).send("Andrew joined the channel");
        }
    }

    function sendJoinedDirectMessage(name) {
        directMessagesToSend.forEach(function(id) {
            console.log(id)
            bot.users.cache.get(id).send(`${name} joined a voice channel`);
        })
    }  
})


bot.on('message', function(message) {
    let lowerCaseMessage = message.content.toLowerCase()

    if(message.author.id === bot.user.id) {
        return;
    }
    
    if(process.env.NODE_ENV !== 'production') {
        if(lowerCaseMessage.includes("update")) {
            trello.getInProgress(sendMessage)           
        }

        if(lowerCaseMessage.includes("jordan")) {
            friend.getJordan(sendMessage)
        }
    }

    if(lowerCaseMessage === '/help') {
        let supportedCommands = [
            new Commands('/cat', 'Get a random cat picture'),
            new Commands('/wilbur', 'Get a random picture of Wilbur'),
            new Commands('/dilbert', 'Get the daily Dilbert photo'),
            new Commands('/echo', 'Something silly and meaningless'),
            new Commands('/weather <City>', 'Get the weather for a specified city'),
            new Commands('/weather <latitude> <longitude>', 'Get the weather at a specific latitude and longitude')
        ]
                
        if(message.guild.id === "329759300526407680") {     
            supportedCommands.push(new Commands('/joshua', 'Get the little baby Joshua video'));
            supportedCommands.push(new Commands('/update', `Get an update about Joshua's current work in progress from Trello`));
        }
        
        let helpMessage = "Here is a list of commands:\n";
        supportedCommands.forEach(function(command) {
            helpMessage += `${command.command} : ${command.description}\n`;
        });

        sendMessage(helpMessage)        
    }

    if(lowerCaseMessage === '/wilbur') {
        wilbur.createWilburCard(sendMessage);
    }
    
    if(lowerCaseMessage === '/dilbert') {
        dilbert.getDilbertStrip(sendMessage);
    }
    
    if(lowerCaseMessage === '/cat') {
        cat.getRandomCatImage(sendMessage);
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

    if(lowerCaseMessage.includes("jordan")) {
        friend.getJordan(sendMessage)
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

