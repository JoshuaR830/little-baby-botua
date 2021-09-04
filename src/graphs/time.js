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
            var parsedData = JSON.parse(data);

            console.log(parsedData)

            const barChart = new QuickChart();
            barChart.setConfig({
                type: 'bar',
                data: parsedData.barGraph
            })

            barChart.setBackgroundColor("rgb(0,0,0)")
        
            const barChartUrl = await barChart.getShortUrl();
        
            console.log(barChartUrl)

            const pieChart = new QuickChart();
            pieChart.setConfig({
                type: 'doughnut',
                data: parsedData.pieChart
            })

            pieChart.setBackgroundColor("rgb(0,0,0)")

            const pieChartUrl = await pieChart.getShortUrl();

            const barChartMessage = new Discord.MessageEmbed()
                .setTitle("Time graph")
                .setColor("#608b81")
                .setImage(barChartUrl)
                .setDescription(`Here are the results for the previous ${days} days`);

            const pieChartMessage = new Discord.MessageEmbed()
                .setTitle("Time graph")
                .setColor("#608b81")
                .setImage(pieChartUrl)
                .setDescription(`Here are the results for the previous ${days} days`);
        
            callback(barChartMessage);
            callback(pieChartMessage);

        })
    })

    
}

module.exports = {getTimeGraph: getTimeGraph}