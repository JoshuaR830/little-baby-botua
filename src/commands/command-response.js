const wilbur = require('./../wilbur/wilburCardCreator')
const cat = require('./../cats/cat')
const httpCat = require('./../cats/http-cat')
const weather = require('./../weather/weather')
const dilbert = require('./../dilbert/dilbert')
const timeGraph = require('./../graphs/time')
const genericQuery = "imageTime=random&storyItemNumber=1"

function manageResponse(bot, interaction) {
    switch (interaction.data.name) {
        case "wilbur":
            console.log("WILBUR")

            if(interaction.data.options === undefined) {
                respondToGenericWilburCommand(bot, interaction);
            } else {
                handleWilburOptions(bot, interaction);
            }
            break;
        case "cat":
            respondToRandomCatCommand(bot, interaction);
            break;
        case "dilbert":
            respondToDilbertCommand(bot, interaction);
            break;
        case "weather":
            respondToWeatherCityCommand(bot, interaction);
            break;
        case "weather-coords":
            respondToWeatherCoordsCommand(bot, interaction);
            break;
        case "time-graph":
            respondToTimeGraphCommand(bot, interaction);
            break;
        case "http-cat":
            respondToHttpCatCommand(bot, interaction);
            break;
        default:
            break;
    }
}

function respondToHttpCatCommand(bot, interaction) {
    let statusCode = 0;
    console.log(interaction)
    interaction.data.options.forEach(option => {
        console.log(option)
        if(option.name === "status-code") {
            statusCode = option.value;
        }
    });

    httpCat.getHttpCatImage((messageContent) => {
        bot.api.interactions(interaction.id, interaction.token).callback.post(
            {
                data: {
                    type: 4,
                    data: {
                        content: messageContent
                }
            }
        });
    }, statusCode);
}

function respondToWeatherCoordsCommand(bot, interaction) {

    let lat = 0;
    let lon = 0;

    interaction.data.options.forEach(option => {
        if(option.name === "lat") {
            lat = option.value;
        } else if (option.name === "lon") {
            lon = option.value;
        }
    });

    weather.getWeatherByLatLon((messageContent) => {
        bot.api.interactions(interaction.id, interaction.token).callback.post(
            {
                data: {
                    type: 4,
                    data: {
                        embeds: [messageContent]
                }
            }
        });
    }, lat, lon);
}

function respondToWeatherCityCommand(bot, interaction) {

    let cityName = "";

    interaction.data.options.forEach(option => {
        if(option.name === "city") {
            cityName = option.value;
        }
    });

    weather.getWeatherByCity((messageContent) => {
        bot.api.interactions(interaction.id, interaction.token).callback.post(
            {
                data: {
                    type: 4,
                    data: {
                        embeds: [messageContent]
                }
            }
        });
    }, cityName);
}

function respondToDilbertCommand(bot, interaction) {
    dilbert.getDilbertStrip((messageContent) => {
        bot.api.interactions(interaction.id, interaction.token).callback.post(
            {
                data: {
                    type: 4,
                    data: {
                        content: messageContent
                }
            }
        });
    });
}

function respondToTimeGraphCommand(bot, interaction) {

    let days = 0;

    interaction.data.options.forEach(option => {
        if(option.name === "days") {
            days += option.value;
        } else if (option.name === "months") {
            days += (option.value * 30);
        } else if (option.name === "years") {
            days += (option.value * 365);
        }
    });

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


    bot.api.interactions(interaction.id, interaction.token).callback.post(
        {
            data: {
                type: 4,
                data: {
                    content: "Collating your data, won't be long... (whistles)"
            }
        }
    });

    timeGraph.getTimeGraph((messageContent) => {
        bot.channels.cache.get(interaction.channel_id).send(messageContent);
    }, days);

}

function respondToRandomCatCommand(bot, interaction) {
    cat.getRandomCatImage((messageContent) => {
        bot.api.interactions(interaction.id, interaction.token).callback.post(
            {
                data: {
                    type: 4,
                    data: {
                        content: messageContent
                }
            }
        });
    })
}

function respondToGenericWilburCommand(bot, interaction) {
    bot.api.interactions(interaction.id, interaction.token).callback.post(
        {
            data: {
                type: 4,
                data: {
                    content: "Wilbur is hiding, just completing the seek process, bare with!"
            }
        }
    });

    wilbur.createWilburCard((messageContent) => {
        bot.channels.cache.get(interaction.channel_id).send(messageContent);
    }, genericQuery);
}

function handleWilburOptions(bot, interaction) {
    interaction.data.options.forEach(option => {
        if(option.name === "sequence") {
            let sequenceNumber = option.value;

            bot.api.interactions(interaction.id, interaction.token).callback.post(
                {
                    data: {
                        type: 4,
                        data: {
                        content: `Once upon a time there was a marmot called Wilbur then in adventure ${sequenceNumber}, this happened:`
                    }
                }
            });

            wilbur.createWilburCard((messageContent) => {
                bot.channels.cache.get(interaction.channel_id).send(messageContent);
            }, `imageTime=&storyItemNumber=${sequenceNumber}`);
        }
    });
}

module.exports = {manageResponse : manageResponse}