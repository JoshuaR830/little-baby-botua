const fetch = require('node-fetch');
const Discord = require('discord.js');


if(process.env.NODE_ENV !== 'production') {
    const path = require('path');
    require('dotenv').config({path: path.resolve(__dirname, '.env')});
}

const openWeatherMapsBaseUrl = "https://api.openweathermap.org/data/2.5/weather";
const openWeatherMapBaseImageUrl = "http://openweathermap.org/img/wn"

const weatherApiKey = process.env.OPEN_WEATHER_MAPS_API_KEY

function getWeatherByCity(messageCallback, cityName) {
    weatherUrl = `${openWeatherMapsBaseUrl}?q=${cityName}&appid=${weatherApiKey}`;
    getWeather(messageCallback, weatherUrl);
}

function getWeatherByLatLon(messageCallback, latitude, longitude) {
    weatherUrl = `${openWeatherMapsBaseUrl}?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}`;
    
    getWeather(messageCallback, weatherUrl);
}

function getWeather(messageCallback, url) {
    fetch(weatherUrl, {
        method: 'GET'
    }).then(response => {
        console.log(response);
        return response.text();
    }).then(
        text => {
            let json = JSON.parse(text);
            console.log(json);
            console.log(json.weather[0].main);
            console.log(json.weather[0].icon);
            let imageId = json.weather[0].icon;
            imageUrl = `${openWeatherMapBaseImageUrl}/${imageId}@2x.png`;
            
            weatherCard = new Discord.MessageEmbed()
                .setTitle(`Weather for ${json.name}`)
                .setColor('#03f8fc')
                .setDescription(json.weather[0].main)
                .setThumbnail(imageUrl);
            
            messageCallback(weatherCard)
        }
    ).catch(error => console.log(error));
}

module.exports = {
    getWeatherByCity: getWeatherByCity,
    getWeatherByLatLon: getWeatherByLatLon
}