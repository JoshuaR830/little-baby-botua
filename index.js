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
const commandManager = require('./src/commands/register-commands')
const responseManager = require('./src/commands/command-response')

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
theRoomGuildId = process.env.TheRoomGuildId;

const timeApiGatewayBaseUrl = 'https://a6bvqaoebf.execute-api.eu-west-2.amazonaws.com/v0/time';
// const url = `${wilburApiGatewayBaseUrl}?id=timestamp=channelId=connectionStatus=`;



theRoomChannelId = process.env.TheRoomChannelId;

const directMessagesToSend = [joshuaDiscordId]

var connectedIds = []

bot.on('ready', () => {
    commandManager.registerCommands(bot, theRoomGuildId)
});

bot.ws.on('INTERACTION_CREATE', async interaction => {
    responseManager.manageResponse(bot, interaction);
})

function calculateIsAfk(channelName) {
    if (channelName.toLowerCase().includes("afk")) {
        return true;
    }

    return false;
}

bot.on('voiceStateUpdate', (oldMember, newMember) => {
    console.log(newMember)

    // Set default values so variable exists
    let isAfk = false;
    let isMuted = false;
    let isDeafened =false;
    let isVideoOn = false;
    let isStreaming = false;
    let channelName = "";

    // Set actual values if someone joins
    if (newMember.channelID != null) {
        isAfk = calculateIsAfk(newMember.channel.name);
        isMuted = newMember.selfMute || newMember.serverMute;
        isDeafened = newMember.selfDeaf || newMember.serverDeaf;
        isVideoOn = newMember.selfVideo;
        isStreaming = newMember.streaming;
        channelName = newMember.channel.name;
    }

    // An existing user mutes and deafens or changes channel
    if(newMember.channelID != null && oldMember.channelID != null) {
        console.log(`Channel name ${channelName}`)
        console.log(`Streaming ${isStreaming}`)
        console.log(`Video ${isVideoOn}`)
        console.log(`Muted ${isMuted}`)
        console.log(`Deafened ${isDeafened}`)
        console.log(`Afk ${isAfk}`)

        let name = whoIs(newMember.id)

        if (name != null) {

            // End the old session
            if(friendsMap.has(newMember.id)) {
                console.log(friendsMap.get(newMember.id));
                leaver = friendsMap.get(newMember.id);
                // Send disconnection time
                sendHttpRequestToLambda(leaver.sessionGuid, newMember.id, Date.now(), leaver.serverId, leaver.channelId, false, channelName, isStreaming, isVideoOn, isMuted, isDeafened, isAfk)
                friendsMap.delete(newMember.id)
            }

            // Create new session
            let friend = new Friend(uuidv4(), name, newMember.channelID, newMember.guild.id)
            friendsMap.set(newMember.id, friend)
            
            // friendsList.push({key: newMember.id, value: friend})

            console.log(friendsMap);

            sendChangedDirectMessage(name, channelName, isStreaming, isVideoOn, isMuted, isDeafened, isAfk);

            // Send new status information
            sendHttpRequestToLambda(friend.sessionGuid, newMember.id, Date.now(), newMember.guild.id, newMember.channel.id, true, channelName, isStreaming, isVideoOn, isMuted, isDeafened, isAfk)
        }

        // if (oldMember.channel.name === newMember.channel.name) {

        //     if (newMember.selfMute && !oldMember.selfMute) {
        //         console.log("Gone away, should class as leave and join with mute event")
        //     } else if (!newMember.selfMute && oldMember.selfMute) {
        //         console.log("Returned, should class as leave and join with normal event")
        //     }

        //     if (newMember.selfVideo && !oldMember.selfVideo) {
        //         console.log("Turned on video, should class as leave and join event")
        //     } else if (!newMember.selfVideo && oldMember.selfVideo) {
        //         console.log("Turned off video, should class as leave and join event")
        //     }

        //     if (newMember.streaming && !oldMember.streaming) {
        //         console.log("Started streaming, should class as leave and join event")
        //     } else if (!newMember.streaming && oldMember.streaming) {
        //         console.log("Started streaming, should class as leave and join event")
        //     }

        //     // ToDo - add a bunch of lambda properties for stuff - isStreaming, isMuted, isVideo, isAFK, channelName

        //     return;
        // }

        // console.log(`Left ${oldMember.channel.name}`)
        // console.log(`Joined ${newMember.channel.name}`)
        
        // if (newMember.channel.name.toLowerCase().includes("afk")) {
        //     console.log("Gone afk channel")
        // } else if (oldMember.channel.name.toLowerCase().includes("afk")) {
        //     console.log("No longer afk")
        // }

        return;
    }

    let name = whoIs(newMember.id)

    // A new user joins
    if(newMember.channelID !== null && newMember.channelID !== undefined) {

        if (name != null) {
            if(friendsMap.has(newMember.id)) {
                friendsMap.delete(newMember.id)
            }

            let friend = new Friend(uuidv4(), name, newMember.channelID, newMember.guild.id)
            friendsMap.set(newMember.id, friend)
            
            // friendsList.push({key: newMember.id, value: friend})

            console.log(friendsMap);

            sendJoinedDirectMessage(name);
            sendHttpRequestToLambda(friend.sessionGuid, newMember.id, Date.now(), newMember.guild.id, newMember.channel.id, true, channelName, isStreaming, isVideoOn, isMuted, isDeafened, isAfk)
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

            if(friendsMap.has(newMember.id)) {
                console.log(friendsMap.get(newMember.id));
                leaver = friendsMap.get(newMember.id);
                sendHttpRequestToLambda(leaver.sessionGuid, newMember.id, Date.now(), leaver.serverId, leaver.channelId, false, channelName, isStreaming, isVideoOn, isMuted, isDeafened, isAfk)
                friendsMap.delete(newMember.id)
            }

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
    
    function sendChangedDirectMessage(name, channelName, isStreaming, isVideoOn, isMuted, isDeafened, isAfk) {
        directMessagesToSend.forEach(function(id) {
            console.log(id)
            bot.users.cache.get(id).send(`${name} changed status. Channel name = ${channelName}, is streaming = ${isStreaming}, is video on = ${isVideoOn}, is muted = ${isMuted}, is deafened = ${isDeafened}, is AFK = ${isAfk}`);
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

    if (lowerCaseMessage === "#time") {
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

    allowedChannels = ['joshuas-updates', 'meme-spam', "bits-n-bots"]

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

    function sendMessage(data) {
        message.channel.send(data);
    }
});

function sendHttpRequestToLambda(sessionId, userId, timestamp, serverId, channelId, connectionStatus, channelName, isStreaming, isVideoOn, isMuted, isDeafened, isAfk) {
    const url = `${timeApiGatewayBaseUrl}?sessionGuid=${sessionId}&userId=${userId}&timestamp=${timestamp}&serverId=${serverId}&channelId=${channelId}&connectionStatus=${connectionStatus}&channelName=${channelName}&isStreaming=${isStreaming}&isVideoOn=${isVideoOn}&isMuted=${isMuted}&isDeafened=${isDeafened}&isAfk=${isAfk}`;
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

