const Discord = require('discord.js');
const QuickChart = require('quickchart-js')
const https = require('https');

runnerUpCount = process.env.RunnerUpCount;

const getTimeApiGatewayBaseUrl = 'https://a6bvqaoebf.execute-api.eu-west-2.amazonaws.com/v0/get-time';

async function getTimeGraph(callback, days) {
    console.log("Time");
    console.log(`${getTimeApiGatewayBaseUrl}?days=${days}`);
    https.get(`${getTimeApiGatewayBaseUrl}?days=${days}&isSingleUser=false&userId=0&shouldShowTopThree=false&championTypes=isActive&championTypes=isDeafened&championTypes=isMuted&championTypes=isStreaming&championTypes=isAfk&championTypes=isVideoOn&championTypes=isReliable`, (response) => {

        data = "";

        response.on('data', (chunk => {
            data += chunk;
        }))

        response.on('end', async () => {
            var parsedData = JSON.parse(data);

            console.log("parsed: " + parsedData)

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


            championsList = parsedData.championsList;

            callback(barChartMessage);
            callback(pieChartMessage);

            championsList.forEach((champion) => {
                callback(new Discord.MessageEmbed()
                    .setTitle(champion.title)
                    .setColor(argbToRGB(champion.color))
                    .setThumbnail(champion.thumbnailUrl)
                    .setDescription(champion.description)
                );
            });
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