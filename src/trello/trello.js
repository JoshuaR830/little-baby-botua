const fetch = require('node-fetch');
const Discord = require('discord.js');


if(process.env.NODE_ENV !== 'production') {
    const path = require('path');
    console.log("Hello")
    require('dotenv').config({path: path.resolve(__dirname, '.env')});
}

const joshuaBaseUrl = process.env.S3_BUCKET_BASE_URL

const colors = {
    "green": "#32a852",
    "yellow": "#f5f242",
    "orange": "#ffae00",
    "red": "#ff0000",
    "purple": "#c905fa",
    "blue": "#054efa",
    "sky": "#05d1fa",
    "lime": "#84fa05",
    "pink": "#ff7dff",
    "black": "#000000"
}

function getInProgress(sendCardInfo) {


    const trelloKey = process.env.TRELLO_API_KEY
    const trelloToken = process.env.TRELLO_TOKEN;
    const toDoTokenDocumentation = process.env.TO_DO_TOKEN_DOCUMENTATION
    const trelloUrl = `https://api.trello.com/1/lists/${toDoTokenDocumentation}/cards?key=${trelloKey}&token=${trelloToken}`;


    fetch()

    fetch(trelloUrl, {
        method: 'GET'
    }).then(response => {
        return response.text()
    }).then(text => {
        json = JSON.parse(text)
        console.log(json)

        var imageNumber = Math.floor(Math.random() * 8);

        let informationCard = new Discord.MessageEmbed()
            .setTitle("Here is what I'm working on")
            .setDescription("Below is a list of all of the things that I have in progress right now!\nWhile you are here, here is a picture to remind you what I look like:")
            .setImage(`${joshuaBaseUrl}/Joshua-${imageNumber}.jpg`)
            .setFooter(`> Much love`)

        sendCardInfo(informationCard)


        json.forEach(element => {
            console.log(element.name)
            let labelColor;
            let labelName;

            if(element.idLabels.length > 0) {
                console.log(element.idLabels[0])
                let labelUrl = `https://api.trello.com/1/labels/${element.idLabels[0]}?key=${trelloKey}&token=${trelloToken}`;
                fetch(labelUrl, {
                    method: 'GET'
                }).then(labelResponse => {
                    return labelResponse.text()
                }).then(labelText => {
                    console.log(labelText)
                    let labelJson = JSON.parse(labelText)
                    console.log(labelJson.color)
                    labelColor = labelJson.color;
                    labelName = labelJson.name;

                    console.log(labelColor)
                    console.log(colors[labelColor])
        
                    let trelloCard = new Discord.MessageEmbed()
                        .setTitle(element.name)
                        .setColor(colors[labelColor])
                        .setDescription(element.desc)
                        .setFooter(`> ${labelName}`)
        
                    sendCardInfo(trelloCard)

                }).catch(err => console.log(err))
            } else {
                let trelloCard = new Discord.MessageEmbed()
                    .setTitle(element.name)
                    .setDescription(element.desc)
        
                sendCardInfo(trelloCard)
            }
        });

    })
    .catch(err => console.log(err))
}

module.exports = {getInProgress: getInProgress}