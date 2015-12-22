'use strict';

var _ = require('lodash');
var bitcore = require('bitcore-lib');

var BN = bitcore.crypto.BN;
var PublicKey = bitcore.PublicKey;
var Transaction = bitcore.Transaction;
var Script = bitcore.Script;
var $ = bitcore.util.preconditions;

/**
* Create an output script to fund a payment channel.
*
* @param {PublicKey} sender's public key
* @param {PublicKey} receiver's public key
* @param {Number} height
* @return {Script} a an output script requiring both sender and receiver public keys,
*   or just the sender's one after a given block height
*/
function buildFundingScript(senderPubkey, receiverPubkey, height) {
  // Validate public keys
  $.checkArgumentType(senderPubkey, PublicKey);
  $.checkArgumentType(receiverPubkey, PublicKey);

  // Validate block height
  $.checkArgument(_.isNumber(height));
  // $.checkArgument(height < Transaction.NLOCKTIME_BLOCKHEIGHT_LIMIT);

  return Script.empty()
    .add('OP_IF')
      .add('OP_2')
      .add(senderPubkey.toBuffer())
      .add(receiverPubkey.toBuffer())
      .add('OP_2')
      .add('OP_CHECKMULTISIG')
    .add('OP_ELSE')
      .add(BN.fromNumber(height).toScriptNumBuffer())
      .add('OP_CHECKLOCKTIMEVERIFY').add('OP_DROP')
      .add(senderPubkey.toBuffer())
      .add('OP_CHECKSIG')
    .add('OP_ENDIF');
}

function buildFundingAddress(senderPubkey, receiverPubkey, height) {
  // TODO: Apply network
  var redeemScript = buildFundingScript(senderPubkey, receiverPubkey, height);
  return redeemScript.toScriptHashOut().toAddress(senderPubkey.network);
}

function buildSpendingTx(utxo, sender, receiver, amount) {
  return new Transaction().from(utxo).to(receiver, amount).change(sender).fee();
}

module.exports.buildFundingScript = buildFundingScript;
module.exports.buildFundingAddress = buildFundingAddress;

