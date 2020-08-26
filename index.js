require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const https = require('https');

const TOKEN = process.env.TOKEN;
const wilburApiGatewayBaseUrl = 'https://7rxf8z5z9h.execute-api.eu-west-2.amazonaws.com/v0/lambda';

bot.login(TOKEN);


bot.on('ready', () => {
    console.log(bot.user.tag);
});

bot.on('message', function(message) {

    if(message.author.id === bot.user.id) {
        return;
    }

    if(message.content.toLowerCase() === '/wilbur') {
        const url = `${wilburApiGatewayBaseUrl}?imageTime=random&storyItemNumber=1`;

        https.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () =>{ 

                var parsed = JSON.parse(data);

                let wilburCard = new Discord.MessageEmbed()
                    .setTitle(parsed.Title)
                    .setColor("#607D8B")
                    .setImage(parsed.ImageUrl)
                    .setDescription(parsed.Description);

                message.channel.send(wilburCard);
                console.log(JSON.parse(data));
            });
        }).on('error', (error) => {
            console.log(`Something went wrong: ${error}`);
        })
    }
});