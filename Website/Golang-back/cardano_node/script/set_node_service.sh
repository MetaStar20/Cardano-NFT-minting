#!/bin/sh
## Register cardno node start up service.

echo "Register cardano node startup service.............. \n"

echo "Cardno node socket path: $CARDANO_NODE_SOCKET_PATH \n"

# Make DB directory if not exists.
if [ ! -d "$NODE_HOME/db" ];
then
    echo "DB directory doesn't exist. Creating now"
    mkdir $NODE_HOME/db
else
    echo "DB directory exists"
fi

# Add execute permissions to the startup script.
chmod +x $NODE_HOME/script/startNode.sh

#Move the unit file to /etc/systemd/system and give it permissions

sudo cp -rf $NODE_HOME/script/cardano-node.service /etc/systemd/system/cardano-node.service

sudo chmod 644 /etc/systemd/system/cardano-node.service

#enable auto-starting of cardano node at booting time.

sudo systemctl daemon-reload
echo "Reload system daemons..............\n"

sudo systemctl enable cardano-node
echo "Enable cardano-node Service.............. \n"