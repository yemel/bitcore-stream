'use strict';

var _ = require('lodash');
var bitcore = require('bitcore-lib');
var bitcoreStream = require('../lib/utils');
var Insight = require('bitcore-explorers').Insight;

var socket = require('socket.io-client')('http://localhost:3000');

var state = {};
var UTXO = [bitcore.Transaction.UnspentOutput.fromObject({
  address: '2MxuSvjesue263L2sdQoqQckhDcvBvjibou',
  txid: 'db21a8ab8790f8282b3614bed501ee881ba368b773ee939dd7277c6bb29d76c6',
  vout: 0,
  scriptPubKey: 'a9143e133c7b88fdc464766a7e0bd48d4969047d9ca087',
  amount: 0.003
})]



socket.on('connect', function(){
    console.log('I am connected, sending hello');

    state = {};

    state.params = {};
    state.params.network = bitcore.Networks.get('testnet');
    state.params.expiration = 1450881924; // ONE_DAY

    state.keys = {};
    state.keys.senderPrivkey = new bitcore.PrivateKey('3e05cfe5b6feabed18b14816925067a3e414f4aaab3192aecd3b95a9f7f5434e', state.params.network);

    socket.emit('hello', {
        senderPubkey: state.keys.senderPrivkey.publicKey.toString(),
        expiration: state.params.expiration,
        network: state.params.network.name
    });
});

socket.on('open', function(data){
    console.log('Open', data);

    state.keys.receiverPubkey = new bitcore.PublicKey(data.receiverPubkey, {network: state.params.network});
    state.fundingAddress = new bitcore.Address(data.fundingAddress);

    // TODO: Validate Funding Address is OK
    console.log('Waiting for funds on', state.fundingAddress.toString());

    // var insight = new Insight(state.params.network);
    // insight.getUnspentUtxos(state.fundingAddress, function(err, utxos) {
        // if (err || utxos.length == 0) {
        //     throw new Error('No UTXOs available for ' + state.fundingAddress);
        // }
        var utxos = UTXO;

        state.utxos = {};
        state.utxos.pending = utxos;
        state.utxos.confirmed = [];

        console.log('The channel has been funded');

        socket.emit('funded', {
            utxos: state.utxos.pending.map(function(utxo) { return utxo.toJSON(); })
        });
    // });
});

socket.on('confirmed', function(data) {
    console.log('Confirmed', data);

    state.utxos.pending = [];
    state.utxos.confirmed = data.utxos.map(function(utxo) {
        return bitcore.Transaction.UnspentOutput.fromObject(utxo);
    });

    var balance = state.utxos.confirmed.reduce(function(total, utxo){ return total + utxo.satoshis; }, 0);
    console.log('Balance confirmed', balance);

    // Init first payment

});

socket.on('disconnect', function(){
    console.log('Disconnect!');
});


// FUND -> UTXO
// UTXO-ACK

// UTXO
// { address: '2MxuSvjesue263L2sdQoqQckhDcvBvjibou',
//   txid: 'db21a8ab8790f8282b3614bed501ee881ba368b773ee939dd7277c6bb29d76c6',
//   vout: 0,
//   scriptPubKey: 'a9143e133c7b88fdc464766a7e0bd48d4969047d9ca087',
//   amount: 0.003 }


