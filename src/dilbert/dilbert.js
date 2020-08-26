dilbertBaseUrl = 'https://dilbert.com/strip';

function getDilbertStrip(callback) {
    callback(`${dilbertBaseUrl}/${getCurrentDate()}`);
}

function getCurrentDate() {
    var dateTime = new Date();
    const formattedDate = `${dateTime.getFullYear()}-${pad(dateTime.getMonth() + 1)}-${pad(dateTime.getDate())}`
    return formattedDate;
}

function pad(number) {
    return ('00'+number).slice(-2);
}

module.exports = { getDilbertStrip : getDilbertStrip }