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

OP_IF <PUBKEY1> <PUBKEY2> 2 3 OP_CHECKMULTISIG_VERIFY
OP_ELSE <TIME> OP_CLTV OP_DROP <PUBKEY1> OP_CHECKSIG_VERIFY
OP_ENDIF


## Redeem Script 1 (multisig)
OP_TRUE <SIGNATURE> <SIGNATURE>


## Redeem Script 2 (timeout)
OP_FALSE BLOCK_HEIGHT <SIGNATURE>

