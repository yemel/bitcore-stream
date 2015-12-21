
var bitcore = require('bitcore-lib');
var SenderChannel = require('../lib/channel');


var privateKey = new bitcore.PrivateKey();

var channel = new SenderChannel({
    privateKey: privateKey
});

console.log(channel);
console.log('Balance', channel.balance);
console.log('Status', channel.status);
console.log('Expiration', channel.expiration);
