const wilbur = require('./../wilbur/wilburCardCreator')
const cat = require('./../cats/cat')
const httpCat = require('./../cats/http-cat')
const weather = require('./../weather/weather')
const dilbert = require('./../dilbert/dilbert')
const timeGraph = require('./../graphs/time')
const ec2Servers = require('./../ec2/ec2')
const genericQuery = "imageTime=random&storyItemNumber=1"

async function manageResponse(bot, interaction) {
    console.log("Manage response");
    switch (interaction.commandName) {
        case "wilbur":
            console.log("WILBUR")
            console.log(interaction.options.getInteger("sequence"))
            await respondToWilburCommand(interaction);
            break;
        case "cat":
            console.log("Cat selected")
            await respondToRandomCatCommand(interaction);
            break;
        case "dilbert":
            await respondToDilbertCommand(interaction);
            break;
        case "weather":
            await respondToWeatherCityCommand(interaction);
            break;
        case "weather-coords":
            await respondToWeatherCoordsCommand(interaction);
            break;
        case "time-graph":
            await respondToTimeGraphCommand(bot, interaction);
            break;
        case "http-cat":
            await respondToHttpCatCommand(interaction);
            break;
        case "minecraft":
            await respondToMinecraftCommand(interaction);
            break;
        case "lego-universe":
            await respondToLegoCommand(interaction);
            break;
        default:
            break;
    }
}

async function respondToHttpCatCommand(interaction) {
    let statusCode = interaction.options.getInteger("status-code") ?? 404;
    await interaction.deferReply();

    httpCat.getHttpCatImage(async (messageContent) => {
        await interaction.editReply({content: messageContent});
    }, statusCode);
}

async function respondToWeatherCoordsCommand(interaction) {

    let lat = interaction.options.getNumber("lat") ?? 0;
    let lon = interaction.options.getNumber("lon") ?? 0;

    await interaction.deferReply();

    weather.getWeatherByLatLon(async (messageContent) => {
        await interaction.editReply({embeds: [messageContent]})
    }, lat, lon);
}

async function respondToWeatherCityCommand(interaction) {

    let cityName = interaction.options.getString("city") ?? "Carlisle";
    await interaction.deferReply();

    weather.getWeatherByCity(async (messageContent) => {
        interaction.editReply({embeds: [messageContent]});
    }, cityName);
}

async function respondToDilbertCommand(interaction) {
    await interaction.deferReply();
    dilbert.getDilbertStrip(async (messageContent) => {
        await interaction.editReply({content: messageContent});
    });
}

async function respondToTimeGraphCommand(bot, interaction) {

    let days = 0;

    days = interaction.options.getInteger("days") ?? 0;
    months = interaction.options.getInteger("months") ?? 0;
    years = interaction.options.getInteger("years") ?? 0;

    days += (months * 30) + (years * 356);

    // timeGraph.getTimeGraph((messageContent) => {
    //     bot.api.interactions(interaction.id, interaction.token).callback.post(
    //         {
    //             data: {
    //                 type: 4,
    //                 data: {
    //                     embeds: [messageContent]
    //             }
    //         }
    //     });
    // }, days);

    // await interaction.deferReply();

    // bot.api.interactions(interaction.id, interaction.token).callback.post(
    //     {
    //         data: {
    //             type: 4,
    //             data: {
    //                 content: "Collating your data, won't be long... (whistles)"
    //         }
    //     }
    // });
    await interaction.deferReply();

    timeGraph.getTimeGraph(async (messageContent) => {
        console.log(messageContent)
        await interaction.editReply({content: "The results are in", ephemeral: true})
        // console.log(bot.channels.cache)
        bot.channels.cache.get(interaction.channelId).send({embeds: [messageContent]});
    }, days);
}

async function respondToRandomCatCommand(interaction) {
    await interaction.deferReply();
    cat.getRandomCatImage(async (messageContent) => {
        await interaction.editReply({content: messageContent});
    })
};

async function respondToWilburCommand(interaction) {
    sequenceNumber = interaction.options.getInteger("sequence");

    let query = genericQuery;
    if(sequenceNumber != null)
        query = `imageTime=&storyItemNumber=${sequenceNumber}`;
    
    await interaction.deferReply();

    wilbur.createWilburCard(async (messageContent) => {
        await interaction.editReply({embeds: [messageContent]});
    }, query);
};

async function respondToLegoCommand(interaction) {
    await interaction.deferReply();
    // bot.api.interactions(interaction.id, interaction.token).callback.post(
    //     {
    //         data: {
    //             type: 4,
    //             data: {
    //                 content: "If one is not already running, a Lego Universe (DLU) server will be started soon!"
    //         }
    //     }
    // });

    ec2Servers.launchServer(async (messageContent) => {
        await interaction.editReply({embeds: [messageContent]})
    }, "Lego-universe");
};

async function respondToMinecraftCommand(interaction) {
    // await bot.api.interactions(interaction.id, interaction.token).callback.post(
    //     {
    //         data: {
    //             type: 4,
    //             data: {
    //                 content: "If one is not already running, a Minecraft server will be started soon!"
    //         }
    //     }
    // });

    await interaction.deferReply();

    ec2Servers.launchServer(async (messageContent) => {
        await interaction.editReply({embeds: [messageContent]})
    }, "Minecraft");
};

module.exports = {manageResponse : manageResponse}