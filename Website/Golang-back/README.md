# Mint-NFT-On-Cardano-Go-Backend

The backend project for Minting NFT with GoLang on Cardano Blockchain

# install mongodb, golang, node.js.
1.mongodb
- install
    sudo apt update
    sudo apt install mongodb
    sudo systemctl status mongodb
    (if install it, mongo is started automatically, below is the manual command.)
    sudo systemctl restart mongodb(stop, disable, enable,)
- uninstall
    sudo systemctl stop mongodb
    sudo apt purge mongodb
    sudo apt autoremove
2. golang
- install 
    sudo apt install golang
    go version
- uninstall
	sudo apt-get remove golang-go
	sudo apt-get remove --auto-remove golang-go

3. node.js
	sudo apt install nodejs	
	nodejs -v
	sudo apt install npm
---------------------------------------
(can find this script in env directory.)
    sudo apt update
    sudo apt install mongodb -y
    sudo systemctl status mongodb
	sudo apt install golang -y
	go version
	sudo apt install nodejs	-y
	nodejs -v
	sudo apt install npm -y
---------------------------------------
set whole directory(backend) permission to 757

# frontend, backend webservice(React, golang)	

- build go production version
go build -ldflags "-s -w"



# How to set up cardano platform.




1. /Cardano_node/script/set_path.sh (3 parameters)

	back_path=$HOME/Downloads/cardano/website/backend
	node_home_path=$back_path/cardano_node
	echo export NODE_CONFIG=testnet-magic 1097911063 >> $HOME/.bashrc

2. 	/Cardano_node/script/startNode.sh (4 parameters )

	DIRECTORY=/home/song/Downloads/cardano/website/backend/cardano_node
	TOPOLOGY=${DIRECTORY}/testnet-topology.json
	SOCKET_PATH=${DIRECTORY}/db/socket
	CONFIG=${DIRECTORY}/testnet-config.json

3. /Cardano_node/script/set_node_service.sh  (1 parameters : db )


	# Make DB directory if not exists.
	if [ ! -d "$NODE_HOME/db" ];
	then
	    echo "DB directory doesn't exist. Creating now"
	    mkdir $NODE_HOME/db
	else
	    echo "DB directory exists"
	fi


4. /Cardano_node/script/startNode.sh  (3 parameters )

	User            = song
	WorkingDirectory= /home/song/Downloads/cardano/website/backend/cardano_node/script
	ExecStart       = /bin/bash -c '/home/song/Downloads/cardano/website/backend/cardano_node/script/startNode.sh'


--delete mint/address.



