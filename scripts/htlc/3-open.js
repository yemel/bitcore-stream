'use strict';

// Get some funds
var request = require('request');

var bitcore = require('bitcore-lib');
var Insight = require('bitcore-explorers').Insight;
var Signature = bitcore.crypto.Signature;

var bitcoreStream = require('../../lib/utils');
var config = require('./0-config');


var clientFundingAddress = config.senderPrivkey.derive('m/0/0').privateKey.toAddress();
var serverFundingAddress = config.serverPrivkey.derive('m/0/0').privateKey.toAddress();

var insight = new Insight(bitcore.Networks.defaultNetwork);
insight.getUnspentUtxos(clientFundingAddress, function(err, clientUtxos) {
    if (err || clientUtxos.length == 0) throw Error('No funds for client');

    insight.getUnspentUtxos(serverFundingAddress, function(err, serverUtxos) {
        if (err || serverUtxos.length == 0) throw Error('No funds for server');
        
        var urls = 'https://api.blockcypher.com/v1/btc/' + (bitcore.Networks.defaultNetwork.name == 'testnet' ? 'test3' : 'main');
        request.get({url: 'https://api.blockcypher.com/v1/btc/test3', json: true}, function(e, b, data) {
            openChannel(clientUtxos, serverUtxos, data.height);
        });
    });
});

function openChannel(clientUtxos, serverUtxos, blockHeight) {
    // Signing Key
    var clientPrivkey = config.senderPrivkey.derive('m/0/0').privateKey;

    // Change Outputs
    var clientChange = config.senderPrivkey.derive('m/0/1').privateKey.toAddress();
    var serverChange = config.serverPrivkey.derive('m/0/1').privateKey.toAddress();

    var clientBalance = clientUtxos.reduce((total, x) => total + x.satoshis, 0);
    var serverBalance = serverUtxos.reduce((total, x) => total + x.satoshis, 0);

    var clientChangeAmount = clientBalance - config.CLIENT_CHANNEL_BALANCE - config.MIN_TX_FEE;
    var serverChangeAmount = serverBalance - config.SERVER_CHANNEL_BALANCE;

    // Channel Outputs
    var clientPubkey = config.senderPrivkey.derive('m/1/0').privateKey.publicKey;
    var serverPubkey = config.serverPrivkey.derive('m/1/0').privateKey.publicKey;

    var clientChannelAddress = channelScript(clientPubkey, serverPubkey, blockHeight).toScriptHashOut().toAddress();
    var serverChannelAddress = channelScript(serverPubkey, clientPubkey, blockHeight).toScriptHashOut().toAddress();

    // This Tx is generated on client side, serialized and sent to the server.
    var openTx = new bitcore.Transaction()
        .from(clientUtxos)
        .to(clientChange, clientChangeAmount)
        .to(serverChange, serverChangeAmount)
        .to(clientChannelAddress, config.CLIENT_CHANNEL_BALANCE)
        .to(serverChannelAddress, config.SERVER_CHANNEL_BALANCE)
        .sign(clientPrivkey, Signature.SIGHASH_ALL | Signature.SIGHASH_ANYONECANPAY)


    // The server completes the transaction
    var serverPrivkey = config.serverPrivkey.derive('m/0/0').privateKey;
    openTx
        .from(serverUtxos)
        .sign(serverPrivkey)

    broadcastTx(openTx);
}

function channelScript(pubkey1, pubkey2, height) {
  var sortedPubkeys = [pubkey1, pubkey2].sort(function(k1, k2) {
    return k1.toString() > k2.toString() ? 1 : -1;
  });

  return bitcore.Script.empty()
    .add('OP_IF')
      .add('OP_2')
      .add(sortedPubkeys[0].toBuffer())
      .add(sortedPubkeys[1].toBuffer())
      .add('OP_2')
      .add('OP_CHECKMULTISIG')
    .add('OP_ELSE')
      .add(bitcore.crypto.BN.fromNumber(height).toScriptNumBuffer())
      .add('OP_CHECKLOCKTIMEVERIFY').add('OP_DROP')
      .add(pubkey1.toBuffer())
      .add('OP_CHECKSIG')
    .add('OP_ENDIF');
}

function broadcastTx(transaction) {
    request.post({
        url: 'https://api.blockcypher.com/v1/btc/test3/txs/push',
        body: {tx: transaction.serialize()},
        json: true
    }, function(err, resp, data) {
        if (err) {
            console.log('Error broadcasting tx:', resp);
        } else {
            var url = 'https://live.blockcypher.com/btc-testnet/tx/' + data.tx.hash;
            console.log('Transaction has been broadcasted', data.tx.hash);
        }
    });
}