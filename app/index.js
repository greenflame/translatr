const config = require('./config');

const ioHook = require('iohook');
const clipboardy = require('clipboardy');
const robot = require('robotjs');
const notifier = require('node-notifier');
const { fromEvent } = require('rxjs');
const { filter } = require('rxjs/operators')
const anki = require('./anki');
const translate = require('./translate');
const notify = require('./notify');


fromEvent(ioHook, 'keypress')
    .pipe(filter(i => i.ctrlKey && (i.keychar == 32 || i.keychar == 96)))
    .subscribe(translateTextUnderCursor);

fromEvent(notifier, 'click')
    .subscribe(opts => saveToAnki(opts[1].title, opts[1].message));

let sleep = ms => new Promise(res => setTimeout(res, ms));

async function translateTextUnderCursor() {
    try {
        robot.keyTap('c', 'control');
        await sleep(50);

        let text = trim(await clipboardy.read());
        let translationService = translate[config.translation.service];
        var translation = await translationService(text, config.translation.target);

        await notify.message(translation, text, true);
    } catch (err) {
        await notify.error(err.message || err.code);
    }
}

function trim(str) {
    return str.toLowerCase().replace(/^[\s,.]+|[\s,.]+$/gm, '');
}

async function saveToAnki(text, translation) {
    try {
        await anki.addNote(config.anki.deck, config.anki.model, {
            [config.anki.fields.text]: text,
            [config.anki.fields.translation]: translation
        });

        await notify.message('Note saved successfully');
    } catch (err) {
        await notify.error(err.message);
    }
}

ioHook.start();
