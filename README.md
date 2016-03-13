# Bitcore Stream

Bidirectional payment channels for Bitcore.


# Sender API

```javascript
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
```


# Sender API

```javascript
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
```


# Payment Channel

##  Payment Script
```
OP_IF
    2 <PUBKEY1> <PUBKEY2> 2 OP_CHECKMULTISIG
OP_ELSE
    <TIME> OP_CLTV OP_DROP
    <PUBKEY1> OP_CHECKSIG
OP_ENDIF
```

## Redeem Script 1 (multisig)
```
OP_TRUE <SIGNATURE1> <SIGNATURE2> OP_0
```

## Redeem Script 2 (timeout)
```
OP_FALSE <SIGNATURE1>
```

# HTLC Channel
Payment channel that allows proxy payments through it.

## Open Transaction

![Open Transaction](/images/open_tx.png?raw=true "Open transaction")

**Inputs:** UTXOs from A and B to fund the channel.

**Output 1:** A change address
```
OP_DUP OP_HASH160 <PUBKEY_HASH_A> OP_EQUALVERIFY OP_CHECKSIG
```

**Output 2:** B change address
```
OP_DUP OP_HASH160 <PUBKEY_HASH_B> OP_EQUALVERIFY OP_CHECKSIG
```

**Output 3:** A Channel Balance - Multisig or only A after 30 days.
```
OP_IF
    2 <PUBKEY_A> <PUBKEY_B> 2 OP_CHECKMULTISIG
OP_ELSE
    <30DAYS> OP_CLTV OP_DROP
    <PUBKEY_A> OP_CHECKSIG
OP_ENDIF
```

**Output 4:** B Channel Balance - Multisig or only B after 30 days.
```
OP_IF
    2 <PUBKEY_A> <PUBKEY_B> 2 OP_CHECKMULTISIG
OP_ELSE
    <30DAYS> OP_CLTV OP_DROP
    <PUBKEY_B> OP_CHECKSIG
OP_ENDIF
```

**API**
```javascript
// Client side
var EXPIRATION = 80000; // Block Height

var utxos = [...];
var utxosPrivateKeys = [...];

var privKey = new bitcore.PrivateKey('...');
var pubKey = privKey.publicKey;
var inputBalance = utxos.reduce(x, total => x.amount + total, 0)
var channelBalance = 30000;

var otherPubkey = new bitcore.PublicKey('...');
var otherChannelBalance = 30000;
var otherChange = 10000;

var channelAddress = channelScript(pubKey, otherPubkey, EXPIRATION).toScriptHashOut().toAddress();
var otherChannelAddress = channelScript(otherPubkey, pubkey, EXPIRATION).toScriptHashOut().toAddress();

var openTransaction = new Transaction()
    .from(utxos)
    .to(myPrivKey.toAddress(), inputBalance - channelBalance)
    .to(otherPubkey.toAddress(), otherChange)
    .to(channelAddress, channelBalance)
    .to(otherChannelAddress, otherChannelBalance)
    .sign(utxosPrivateKeys)

var serialized = openTransaction.toObject();

function channelScript(pubkey1, pubkey2, height) {
    var sortedPubkeys = [pubkey1, pubkey2].sort(function(k1, k2) {
        return k1.toString() > k2.toString() ? 1 : -1;
    }));

    return Script.empty()
        .add('OP_IF')
          .add('OP_2')
          .add(sortedPubkeys[0].toBuffer())
          .add(sortedPubkeys[1].toBuffer())
          .add('OP_2')
          .add('OP_CHECKMULTISIG')
        .add('OP_ELSE')
          .add(BN.fromNumber(height).toScriptNumBuffer())
          .add('OP_CHECKLOCKTIMEVERIFY').add('OP_DROP')
          .add(pubkey1.toBuffer())
          .add('OP_CHECKSIG')
        .add('OP_ENDIF');
}

// Server side
var utxos = [...];
var utxosPrivateKeys = [...];

var privKey = new bitcore.PrivateKey('...');

var openTransaction = Transaction.fromObject(serialized)
    .from(utxos)
    .signed(utxosPrivateKeys)

assert(openTransaction.isFullySigned())
```


# Credits

* HTLC channel design and images from Mats Jerratsch's [Thunder Network](https://matsjj.github.io/).
* Thanks to [Esteban Ordano](https://github.com/eordano) for peer review and a lifetime building things together.
* Thanks to all contributors of [bitcore.io](https://bitcore.io) and [streamium.io](https://stramium.io).


