#!/bin/bash
DIRECTORY=/home/song/Downloads/cardano/website/backend/cardano_node
PORT=6000
HOSTADDR=0.0.0.0
TOPOLOGY=${DIRECTORY}/testnet-topology.json
DB_PATH=${DIRECTORY}/db
SOCKET_PATH=${DIRECTORY}/db/socket
CONFIG=${DIRECTORY}/testnet-config.json
/home/song/.local/bin/cardano-node run --topology ${TOPOLOGY} --database-path ${DB_PATH} --socket-path ${SOCKET_PATH} --host-addr ${HOSTADDR} --port ${PORT} --config ${CONFIG}
