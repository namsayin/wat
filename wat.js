var irc = require('irc');
var config = require('./config');

// Replaces "should have" by "shuhao" in sentences people say
function reactToShouldHave(client)
{
    var rgx = ['should have', "should've", 'should of'];
    client.addListener('message', function (from, chan, message) {
        for (var i = 0; i < rgx.length; ++i) {
            var diff = message.replace(rgx[i], '*shuhao');
            if (diff !== message) {
                client.say(chan, from + ': ' + diff);
                break;
            }
        }
    });
}

// Reacts to messages containing only a smiley
function smiley(client)
{
    var base = {
        'o.o': 'O.O',
        'o.O': 'O.o',
        '-_-': 'T_T',
        ':)': ':D',
        '>_>': '<_<',
        'o.0': '0.o',
        '0.0': '\\o/'
    };
    var smileys = {}, rgx = {}
    function sanitizeRgx (t) {
        return t.replace('.', '\\.').replace(')', '\\)');
    }
    for (var s in base) {
        smileys[s] = base[s];
        smileys[base[s]] = s;
        rgx[s] = new RegExp(sanitizeRgx('^' + s + '$'));
        rgx[base[s]] = new RegExp(sanitizeRgx('^' + base[s] + '$'));
    }
    client.addListener('message', function(from, chan, message) {
        for (var s in rgx) {
            if (rgx[s].test(message)) {
                client.say(chan, smileys[s]);
                break;
            }
        }
        
        if (message.toLowerCase().indexOf("crepevine") !== -1) {
            client.say(chan, from + ': let\'s go. pool 5 min?');
        }
    });
}

function whatever(client)
{
    var quote = ['whatever', "it's fine", "rockband?", "pool?", "crepevine?", "club house?", 'big jumbo platter?', 'DUDE', 'wat', 'WAT'];
    var hater = ['webdev', 'firefox OS', 'indexeddb', 'PaaS', 'guitar', 'javascript'];
    client.addListener('message', function(from, chan, message) {
        if (from == 'Pwnna' || from == 'Punna' || from == 'Ponna') {
            if (Math.random() > 0.85) {
                client.say(chan, from + ': ' + quote[Math.floor(Math.random() * quote.length)]);
            } else if (Math.random() > 0.98) {
                var which = hater[Math.floor(Math.random() * hater.length)];
                client.say(chan, from + ': I hate ' + which + '. ' + which + " is too hard. I should just catch " + which + 'instead.');
            }
        }
    });
}

var extensions = [reactToShouldHave, smiley, whatever];

function run(names)
{
    var client = new irc.Client(config.server, names.nick, {
        debug: true,
        channels: config.channels,
        userName: names.userName,
        realName: names.realName,
        retryDelay: 120000
    });

    for (var i = 0, e = extensions.length; i < e; ++i) {
        extensions[i](client);
    }
}

function changeName()
{
    var names = ['john', 'mark', 'robert', 'rubber', 'patrick', 'wu', 'lulz', 'troll', 'wat'];
    var number = Math.floor(Math.random() * 255);
    var usedName = names[Math.floor(Math.random() * names.length)] + number;
    return {
        nick: usedName,
        userName: usedName,
        realName: usedName
    }
}

run(config);
process.on('uncaughtException', function(err) {
    var names = changeName();
    run(names);
});
