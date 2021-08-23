const { type } = require("os");

var guildId = ''

function registerCommands(bot, id) {

    guildId = id;

    registerRandomCatCommand(bot);
    registerWilburCommand(bot);
    registerDilbertCommand(bot);
    registerWeatherCityCommand(bot);
    registerWeatherCoordCommand(bot);
    registerHttpCatCommand(bot);
    registerTimeGraphCommand(bot);
}

function registerHttpCatCommand(bot) {
    bot.api.applications(bot.user.id).guilds(guildId).commands.post({data: {
        name: 'http-cat',
        type: 1,
        description: 'Get an http cat image',
        options: [{
            name: "status-code",
            description: "the http status code",
            type: 3,
            required: true
        }]
    }})
}

function registerRandomCatCommand(bot) {
    bot.api.applications(bot.user.id).guilds(guildId).commands.post({data: {
        name: 'cat',
        type: 1,
        description: 'Get a random cat image',
    }})
}

function registerDilbertCommand(bot) {
    bot.api.applications(bot.user.id).guilds(guildId).commands.post({data: {
        name: 'dilbert',
        type: 1,
        description: 'Get the daily Dilbert comic strip',
    }})    
}

function registerWeatherCityCommand(bot) {
    bot.api.applications(bot.user.id).guilds(guildId).commands.post({data: {
        name: 'weather',
        type: 1,
        description: 'Get the weather forecast',
        options: [{
                name: "city",
                description: "Get the weather for a specific city",
                type: 3,
                required: true
        }]
    }})
}

function registerWeatherCoordCommand(bot){
    bot.api.applications(bot.user.id).guilds(guildId).commands.post({data: {
        name: 'weather-coords',
        type: 1,
        description: 'Get the weather forecast',
        options: [{
                name: "lat",
                description: "Get the weather for a specific latitude",
                type: 10,
                required: true
        },
        {
                name: "lon",
                description: "Get the weather for a specific longitude",
                type: 10,
                required: true
        }]
    }})
}

function registerWilburCommand(bot) {
    bot.api.applications(bot.user.id).guilds(guildId).commands.post({data: {
        name: 'wilbur',
        type: 1,
        description: 'Get a random Wilbur Wednesday image',
        options: [
            {
                name: "sequence",
                description: "Get a specific image from Wilbur's history",
                type: 4,
                required: false
            }
        ]
    }})
}

function registerTimeGraphCommand(bot) {
    bot.api.applications(bot.user.id).guilds(guildId).commands.post({data: {
        name: 'time-graph',
        description: 'Get a graph of usage statistics for a selected time period',
            options: [
                {
                    name: "days",
                    description: "Number of days",
                    type: 10,
                },
                {
                    name: "months",
                    description: "Number of months",
                    type: 10,
                },
                {
                    name: "years",
                    description: "Number of years",
                    type: 10,
                }
            ]
        }
    })
}
 

module.exports = {registerCommands : registerCommands};