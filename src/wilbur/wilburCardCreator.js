const https = require('https');
const Discord = require('discord.js');

const wilburApiGatewayBaseUrl = 'https://7rxf8z5z9h.execute-api.eu-west-2.amazonaws.com/v0/lambda';

const url = `${wilburApiGatewayBaseUrl}?imageTime=random&storyItemNumber=1`;

function createWilburCard(callback) {
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
                .setDescription(parsed.Description)
                .setThumbnail('https://adventures-of-wilbur-images.s3.eu-west-2.amazonaws.com/wilbur-profile.png');
            
            callback(wilburCard);
        })
    }).on('error', (error) => {
        console.log(`Something went wrong: ${error}`);
    });
}


module.exports = {createWilburCard: createWilburCard}