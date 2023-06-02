const formatTime = require('date-format');

const createMessage = (text, username) => {
    return {
        text,
        time: formatTime("dd/MM/yyyy - hh:mm:ss", new Date()),
        username
    }
}

module.exports = { createMessage }