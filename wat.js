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
                client.say(chan, from + ': ' + smileys[s]);
            }
        }
    });
}

var extensions = [reactToShouldHave, smiley];

function run()
{
    var client = new irc.Client(config.server, config.nick, {
        debug: true,
        channels: config.channels,
        userName: config.userName,
        realName: config.realName
    });

    for (var i = 0, e = extensions.length; i < e; ++i) {
        extensions[i](client);
    }
}

run()
