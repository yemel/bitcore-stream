var bitcore = require('bitcore-lib');
var Insight = require('bitcore-explorers').Insight;

var hdkey = bitcore.HDPrivateKey.fromString('xprv9s21ZrQH143K2f1h6EitwQqsaujnzvVQ8c2nsVt9MmgXS7RWjw68YQdqtW6xUYFTN8QXcHB3obEgsiL1icLRbcVKTkfAafZ2KHs6m3trBWD');


var insight = new Insight();

var privateKey = hdkey.derive(1).privateKey;
var changeAddress = hdkey.derive(100).privateKey.toAddress();

var fakePayment = '1L8bCB3nHLgEEDsZyYdxYRRWFiqpN4VTnp';
var fakeAmount = 5430000;

insight.getUnspentUtxos(privateKey.toAddress(), function(err, utxos) {
  console.log('Address 1', privateKey.toAddress().toString());
  if (err || utxos.length === 0) return console.log('Address 1', privateKey.toAddress().toString(), 'No funding yet!');

  var tx = bitcore.Transaction().from(utxos).to(fakePayment, 1000).change(changeAddress).addData('xD').fee(0);
  tx.sign(privateKey);

  console.log('Payment Tx 1', tx.isFullySigned());
  console.log(tx.serialize(true));

  var tx2 = bitcore.Transaction().from(utxos).change(changeAddress).fee(20000);
  tx.sign(privateKey);

  console.log('Payment Tx 2', tx2.isFullySigned());
  console.log(tx2.serialize(true));

});


// console.log('Address 2', hdkey.derive(2).privateKey.toAddress().toString());
// console.log('Address 3', hdkey.derive(3).privateKey.toAddress().toString());
// console.log('Address 4', hdkey.derive(4).privateKey.toAddress().toString());
// console.log('Address 5', hdkey.derive(5).privateKey.toAddress().toString());
// console.log('Address 6', hdkey.derive(6).privateKey.toAddress().toString());
// console.log('Address 7', hdkey.derive(7).privateKey.toAddress().toString());
// console.log('Address 8', hdkey.derive(8).privateKey.toAddress().toString());
// console.log('Address 9', hdkey.derive(9).privateKey.toAddress().toString());
// console.log('Address 10', hdkey.derive(10).privateKey.toAddress().toString());

