const path = require('path');
const notifier = require('node-notifier');

function message(message, title = 'Translatr', wait = false) {
    return new Promise((res, rej) =>  {
        notifier.notify({
            title: title,
            message: message,
            wait: wait,
            icon: path.join(__dirname, 'Book-04.png')
        }, res);

        if (!wait) {
            res();
        }
    });
}

let error = (msg) => message(`Error: ${msg}`);

module.exports = {
    message,
    error
};