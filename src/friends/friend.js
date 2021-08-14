class Friend {
    constructor (guid, name, channelId, serverId) {
        this.sessionGuid = guid;
        this.name = name;
        this.channelId = channelId;
        this.serverId = serverId;
    }
}

module.exports = Friend