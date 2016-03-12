
# Architecture


There are several things going on here.

Systems:
* Channel Store / Wallet
* WebSocket Connection Pull
* Blockchain Network
* Social Media Notifications


Server:
* Open Channel Request -> Response with channel parameters.
* Funded Channel Request -> Verify UTXO -> Add UTXO -> Confirm UTXO.
* Payment Data -> Verify Transaction -> Confirm payment received.
* Channel Close Request -> Broadcast Transaction.
* Social Media Request -> Create Payment Request -> Store Payment Request

OPEN_REQUEST -> STORES_CHANNEL -> EMIT


channelRequests.subscribe()