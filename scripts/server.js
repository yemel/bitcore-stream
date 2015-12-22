'use strict';

var _ = require('lodash');
var bitcore = require('bitcore-lib');
var bitcoreStream = require('../lib/utils');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var state = {};

io.on('connection', function(socket) {
  console.log('a user connected', socket.id);


  // Event: HELLO
  // Description: Request for creating a payment channel
  // Result: Emit OPEN with our pubkey and funding address
  socket.on('hello', function(data) {
    console.log('hello', data);

    state.params = {};
    state.params.network = bitcore.Networks.get(data.network);
    state.params.expiration = data.expiration;

    state.keys = {};
    state.keys.senderPubkey = new bitcore.PublicKey(data.senderPubkey, {network: state.params.network});
    state.keys.receiverPrivkey = new bitcore.PrivateKey('e2540c54bedf9b1d455edb4a2aed83c250148194eb44fb965fdba66c5b86ac2a', state.params.network);

    state.fundingAddress = bitcoreStream.buildFundingAddress(
        state.keys.senderPubkey,
        state.keys.receiverPrivkey.publicKey,
        state.params.expiration
    )

    socket.emit('open', {
        receiverPubkey: state.keys.receiverPrivkey.publicKey.toString(),
        fundingAddress: state.fundingAddress.toString()
    });

  });

  // Event: FUNDED
  // Description: A new UTXO has been added
  // Result: Validate them, waits for confirmation and emits confirmed list.
  socket.on('funded', function(data) {
    console.log('funded', data);

    // TODO: Validate and confirm UTXO

    state.utxos = {};
    state.utxos.pending = [];
    state.utxos.confirmed = data.utxos.map(function(utxo) {
        return bitcore.Transaction.UnspentOutput.fromObject(utxo);
    });

    socket.emit('confirmed', {
        utxos: state.utxos.confirmed.map(function(utxo) { return utxo.toJSON(); })
    });

  });

});

http.listen(3000, function() {
  console.log('listening on *:3000');
});


/*

HARDCORD PROTOTYPE

* BUILD IT VERY QUICK
* GOAL: HAVE AN IDEA ABOUT OF THE NETWORK HANDSHAKE
* NO CLASSES.


HELLO: CLIENT CHANNEL PARAMS
OPEN: SERVER CHANNEL PARAMS
FUND: CLIENT UTXO
PAY:

*/ 


// CLIENT => <HELLO:PUBKEY:SIGNATURE>
// SERVER => <HELLO:PUBKEY:SIGNATURE>
// 