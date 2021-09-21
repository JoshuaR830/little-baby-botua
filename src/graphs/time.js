const Discord = require('discord.js');
const QuickChart = require('quickchart-js')
const https = require('https');

const getTimeApiGatewayBaseUrl = 'https://a6bvqaoebf.execute-api.eu-west-2.amazonaws.com/v0/get-time';
const achievementImageFolderUrl = "https://generic-images.s3.eu-west-2.amazonaws.com/achievement-images";

async function getTimeGraph(callback, days) {
    console.log("Time");
    console.log(`${getTimeApiGatewayBaseUrl}?days=${days}`);

    https.get(`${getTimeApiGatewayBaseUrl}?days=${days}`, (response) => {

        data = "";

        response.on('data', (chunk => {
            data += chunk;
        }))

        response.on('end', async () => {
            var parsedData = JSON.parse(data);

            console.log(parsedData)

            const barChart = new QuickChart();
            barChart.setConfig(parsedData.barGraph);
            barChart.setBackgroundColor("rgb(0,0,0)")
            const barChartUrl = await barChart.getShortUrl();
        
            console.log(barChartUrl)

            const pieChart = new QuickChart();
            pieChart.setConfig(parsedData.pieChart)
            pieChart.setBackgroundColor("rgb(0,0,0)")
            const pieChartUrl = await pieChart.getShortUrl();

            const barChartMessage = new Discord.MessageEmbed()
                .setTitle("Time graph")
                .setColor("#608b81")
                .setImage(barChartUrl)
                .setDescription(`Here are the results for the previous ${days} days`);

            const pieChartMessage = new Discord.MessageEmbed()
                .setTitle("Most active for time period")
                .setColor("#608b81")
                .setImage(pieChartUrl)
                .setDescription(`Collated activity for the previous ${days} days`);

            const championMessage = new Discord.MessageEmbed()
                .setTitle("We have a champion :crown:")
                .setColor(argbToRGB(parsedData.champions.active.color))
                .setThumbnail(`${achievementImageFolderUrl}/champion.png`)
                .setDescription(`The most active user for the previous ${days} days was ${parsedData.champions.active.name} with an active time of ${parsedData.champions.active.timeActive} hours what a champion!`);
                
            const deafenedMessage = new Discord.MessageEmbed()
                .setTitle("King of the squid people :squid:")
                .setColor(argbToRGB(parsedData.champions.deafened.color))
                .setThumbnail(`${achievementImageFolderUrl}/deafened.png`)
                .setDescription(`${parsedData.champions.deafened.name} with a deafened time of ${parsedData.champions.deafened.timeActive} hours in the previous ${days} days you were deafened so long that like the squid, you may as well have no ears!`);
                
            const mutedMessage = new Discord.MessageEmbed()
                .setTitle("Captain of the muted mutiny :pirate_flag:")
                .setThumbnail(`${achievementImageFolderUrl}/muted.png`)
                .setColor(argbToRGB(parsedData.champions.muted.color))
                .setDescription(`With a muted time of ${parsedData.champions.muted.timeActive} hours in the previous ${days} days we had no option but to promote ${parsedData.champions.muted.name} to the prestigious position of captain of the muted mutiny!`);
                
            const streamingMessage = new Discord.MessageEmbed()
                .setTitle("We have a Superior Shark :shark:")
                .setColor(argbToRGB(parsedData.champions.streaming.color))
                .setThumbnail(`${achievementImageFolderUrl}/streaming.png`)
                .setDescription(`With a streaming time of ${parsedData.champions.streaming.timeActive} hours in the previous ${days} days, like the mighty shark, normal streams could not hold your superiority, so ${parsedData.champions.streaming.name} takes the title of Superior Shark - congratulations!`);
                
            const afkMessage = new Discord.MessageEmbed()
                .setTitle("Trippy Tourist :palm_tree:")
                .setColor(argbToRGB(parsedData.champions.afk.color))
                .setThumbnail(`${achievementImageFolderUrl}/afk.png`)
                .setDescription(`With ${parsedData.champions.afk.timeActive} hours away in the previous ${days} days, it's clear you're not quite with it, get yourself sorted ${parsedData.champions.afk.name}`);
                
            const videoMessage = new Discord.MessageEmbed()
                .setTitle("Viva la Vlogger :video_camera:")
                .setColor(argbToRGB(parsedData.champions.video.color))
                .setThumbnail(`${achievementImageFolderUrl}/video.png`)
                .setDescription(`Born to be a vlogger, your time on video of ${parsedData.champions.video.timeActive} hours in the previous ${days} days means ${parsedData.champions.video.name} you are closer than anyone else to being a fully fledged vlogger!`);

            callback(barChartMessage);
            callback(pieChartMessage);
   
            if (parsedData.champions.active.timeActive > 0) {
                callback(championMessage);
            }

            if (parsedData.champions.deafened.timeActive > 0) {
                callback(deafenedMessage);
            }

            if (parsedData.champions.muted.timeActive > 0) {
                callback(mutedMessage);
            }

            if (parsedData.champions.streaming.timeActive > 0) {
                callback(streamingMessage);
            }

            if (parsedData.champions.afk.timeActive > 0) {
                callback(afkMessage);
            }

            if (parsedData.champions.video.timeActive > 0) {
                callback(videoMessage);
            }
        })
    })

    function argbToRGB(color) {

        if (color.length === 0) {
            return "#000000";
        }

        colors = color.substring(color.indexOf('(') + 1, color.length - 1).split(',')
        
        return '#'+ (Number(colors[0].trim())).toString(16).padStart(2, 0) + (Number(colors[1].trim())).toString(16).padStart(2, 0) + (Number(colors[2].trim())).toString(16).padStart(2, 0);
    }
}

module.exports = {getTimeGraph: getTimeGraph}