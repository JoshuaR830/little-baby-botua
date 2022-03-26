class CommandBuilder {
    randomCat = null;
    wilbur = null;
    dilbert = null;
    weatherCity = null;
    weatherCoord = null;
    httpCat = null;
    timeGraph = null;
    minecraft = null;
    lego = null;

    static Builder = class {
        randomCat = null;
        wilbur = null;
        dilbert = null;
        weatherCity = null;
        weatherCoord = null;
        httpCat = null;
        timeGraph = null;
        minecraft = null;
        lego = null;

        withRandomCatCommand() {
            this.randomCat = {
                name: 'cat',
                type: 1,
                description: 'Get a random cat image',
            };
            return this;
        }

        withWilburCommand() {
            this.wilbur = {
                name: 'wilbur',
                type: 1,
                description: 'Get a random Wilbur Wednesday image',
                options: [
                    {
                        name: "sequence",
                        description: "Get a specific image from Wilbur's history",
                        type: 4,
                        required: false
                    }
                ]
            };
            return this;
        }

        withDilbertCommand() {
            this.dilbert = {
                name: 'dilbert',
                type: 1,
                description: 'Get the daily Dilbert comic strip',
            };
            return this;
        }

        withWeatherCityCommand() {
            this.weatherCity = {
                name: 'weather',
                type: 1,
                description: 'Get the weather forecast',
                options: [{
                        name: "city",
                        description: "Get the weather for a specific city",
                        type: 3,
                        required: true
                }]
            }
            return this;
        }

        withWeatherCoordCommand() {
            this.weatherCoord = {
                name: 'weather-coords',
                type: 1,
                description: 'Get the weather forecast',
                options: [{
                        name: "lat",
                        description: "Get the weather for a specific latitude",
                        type: 10,
                        required: true
                },
                {
                        name: "lon",
                        description: "Get the weather for a specific longitude",
                        type: 10,
                        required: true
                }]
            };
            return this;
        }

        withHttpCatCommand() {
            this.httpCat = {
                name: 'http-cat',
                type: 1,
                description: 'Get an http cat image',
                options: [{
                    name: "status-code",
                    description: "the http status code",
                    type: 3,
                    required: true
                }]
            };
            return this;
        }

        withTimeGraphCommand() {
            this.timeGraph = {
                name: 'time-graph',
                description: 'Get a graph of usage statistics for a selected time period',
                options: [
                    {
                        name: "days",
                        description: "Number of days",
                        type: 10,
                    },
                    {
                        name: "months",
                        description: "Number of months",
                        type: 10,
                    },
                    {
                        name: "years",
                        description: "Number of years",
                        type: 10,
                    }
                ]
            };
            return this;
        }

        withMinecraftCommand() {
            this.minecraft = {
                name: 'minecraft',
                type: 1,
                description: 'Start a minecraft server',
            };
            return this;
        }

        withLegoCommand() {
            this.lego = {
                name: 'lego-universe',
                type: 1,
                description: 'Start a Lego Universe (DLU) server',
            };
            return this;
        }

        build() {
            const commandBuilder = new CommandBuilder(
                this.randomCat,
                this.wilbur,
                this.dilbert,
                this.weatherCity,
                this.weatherCoord,
                this.httpCat,
                this.timeGraph,
                this.minecraft,
                this.lego
            )

            return commandBuilder;
        }
    }

    constructor(randomCat, wilbur, dilbert, weatherCity, weatherCoord, httpCat, timeGraph, minecraft, lego) {
        this.randomCat = randomCat;
        this.wilbur = wilbur;
        this.dilbert = dilbert;
        this.weatherCity = weatherCity;
        this.weatherCoord = weatherCoord;
        this.httpCat = httpCat;
        this.timeGraph = timeGraph;
        this.minecraft = minecraft;
        this.lego = lego;
    }

    toCommand() {
        return [this.randomCat]//, this.wilbur, this.dilbert, this.weatherCity, this.weatherCoord, this.httpCat, this.timeGraph, this.minecraft, this.lego]
    }
}

module.exports = CommandBuilder