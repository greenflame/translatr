var gTranslate = require('google-translate-api');

function google(text, target) {
    return gTranslate(text, {to: target}).then(resp => resp.text);
}

module.exports = {
    google
};