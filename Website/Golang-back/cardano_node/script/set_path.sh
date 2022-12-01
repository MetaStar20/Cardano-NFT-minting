#!/bin/sh

## set global path

echo "Set global path.............. \n "

## set local path because we can't use Env path that just define here.
back_path=$HOME/Downloads/cardano/website/backend
node_home_path=$back_path/cardano_node
# set tesnet or mainnet(--testnet-magic 1097911063, --mainnet, use this as prefix)
echo export NODE_CONFIG=testnet-magic 1097911063 >> $HOME/.bashrc


echo PATH="$HOME/.local/bin:$PATH" >> $HOME/.bashrc

echo export LD_LIBRARY_PATH="/usr/local/lib:$LD_LIBRARY_PATH" >> $HOME/.bashrc

echo export PKG_CONFIG_PATH="/usr/local/lib/pkgconfig" >> $HOME/.bashrc

## set cardano node path.

echo export BACKEND_PATH=$back_path >> $HOME/.bashrc

echo export NODE_HOME=$node_home_path >> $HOME/.bashrc

## we need to export the specific socket path to variable CARDANO_NODE_SOCKET_PATH
echo export CARDANO_NODE_SOCKET_PATH=$node_home_path/db/socket >> $HOME/.bashrc

# goLang Backend GIn_MODE set
echo export GIN_MODE=release >> $HOME/.bashrc



