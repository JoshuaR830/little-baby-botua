const https = require('https');
const Discord = require('discord.js');

const serverApiGatewayBaseUrl = "https://a6bvqaoebf.execute-api.eu-west-2.amazonaws.com/v0/";

function launchServer(callback, serverType) {
    serverUrl = `${serverApiGatewayBaseUrl}game-server?serverType=${serverType}`
    console.log(serverUrl);
    https.get(serverUrl, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () =>{ 

            var parsed = data;

            let ec2Card = new Discord.MessageEmbed()
                .setTitle("Server Status")
                .setColor("#03d3fc")
                .setDescription(parsed)
                .setThumbnail(`https://generic-images.s3.eu-west-2.amazonaws.com/logos/${serverType.toLowerCase()}-logo.png`);
            
            callback(ec2Card);
        })
    }).on('error', (error) => {
        console.log(`Something went wrong: ${error}`);
    });
}

function stopServer(callback, serverType) {
    let serverUrl = `${serverApiGatewayBaseUrl}stop-game-server?serverType=${serverType}`

    https.get(serverUrl, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () =>{ 

            var parsed = data;

            let ec2Card = new Discord.MessageEmbed()
                .setTitle("Server stopped")
                .setColor("#fc3d03")
                .setDescription(parsed)
                .setThumbnail(`https://generic-images.s3.eu-west-2.amazonaws.com/logos/${serverType.toLowerCase()}-logo.png`);
            
            callback(ec2Card);
        })
    }).on('error', (error) => {
        console.log(`Something went wrong: ${error}`);
    });
}


module.exports = {launchServer: launchServer, stopServer: stopServer}