const config = require('./config');

const gTranslate = require('google-translate-api');
const request = require("request-promise");

async function google(text, target) {
    let resp = await gTranslate(text, { to: target });
    return resp.text;
}

async function yandex(text, target) {
    let resp = await request(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${config.translation.apiKey}&text=${text}&lang=${target}`, { json: true });
    return resp.text[0];
}

module.exports = {
    google,
    yandex
};