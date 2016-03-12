'use strict'

var bitcore = require('bitcore-lib');
var $ = bitcore.util.preconditions;


/* Message Flow Example

// PROTOCOL: WEBSOCKETS

// CLIENT :: Request to open a channel
{
    command: 'open_channel_request',
    payload: {
        network: 'livenet',
        public_key: '03bb3c511621f39cc07d6e2e901067225071a8d0e540c22d4528d85e86473e9227',
    }
}

// SERVER :: Responses with channel parameters
{
    command: 'open_channel',
    payload: {
        relative_locktime: 391626,
        public_key: '02f31a3b7952499d38351e853ad4c90eb721351b7e3f034a4a80dcc80d9dae6de1',
        final_address: '1GoiTY9WHcZL8UHD6yLLCSjCBYAscHkCiA',
        min_depth: 3,
        close_fee: 2000
    }
}

// CLIENT :: The Channel has been funded
{
    command: 'open_anchor',
    payload: {
        txid: 'fc070b01262df4af111bb1d2e49faa5877426eecd20dac7df20858edd7ef9a0f',
        output_index: 2,
        amount: 40000,
        commitment_sig: '3045022100b1a954d3acedf4f461c4336180cff6b3aa945c9175e4948d47663f8474c49c7802202800182de810f6a52ff39eb9eb5afd3867a372c4192740ac7d7d788d2796e2ac'
    }
}

// SERVER :: Confirm the channel is open
{
    command: 'open_complete',
    payload: {
        block_id: '000000000000000005045d776f86ff5976dd24808e19ed71cb9166c0a7e4a9bd'
    }
}

// SERVER :: Payment Request
{
    command: 'payment_request',
    payload: {
        id: '12312321',
        amount: 200,
        amount_display: '$3 USD',
        moniker: 'beer',
        destination: '@bitmapped',
        network: 'twitter',
        url: 'https://twitter.com/JVWVU1/status/680158684987658240',
    }
}

// CLIENT :: Update Balance
{
    command: 'send_payment',
    payload: {
        id: '12312321',
        refund_address: '1PjppcWq3pZNMW6YxSVLvcVHJMXaVNj3SK',
        signature: '3045022100b1a954d3acedf4f461c4336180cff6b3aa945c9175e4948d47663f8474c49c7802202800182de810f6a52ff39eb9eb5afd3867a372c4192740ac7d7d788d2796e2ac'
    }
}

// CLIENT :: Confirm payment
{
    command: 'send_payment_ack',
    payload: {
        id: '1231232132',
    }
}

// SERVER :: Try to open a new channel
{
    command: 'send_payment_ack',
    payload: {
        id: '1231232132',
    }
}



// UI FLOW

* Write down your mnemonic
* Add balance (USD/BTC) - QR
* 




/* List of commands
* Hello
* Ping
*/




/* Parameters of Lighting Network
message open_channel
    locktime_value
    locktime_type // block or seconds
    commit_key // to send the funds
    final_key // to
    min_depth // anchor buried to consider channel live
    commitment_fee // 

message open_anchor
    txid = 1;
    output_index = 2;
    amount = 3;
    commit_sig = 4;

message open_complete
    block_id

message update
    delta_msat = 2;
    signature

message close_channel

message close_channel_complete

message error
    problem



* funding = how much we will charge?

*/



function Message(options) {
  this.command = options.command;
  this.network = options.network;
}


Message.prototype.toBuffer = Message.prototype.serialize = function() {
  $.checkState(this.network, 'Need to have a defined network to serialize message');
  var commandBuf = new Buffer(Array(12));
  commandBuf.write(this.command, 'ascii');

  var payload = this.getPayload();
  var checksum = Hash.sha256sha256(payload).slice(0, 4);

  var bw = new BufferWriter();
  bw.write(this.network.networkMagic);
  bw.write(commandBuf);
  bw.writeUInt32LE(payload.length);
  bw.write(checksum);
  bw.write(payload);

  return bw.concat();
};
