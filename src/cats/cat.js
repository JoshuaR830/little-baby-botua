const fetch = require('node-fetch');
const Discord = require('discord.js');

catBaseUrl = 'https://api.thecatapi.com/v1/images/search'

function getRandomCatImage(messageCallback) {
    fetch('https://api.thecatapi.com/v1/images/search')
        .then(res => res.json())
        .then(text => messageCallback(text[0].url))
        .catch(error => console.log(error.message)
    )
}

module.exports = {getRandomCatImage : getRandomCatImage}