const Discord = require('discord.js');
const QuickChart = require('quickchart-js')
const https = require('https');

const getTimeApiGatewayBaseUrl = 'https://a6bvqaoebf.execute-api.eu-west-2.amazonaws.com/v0/get-time';

async function getTimeGraph(callback, days) {
    console.log("Time");

    https.get(`${getTimeApiGatewayBaseUrl}?days=${days}`, (response) => {

        data = "";

        response.on('data', (chunk => {
            data += chunk;
        }))

        response.on('end', async () => {
            try {
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
                    .setColour("#608b81")
                    .setDescription(`The most active user for the previous ${days} days was ${parsedData.champion.name} with an active time of ${parsedData.champion.timeActive} what a champion :crown:`);
            
                callback(barChartMessage);
                callback(pieChartMessage);
                callback(championMessage);
            } catch (e) {
                callback(e);
            }
            

        })
    })

    
}

module.exports = {getTimeGraph: getTimeGraph}