'use strict';

// Get some funds

var bitcore = require('bitcore-lib');
var Insight = require('bitcore-explorers').Insight;

var bitcoreStream = require('../../lib/utils');
var config = require('./0-config');


var fundingAddress = config.serverPrivkey.derive('m/0/0').privateKey.toAddress();


var insight = new Insight(bitcore.Networks.defaultNetwork);
insight.getUnspentUtxos(fundingAddress, function(err, utxos) {
    if (err) utxos = [];

    var balance = utxos.reduce((total, x) => total + x.satoshis, 0);

    if (balance < config.SERVER_MIN_BALANCE) {
        var requiredBTC = bitcore.Unit.fromSatoshis(config.SERVER_MIN_BALANCE - balance).toBTC() + ' BTC';
        console.log('Server needs at least', requiredBTC);
        console.log('Please send', requiredBTC, 'to:', fundingAddress.toString());
    } else {
        console.log('We have enough money for the Server (', bitcore.Unit.fromSatoshis(balance).toBTC(), 'BTC )');
    }
});

