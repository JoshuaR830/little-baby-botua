const path = require('path');
const https = require('https');
const {v4: uuidv4} = require('uuid')

if(process.env.NODE_ENV !== 'production') {
    console.log("Hi there")
    require('dotenv').config({path: path.resolve(__dirname, '.env')});
}

const wilbur = require('./src/wilbur/wilburCardCreator')
const dilbert = require('./src/dilbert/dilbert')
const trello = require('./src/trello/trello')
const weather = require('./src/weather/weather')
const cat = require('./src/cats/cat')
const friendApi = require('./src/friends/friends')
const Friend = require('./src/friends/friend.js')
const timeGraph = require('./src/graphs/time')
const Commands = require('./src/commands')

const Discord = require('discord.js');
const { cwd } = require('process');
const bot = new Discord.Client();

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

friendsMap = new Map();

jordanDiscordId = process.env.JordanId;
joshuaDiscordId = process.env.JoshuaId;
dayleDiscordId = process.env.DayleId;
declynDiscordId = process.env.DeclynId;
jonnyDiscordId = process.env.JonnyId;
lucasDiscordId = process.env.LucasId;
callanDiscordId = process.env.CallanId;
andrewDiscordId = process.env.AndrewId;
martinDiscordId = process.env.MartinId;

const timeApiGatewayBaseUrl = 'https://a6bvqaoebf.execute-api.eu-west-2.amazonaws.com/v0/time';
// const url = `${wilburApiGatewayBaseUrl}?id=timestamp=channelId=connectionStatus=`;


theRoomChannelId = process.env.TheRoomChannelId;

const directMessagesToSend = [joshuaDiscordId]

var connectedIds = []

bot.on('ready', () => {
    console.log("Yarr!!")
    console.log(bot.user.tag);
    // ToDo - fix this
    // sendUpdateMessage()
});

function sendUpdateMessage() {
    directMessagesToSend.forEach(function(id) {
        bot.users.cache.get(id).send("New version of Little Baby Botua ready to roll");
    })
}


bot.on('voiceStateUpdate', (oldMember, newMember) => {
    console.log(newMember)

    // An existing user mutes and deafens
    if(newMember.channelID != null && oldMember.channelID != null) {
        return;
    }

    let name = whoIs(newMember.id)

    // A new user joins
    if(newMember.channelID !== null && newMember.channelID !== undefined) {

        if (name != null) {
            let friend = new Friend(uuidv4(), name, newMember.channelID, newMember.guild.id)
            friendsMap.set(newMember.id, friend)
            // friendsList.push({key: newMember.id, value: friend})

            console.log(friendsMap);

            sendJoinedDirectMessage(name);
            sendHttpRequestToLambda(newMember.id, Date.now(), newMember.guild.id, newMember.channel.id, true)
        }

        // if(newMember.id === joshuaDiscordId) {
            // console.log("Hello Joshua");
            // testChannel = bot.channels.cache.get('746048828368617501');
            // testChannel.send('@here :rotating_light: Breaking News! :rotating_light: Joshua :AndyT: has joined the voice :mega: channel!');
            // testChannel.send(':tada: Hello Joshua :tada:');
            
            // time joined
        // }

        if(newMember.id === andrewDiscordId) {
            console.log("Hello Andrew");
            theRoomChannel = bot.channels.cache.get(theRoomChannelId);
            theRoomChannel.send('@here :rotating_light: Breaking News! :rotating_light: Andrew has joined the voice :mega: channel!');
            theRoomChannel.send(':tada: Hello Andrew! :tada:');
            bot.users.cache.get(joshuaDiscordId).send("Andrew joined the channel");
        }
    }
    else if (newMember.channelID === null || newMember.channelID === undefined) {
        let name = whoIs(newMember.id)

        if (name != null) {
            sendDisconnectedDirectMessage(name);

            console.log(friendsMap.get(newMember.id));

            leaver = friendsMap.get(newMember.id);

            sendHttpRequestToLambda(newMember.id, Date.now(), leaver.serverId, leaver.channelId, false)
        }
    }

    function whoIs(id) {
        switch(id) {
            case jordanDiscordId:
                return "Jordan"
            case joshuaDiscordId:
                return "Joshua"
            case dayleDiscordId:
                return "Dayle"
            case declynDiscordId:
                return "Madalyn"
            case jonnyDiscordId:
                return "Jonny"
            case lucasDiscordId:
                return "Lucas"
            case callanDiscordId:
                return "Callan"
            case martinDiscordId:
                return "Martin"
            case andrewDiscordId:
                return "Andrew"
            default:
                return null;
        }
    }

    function sendJoinedDirectMessage(name) {
        directMessagesToSend.forEach(function(id) {
            console.log(id)
            bot.users.cache.get(id).send(`${name} joined a voice channel`);
        })
    }

    function sendDisconnectedDirectMessage(name) {
        directMessagesToSend.forEach(function(id) {
            console.log(id)
            bot.users.cache.get(id).send(`${name} left a voice channel`);
        })
    }
})


bot.on('message', function(message) {
    let lowerCaseMessage = message.content.toLowerCase()

    if(message.author.id === bot.user.id) {
        return;
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

    if (lowerCaseMessage === "/time") {
        timeGraph.getTimeGraph(sendMessage);
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

    allowedChannels = ['joshuas-updates', 'meme-spam']

    // Don't send the following messages if in a forbidden channel
    if (!allowedChannels.includes(message.channel.name)) {
        return;
    }

    if(lowerCaseMessage.includes("jordan")) {
        friendApi.getJordan(sendMessage)
    }
    
    // Server specific magic
    if(lowerCaseMessage.includes('joshua')) {
        message.channel.send('https://drive.google.com/file/d/1JQ3lYbHxGa-KbctUAtepN1R-rPA5fB9r/view?usp=sharing');
    }
    
    // if(process.env.NODE_ENV === 'production') {
    //     if(lowerCaseMessage.includes("update") && message.channel.name === 'joshuas-updates') {
    //         trello.getInProgress(sendMessage)
    //     }
    // }

    function sendMessage(data) {
        message.channel.send(data);
    }
});

function sendHttpRequestToLambda(userId, timestamp, serverId, channelId, connectionStatus) {
    const url = `${timeApiGatewayBaseUrl}?userId=${userId}&timestamp=${timestamp}&serverId=${serverId}&channelId=${channelId}&connectionStatus=${connectionStatus}`;
    https.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () =>{ 

            // var parsed = JSON.parse(data);

            console.log(data);
        })
    }).on('error', (error) => {
        console.log(`Something went wrong: ${error}`);
    });
}

