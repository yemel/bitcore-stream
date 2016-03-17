'use strict';

var bitcore = require('bitcore-lib');
var HDPrivateKey = bitcore.HDPrivateKey;

bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;

module.exports.LOCK_TIME_DELTA = 30; // Block
module.exports.SERVER_MIN_BALANCE = 800000; // Satoshis
module.exports.CLIENT_MIN_BALANCE = 2000000;
module.exports.MIN_TX_FEE = 150000;

module.exports.CLIENT_CHANNEL_BALANCE = 500000;
module.exports.SERVER_CHANNEL_BALANCE = 400000;


module.exports.senderPrivkey = new HDPrivateKey('tprv8ZgxMBicQKsPf3TTSUjcoqrRhzpw2RUD3jjp7WhiYiFphZ8Cbf9QketFtG3pXviZ57PAkHZzWqwy6kBhb5VVaMH5FqQFZ8NRJ2i8MdJiJE4')
module.exports.serverPrivkey = new HDPrivateKey('tprv8ZgxMBicQKsPf1eimndX2DGkWF4U16Aeu5tX6nuQ8zVFjC6RW3HES3Le1vXJgEyNyabfpNETMTZ2KxS237fkZ9LYkHKut1ygSSAiBEE87gn')
module.exports.receiverPrivkey = new HDPrivateKey('tprv8ZgxMBicQKsPeyeUtkX5pc6EVGtq5ddbEKMGJ75MMCcV9g8oaKsJCA9bXu1ZnYTEx8Dit7ZesYNdaHjLZv9qdAMGNPvk1JuhqECvHc6cur6')
