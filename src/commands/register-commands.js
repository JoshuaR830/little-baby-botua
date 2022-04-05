const { type } = require("os");
const CommandBuilder = require("./command-builder");

const { REST } = require('@discordjs/rest');
const {Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

async function registerCommands(bot, id) {

    console.log(`Register commands function, guild from env ${process.env.TheRoomGuildId}`)
    console.log(`Register commands function, guild id ${id}`)
    const guildId = id;

    const rest = new REST({ version: '9'}).setToken(process.env.TOKEN);

    const randomCatCommand = new SlashCommandBuilder()
        .setName("cat")
        .setDescription("Get a random cat image")
        .toJSON();

    const wilburCommand = new SlashCommandBuilder()
        .setName("wilbur")
        .setDescription("Get a random Wilbur Wednesday image")
        .addIntegerOption(option =>
            option.setName("sequence")
                .setDescription("Get a specific image from Wilbur's history")
                .setRequired(false)
        ).toJSON();

    const dilbertCommand = new SlashCommandBuilder()
        .setName('dilbert')
        .setDescription('Get the daily Dilbert comic strip')
        .toJSON();

    const weatherCityCommand = new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get the weather forecast')
        .addStringOption(option => 
            option.setName("city")
                .setDescription("Get the weather for a specific city")
                .setRequired(true))
        .toJSON();

    const weatherCoordCommand = new SlashCommandBuilder()
        .setName('weather-coords')
        .setDescription('Get the weather forecast')
        .addNumberOption(option =>
            option.setName("lat")
                .setDescription("Get the weather for a specific latitude")
                .setRequired(true))
        .addNumberOption(option =>
            option.setName("lon")
                .setDescription("Get the weather for a specific longitude")
                .setRequired(true))
        .toJSON();

    const httpCatCommand = new SlashCommandBuilder()
        .setName('http-cat')
        .setDescription('Get an http cat image')
        .addIntegerOption(option =>
            option.setName("status-code")
                .setDescription("the http status code")
                .setRequired(true))
        .toJSON();

    const timeGraphCommand = new SlashCommandBuilder()
        .setName('time-graph')
        .setDescription('Get a graph of usage statistics for a selected time period')
        .addIntegerOption(option =>
            option.setName("days")
                .setDescription("Number of days")
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName("months")
                .setDescription("Number of months")
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName("years")
                .setDescription("Number of years")
                .setRequired(false))
        .toJSON();

    const minecraftCommand = new SlashCommandBuilder()
        .setName('minecraft')
        .setDescription('Start a minecraft server')
        .toJSON();

    const withLegoCommand = new SlashCommandBuilder()
        .setName('lego-universe')
        .setDescription('Start a Lego Universe (DLU) server')
        .toJSON();

    const stopMinecraftCommand = new SlashCommandBuilder()
        .setName('stop-minecraft')
        .setDescription("Stop a running Minecraft server")
        .toJSON();

    const stopLegoUniverseCommand = new SlashCommandBuilder()
        .setName('stop-lego-universe')
        .setDescription("Stop a running Lego Universe server")
        .toJSON();

    var commandsList = ([randomCatCommand, wilburCommand, dilbertCommand, weatherCityCommand, weatherCoordCommand, httpCatCommand, timeGraphCommand, minecraftCommand, withLegoCommand, stopMinecraftCommand, stopLegoUniverseCommand]);

    (async () => {
        try {
            await rest.put(
                Routes.applicationGuildCommands(bot.user.id, guildId),
                { body: commandsList }
            )

            console.log("Successfully reloaded application commands")
        } catch (error) {
            console.error(error);
        }
    })();
}

function registerStatsCommand(bot) {
    bot.api.applications(bot.user.id).guilds(guildId).commands.post({data: {
        name: 'time-stats',
        description: 'Get a selected stat for a selected number of days',
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
            },
            {
                name: "stat",
                type: 3,
                required: false,
                description: "The specific statistic to see the leader for",
                choices: [
                    {
                        name: "Active",
                        value: "&championTypes=isActive"
                    },
                    {
                        name: "Muted",
                        value: "&championTypes=isMuted"
                    },
                    {
                        name: "Streaming",
                        value: "&championTypes=isStreaming"
                    },
                    {
                        name: "Video",
                        value: "&championTypes=isVideoOn"
                    },
                    {
                        name: "Reliable",
                        value: "&championTypes=isReliable"
                    },
                    {
                        name: "Deafened",
                        value: "&championTypes=isDeafened"
                    },
                    {
                        name: "AFK",
                        value: "&championTypes=isAfk"
                    },
                ]
            }
        ]
    }});
}


module.exports = {registerCommands : registerCommands};