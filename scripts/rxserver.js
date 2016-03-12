'use strict';

var Rx = require('rx')

var _ = require('lodash')
var bitcore = require('bitcore-lib')
var bitcoreStream = require('../lib/utils')


var connectionStream = Rx.Observable.create(observer => {
  var app = require('express')()
  var http = require('http').Server(app)
  var io = require('socket.io')(http)
  
  io.on('connection', socket => observer.onNext(socket))
  http.listen(3000, () => console.log('listening on *:3000'))

  return () => http.close()
})

// var messageStream = connectionStream.flatMap()

function getMessageStream(socket, event) {
  return Rx.Observable.create(observer => {
    socket.on(event, data => observer.onNext({
      type: event,
      data: data,
    }))
  })
}

function logMessage(message) {
  console.log('===', message.type, '===')
  console.log(message.data)
  console.log('\n')
}


connectionStream.subscribe(socket => {
  console.log('a user connected', socket.id)

  var state = {}

  // Supported Messages
  var helloStream = getMessageStream(socket, 'hello')
  var fundingStream = getMessageStream(socket, 'funded')
  var paymentStream = getMessageStream(socket, 'payment')
  var closeRequestStream = getMessageStream(socket, 'close')
  var disconnectStream = getMessageStream(socket, 'disconnect')

  // helloStream.subscribe(logMessage)
  // helloStream
  //   .map(Messages.decrypt)
  //   .map(Messages.logMessage)
  //   .map(Messages.Hello.fromObject)
  //   .zip(Channel.pull.getState)

  helloStream.tap(logMessage).subscribe(message => {
    // Validate Message Hello

    // Marshaling
    var network = bitcore.Networks.get(message.data.network)
    var expiration = message.data.expiration
    var senderPubkey = new bitcore.PublicKey(message.data.senderPubkey, {network: network})

    // State Handling
    state.network = network
    state.expiration = expiration;
    state.senderPubkey = senderPubkey
    state.receiverPrivkey = new bitcore.PrivateKey('e2540c54bedf9b1d455edb4a2aed83c250148194eb44fb965fdba66c5b86ac2a', state.network)
    state.fundingAddress = bitcoreStream.buildFundingAddress(state.senderPubkey, state.receiverPrivkey.publicKey, state.expiration)

    // Emmit Response  --> TODO: Make it an exit stream
    socket.emit('open', {
        receiverPubkey: state.receiverPrivkey.publicKey.toString(),
        fundingAddress: state.fundingAddress.toString()
    })
  })


  fundingStream.tap(logMessage).subscribe(message => {

    // Marshaling
    var utxos = message.data.utxos.map(utxo => {
        return bitcore.Transaction.UnspentOutput.fromObject(utxo)
    })

    state.utxos = {}
    state.utxos.pending = []
    state.utxos.confirmed = []

    socket.emit('confirmed', {
        utxos: state.utxos.confirmed.map(function(utxo) { return utxo.toJSON(); })
    });
  })

  disconnectStream.subscribe(logMessage)

});


/*
Playing with RxJX

InBound
> HELLO, FUND, PAY, CLOSE

OutBound
> OPEN, CONFIRM, PAY-REQ, CLOSE


Pending Concerns:
* Encryption
* Package Validations // Serialization
* Return Errors

Message:
{TYPE: HELLO, DATA: {}, SIGNATURE: ''}


*/
