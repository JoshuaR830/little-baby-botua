const fetch = require('node-fetch');
const Discord = require('discord.js');

const jordanUrl = "https://a6bvqaoebf.execute-api.eu-west-2.amazonaws.com/v0/lambda"

function getJordan(messageCallback) {
    fetch(jordanUrl, {
        method: 'GET'
    }).then( response => {
        return response.text();
    }).then(
        text => {
            let friendData = JSON.parse(text);
            messageCallback(friendData.ImageUrl)
        }
    ).catch(error => console.log(error))
}

module.exports = {getJordan : getJordan}