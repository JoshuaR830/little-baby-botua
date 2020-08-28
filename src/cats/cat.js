const fetch = require('node-fetch');
const Discord = require('discord.js');

catBaseUrl = 'https://api.thecatapi.com/v1/images/search'

function getRandomCatImage(messageCallback) {
    fetch(catBaseUrl, {
        method: 'GET'
    }).then(response =>{
        return response.text()
    }).then(
        text => {
            json = JSON.parse(text)
            messageCallback(json[0].url);
        }
    ).catch(
        error => console.log(error)
    )
}

module.exports = {getRandomCatImage : getRandomCatImage}