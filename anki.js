const request = require('request-promise');

function addNote(deck, model, fields, tags) {

    tags = tags || [];

    let body = {
        "action": "addNote",
        "version": 6,
        "params": {
            "note": {
                "deckName": deck,
                "modelName": model,
                "fields": fields,
                "tags": tags
            }
        }
    };

    return request.post('http://127.0.0.1:8765', {
        body,
        json: true
    }).then(res => {

        if (res.error !== null) {
            throw new Error(res.error);
        }
               
        return res;
    })
}

module.exports = {
    addNote
};