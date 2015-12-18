'use strict';

var bitcore = require('bitcore-lib');
var Insight = require('bitcore-explorers').Insight;

var config = require('./config');
var funding = require('./funding');

var Address = bitcore.Address;
var Transaction = bitcore.Transaction;
var Signature = bitcore.crypto.Signature;
var Script = bitcore.Script;


// Spending Bitcoin Test

var insight = new Insight();

insight.getUnspentUtxos(funding.address, function(err, utxos) {
  if (err || utxos.length == 0) throw new Error('No UTXOs available for ' + funding.address);

  var utxo = utxos[0];
  console.log('Using UTXO:', utxo);

  // Cooperative Transaction

  var coopTransaction = new Transaction().from({
    txid: utxo.txId,
    vout: utxo.outputIndex,
    scriptPubKey: utxo.script,
    satoshis: utxo.satoshis,
  })
  .to(config.refundAddress, utxo.satoshis - 10000); // 100000

  var senderSig = Transaction.sighash.sign(coopTransaction, config.senderPrivkey, Signature.SIGHASH_ALL, 0, funding.redeemScript);
  var receiverSig = Transaction.sighash.sign(coopTransaction, config.receiverPrivkey, Signature.SIGHASH_ALL, 0, funding.redeemScript);

  coopTransaction.inputs[0].setScript(
    Script.empty()
      .add('OP_0')
      .add(senderSig.toTxFormat())
      .add(receiverSig.toTxFormat())
      .add('OP_TRUE') // choose the multisig path
      .add(funding.redeemScript.toBuffer())
  );

  console.log('\n\nCooperative Transaction');
  console.log(coopTransaction.serialize(true));


  // Timeout Transaction

  var timeTransaction = new Transaction().from({
    txid: utxo.txId,
    vout: utxo.outputIndex,
    scriptPubKey: utxo.script,
    satoshis: utxo.satoshis,
  })
  .to(config.refundAddress, utxo.satoshis - 10000) // 100000
  .lockUntilBlockHeight(config.LOCK_UNTIL_BLOCK);

  var signature = Transaction.sighash.sign(timeTransaction, config.senderPrivkey, Signature.SIGHASH_ALL, 0, funding.redeemScript);

  timeTransaction.inputs[0].setScript(
    Script.empty()
      .add(signature.toTxFormat())
      .add(config.senderPrivkey.toPublicKey().toBuffer())
      .add(funding.redeemScript.toBuffer())
  );

  console.log('\n\nTimeout Transaction');
  console.log(coopTransaction.serialize(true));

});
