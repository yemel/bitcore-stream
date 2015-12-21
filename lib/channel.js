'use strict';

var bitcore = require('bitcore-lib');
var Networks = bitcore.Networks;
var PrivateKey = bitcore.PrivateKey;
var Address = bitcore.Address;

var HOURS_IN_DAY = 24;
var MINUTES_IN_HOUR = 60;
var SECONDS_IN_MINUTE = 60;

var ONE_DAY = SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY;

var STATUS = {
  NEW: 'new',
  OPEN: 'open',
  CLOSING: 'closing',
  CLOSED: 'closed',
  EXPIRED: 'expired'
}

function SenderChannel(opts) {
  if (!(this instanceof SenderChannel)) {
    return new SenderChannel(opts);
  }

  opts = opts || {};

  // Validate Required Args
  // Validate Network Compatibility

  this.network = Networks.get(opts.network || 'livenet');
  this.expiration = opts.expiration || Math.round(new Date().getTime() / 1000) + ONE_DAY;
  this.privateKey = new PrivateKey(opts.privateKey);
  this.fundingAddress = null;

  if (opts.refundAddress) {
    this.refundAddress = new Address(opts.refundAddress);
  } else {
    this.refundAddress = this.privateKey.toAddress();
  }

  this.balance = 0;
  this.status = STATUS.NEW;
}


SenderChannel.prototype.inspect = function() {
  return '<SenderChannel: ' + this.status + '>';
};

module.exports = SenderChannel;
