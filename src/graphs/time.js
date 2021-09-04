const Discord = require('discord.js');
const QuickChart = require('quickchart-js')
const https = require('https');

const getTimeApiGatewayBaseUrl = 'https://a6bvqaoebf.execute-api.eu-west-2.amazonaws.com/v0/get-time';

async function getTimeGraph(callback, days) {
    console.log("Time");
    days = 7;
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
                .setColor(argbToRGB(parsedData.champion.color))
                .setDescription(`The most active user for the previous ${days} days was ${parsedData.champion.name} with an active time of ${parsedData.champion.timeActive} hours what a champion :crown:`);
        
            callback(barChartMessage);
            callback(pieChartMessage);
            callback(championMessage);

        })
    })

    function argbToRGB(color) {
        colors = color.substring(color.indexOf('(') + 1, color.length - 1).split(',')
        
        return '#'+ (Number(colors[0].trim())).toString(16).padStart(2, 0) + (Number(colors[1].trim())).toString(16).padStart(2, 0) + (Number(colors[2].trim())).toString(16).padStart(2, 0);
    }
}

module.exports = {getTimeGraph: getTimeGraph}