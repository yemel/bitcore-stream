Payment Channel implementation for Bitcore


Requirements:


# Initialization Flow:

* Client generates a private key
* Client requests Server for a public key
* Client build the payment script (\*)
* Client send funds to that payment script
* Client notifies server of payment
* Server confirms

##  Payment Script

OP_IF
    <PUBKEY1> <PUBKEY2> 2 3 OP_CHECKMULTISIGVERIFY
OP_ELSE 
    <TIME> OP_CLTV OP_DROP
    <PUBKEY1> OP_CHECKSIGVERIFY
OP_ENDIF


## Redeem Script 1 (multisig)
OP_TRUE <SIGNATURE> <SIGNATURE>


## Redeem Script 2 (timeout)
OP_FALSE BLOCK_HEIGHT <SIGNATURE>


Goals

* Craft payment address
* 



Mini-goals:
* PR to bitcore: OP_NOP2 -> OP_CHECKLOCKTIMEVERIFY (in Script.toString())