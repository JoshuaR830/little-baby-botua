const fetch = require('node-fetch');

catBaseUrl = 'https://http.cat/'

function getHttpCatImage(messageCallback, statusCode) {
    messageCallback(`https://http.cat/${statusCode}`)
}

module.exports = {getHttpCatImage : getHttpCatImage}