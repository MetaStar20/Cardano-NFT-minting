#!/bin/sh
# get Balance of utxo 
#                            TxHash                                 TxIx        Amount
# --------------------------------------------------------------------------------------
# 096078b6818350ab695391d322da326ec66ccf887b79798505cb8cdbf8e64378     0        100000000 lovelace
# 773a3dc6b870230135623e905459e22561fc77064642c48bc49c209e1ee9a419     0        100000000 lovelace
# e4839dd709a183eaf764bd5e65687b8cf59c86a19d0b3417c0775078e1591c5b     0        100000000 lovelace


#cardano-cli query utxo --address $1 --$NODE_CONFIG | sed -n 3p | awk '{print $3" ( "$4" )"}'
cardano-cli query utxo --address $1 --$NODE_CONFIG | sed 1,2d | awk '{print $3" "$4}' | awk '{total = total+$1}END{print total" "$2}'

