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
                // data: {
                //     labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                //     datasets: [{
                //         label: 'Andrew',
                //         data: [1.5, 2, 3, 2, 3, 5, 1]
                //     }, {
                //         label: 'Dayle',
                //         data: [1, 3, 6, 2, 3, 5, 1]
                //     }, {
                //         label: 'Jonny',
                //         data: [1, 3, 6, 2, 3, 5, 1]
                //     }, {
                //         label: 'Jordan',
                //         data: [1, 3, 9, 2, 3, 5, 1]
                //     }, {
                //         label: 'Joshua',
                //         data: [1, 3, 10, 2, 3, 5, 1]
                //     }, {
                //         label: 'Lucas',
                //         data: [1, 7, 6, 2, 3, 5, 1]
                //     }, {
                //         label: 'Madalyn',
                //         data: [1, 3, 6, 2, 3, 5, 1]
                //     }, {
                //         label: 'Martin',
                //         data: [1, 14, 8, 2, 3, 5, 1]
                //     }]
                // }
            })
        
            const url = await chart.getShortUrl();
        
            console.log(url)
            const chartMessage = new Discord.MessageEmbed()
                .setTitle("Chart")
                .setColor("#607D8B")
                .setImage(url)
                .setDescription("Here is a chart");
        
            callback(chartMessage);

        })
    })

    
}

module.exports = {getTimeGraph: getTimeGraph}