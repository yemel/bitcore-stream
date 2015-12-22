'use strict';

var bitcore = require('bitcore-lib');
var SenderChannel = require('./lib/channel').SenderChannel;
var ReceiverChannel = require('./lib/channel').ReceiverChannel;


// === CLIENT ====
var channel = SenderChannel();

channel.id;
channel.balance;
channel.expiration;
channel.status; // new, open, closing, closed, expired
channel.fundingAddress;

channel.fund(utxo);
channel.pay(100, {data: 'some_data'});
channel.close(); // naming

channel.on('connected', {});
channel.on('disconnected', {});

channel.on('open', {});
channel.on('charge', {});
channel.on('expired', {});
channel.on('closed', {});


// === SERVER ====
var channel = ReceiverChannel();

channel.id;
channel.balance;
channel.expiration;
channel.status;
channel.fundingAddress;

channel.charge(100, {data: 'some_data'});
channel.close();

channel.on('connected', {});
channel.on('disconnected', {});

channel.on('open');
channel.on('payment');
channel.on('expired');
channel.on('closing');
channel.on('closed');


// === Connection ===

var channel = Channel(socket);
channel.connect(socket);




