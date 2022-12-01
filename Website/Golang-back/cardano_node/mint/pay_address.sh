#!/bin/sh

### First of all we need to create a payment key set (Verification and signing).

if [ ! -f "$NODE_HOME/mint/payment.addr" ];
then
    cardano-cli address key-gen --verification-key-file $NODE_HOME/mint/payment.vkey \
							--signing-key-file $NODE_HOME/mint/payment.skey

	cardano-cli address build --payment-verification-key-file $NODE_HOME/mint/payment.vkey \
	                      --out-file $NODE_HOME/mint/payment.addr \
	                      --$NODE_CONFIG
fi

address=$(cat $NODE_HOME/mint/payment.addr)

echo $address

#cardano-cli query utxo --address $address --$NODE_CONFIG