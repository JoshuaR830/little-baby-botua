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

            const chart = new QuickChart();
            chart.setConfig({
                type: 'bar',
                data: parsedData
            })

            chart.setBackgroundColor("rgb(0,0,0)")
        
            const url = await chart.getShortUrl();
        
            console.log(url)
            const chartMessage = new Discord.MessageEmbed()
                .setTitle("Time graph")
                .setColor("#608b81")
                .setImage(url)
                .setDescription(`Here are the results for the previous ${days} days`);
        
            callback(chartMessage);

        })
    })

    
}

module.exports = {getTimeGraph: getTimeGraph}