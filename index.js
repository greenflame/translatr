const config = require('./config');

const ioHook = require('iohook');
const clipboardy = require('clipboardy');
const robot = require('robotjs');
const co = require('co');
const notifier = require('node-notifier');
const { fromEvent } = require('rxjs');
const { filter } = require('rxjs/operators')
const anki = require('./anki');
const translate = require('./translate');
const notify = require('./notify');


fromEvent(ioHook, 'keypress')
    .pipe(filter(i => i.ctrlKey && i.keychar == 96))
    .subscribe(_ => co(translateTextUnderCursor));

fromEvent(notifier, 'click')
    .subscribe(opts => co(_ => saveToAnki(opts[1].title, opts[1].message)));

function* translateTextUnderCursor() {
    try {
        robot.keyTap('c', 'control');
        var text = trim(yield clipboardy.read());
        var translation = yield translate.google(text, config.translation.target);

        yield notify.message(translation, text, true);
    } catch (err) {
        yield notify.error(err.message);
    }
}

function trim(str) {
    return str.toLowerCase().replace(/^[\s,.]+|[\s,.]+$/gm, '');
}

function* saveToAnki(text, translation) {
    try {
        yield anki.addNote(config.anki.deck, config.anki.model, {
            [config.anki.fields.text]: text,
            [config.anki.fields.translation]: translation
        });

        yield notify.message('Note saved successfully');
    } catch (err) {
        yield notify.error(err.message);
    }
}

ioHook.start();
