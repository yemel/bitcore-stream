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
