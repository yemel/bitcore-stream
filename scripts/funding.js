'use strict';

// Get Funding Address

var bitcore = require('bitcore-lib');
var PrivateKey = bitcore.PrivateKey;

var bitcoreStream = require('../lib/utils');
var config = require('./config');

var redeemScript = bitcoreStream.buildFundingScript(
    config.senderPubkey,
    config.receiverPubkey,
    config.LOCK_UNTIL_BLOCK
);

var script = redeemScript.toScriptHashOut();
var address = script.toAddress();

console.log('Funding Address:', address.toString());
console.log('Funding Script Hash:', address.hashBuffer.toString('hex'));
console.log('Redeem Script\n', redeemScript.toString());

module.exports.address = address;
module.exports.redeemScript = redeemScript;
