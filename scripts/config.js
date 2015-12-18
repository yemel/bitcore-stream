'use strict';

var bitcore = require('bitcore-lib');
var PrivateKey = bitcore.PrivateKey;
var Address = bitcore.Address;

bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;

module.exports.LOCK_UNTIL_BLOCK = 626816;

module.exports.senderPrivkey = new PrivateKey('3e05cfe5b6feabed18b14816925067a3e414f4aaab3192aecd3b95a9f7f5434e')
module.exports.senderPubkey = module.exports.senderPrivkey.toPublicKey();

module.exports.receiverPrivkey = new PrivateKey('e2540c54bedf9b1d455edb4a2aed83c250148194eb44fb965fdba66c5b86ac2a')
module.exports.receiverPubkey = module.exports.receiverPrivkey.toPublicKey();

module.exports.refundAddress = new Address('mnhDieWznFmaE32zwowJJz65PgTPr2aVEw');