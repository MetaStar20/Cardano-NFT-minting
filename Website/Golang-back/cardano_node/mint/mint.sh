#!/bin/sh
echo "\n Hi Camil, Hope you are doing great!"
echo "\n Starting NFT minting on the $NODE_CONFIG Cardano Blockchain... \n"


    #  **** Paramters List...
    #  * s.Title
    #  * s.Description
    #  * s.Author
    #  * s.WebUrl
    #  * s.SentAddress
    #  * s.IpfsUrl
    #  * current node utxo address.(config.AddressNode)
    #  * caddress
    # **************/

# echo "$1, $2, $3, $4, $5, $6, $7, $8" .. it works well.


### First, start my node with following command.... (Cardano node service is run at startup)
: '
cardano-node run --topology ./testnet-topology.json \
--database-path ./db \
--socket-path ./socket/node.socket \
--port 3001 \
--config ./testnet-config.json
'

rm -rf $NODE_HOME/mint/metadata
rm -rf $NODE_HOME/mint/policy
rm -rf $NODE_HOME/mint/balance.out
rm -rf $NODE_HOME/mint/fullUtxo.out


echo "\n Checking new NFT information..."

# nft_name=$1
# nft_detail=$2
# nft_creator=$3
# nft_url=$4
# nft_out=$5
# nft_ipfs=$6
# nft_utxo=$7
# nft_caddress=$8
# nft_amount=1

nft_name=$1
nft_detail=$2
nft_creator=$3
nft_url=$4
nft_out=$5
nft_ipfs=$6
nft_utxo=$7
nft_caddress=$8
nft_amount=1


echo ".....NODE_CONFIG: $NODE_CONFIG"
echo ".....NODE_HOME: $NODE_HOME"
echo "....nft_name: $nft_name"
echo "....nft_detail: $nft_detail"
echo "....nft_creator: $nft_creator"
echo "....nft_url: $nft_url"
echo "....nft_out: $nft_out"
echo "....nft_ipfs: $nft_ipfs"
echo "....nft_utxo: $nft_utxo"
echo "....nft_caddress: $nft_caddress"


##$$$$$$$$$$$$$$$ Finish Setting Environment $$$$$$$$$$$$$$$$$$$$$$$###


# We also want to check if our Node is up to date. The good way to quickly check your node is to issue the query tip
# for a couple of seconds and check if the slot is changing....

echo "\n Now we're setup and good to go...."



### Generate protocol.json
echo "\n Creating protocol.json"
cardano-cli query protocol-parameters --$NODE_CONFIG > $NODE_HOME/mint/protocol.json

### Generate the policy.
# Policies are defining factor under which tokens can be minted. Only those in possession of the policy keys
# can mint or burn tokens, minted under this specific poicy.

echo "\n Creating policy under which tokens can be minted..."

policy=$NODE_HOME/mint/policy

if [ ! -d $policy ];
then
    mkdir $policy
    echo "make policy directory..."
else 
    echo "policy directory exists..."
fi

# First of all we need some key pairs.

cardano-cli address key-gen \
    --verification-key-file $policy/policy.vkey \
    --signing-key-file $policy/policy.skey

# Create a policy.script file and fill it with an empty string

touch $policy/policy.script && echo "" > $policy/policy.script

# Use echo to populate the file:

echo "{" >> $policy/policy.script
echo "  \"keyHash\": \"$(cardano-cli address key-hash --payment-verification-key-file $policy/policy.vkey)\"," >> $policy/policy.script
echo "  \"type\": \"sig\"" >> $policy/policy.script
echo "}" >> $policy/policy.script

# we need to generate the policy ID from the script file

cardano-cli transaction policyid --script-file $policy/policy.script > $policy/policyID

policyid=$(cat $policy/policyID)

echo "\n ......policyid: $policyid"



### Assets Minting.(Create Metadata.json)

echo "Making metadata.json...\n"

metadata=$NODE_HOME/mint/metadata


if [ ! -d $metadata ];
then 
    mkdir $metadata
    echo "make metadata directory..."
else
    echo "metadata directory exits..."
fi

touch $metadata/metadata.json && echo "" > $metadata/metadata.json

echo "{" >> $metadata/metadata.json
echo "\"721\": {" >> $metadata/metadata.json
echo "\"$policyid\": {" >> $metadata/metadata.json
echo "\"$nft_name\": {" >> $metadata/metadata.json
echo "     \"description\": \"$nft_detail\"," >> $metadata/metadata.json
echo "     \"name\": \"$nft_name\"," >> $metadata/metadata.json
echo "\"image\": \"$nft_ipfs\"," >> $metadata/metadata.json
echo "\"creator\": \"$nft_creator\"," >> $metadata/metadata.json
echo "     \"type\": \"image\"" >> $metadata/metadata.json
echo "}" >> $metadata/metadata.json
echo "}" >> $metadata/metadata.json
echo "}" >> $metadata/metadata.json
echo "}" >> $metadata/metadata.json



## Build the raw transaction to send to oneself
# Before we start, we will need some setup, to make the transaction building easier.
# Query the payment address and take note of the different values present.

# cardano-cli query utxo --address $nft_utxo --$NODE_CONFIG |  sed -n 3p | awk '{print $1}' > $metadata/txhash
# txhash=$(cat $metadata/txhash)

# cardano-cli query utxo --address $nft_utxo --$NODE_CONFIG |  sed -n 3p | awk '{print $2}' > $metadata/txix
# txix=$(cat $metadata/txix)

# cardano-cli query utxo --address $nft_utxo --$NODE_CONFIG |  sed -n 3p | awk '{print $3}' > $metadata/funds
# funds=$(cat $metadata/funds)

fee="0"
output="0"
minada="2000000"
minfee="1000000"


cardano-cli query utxo \
    --address $nft_utxo \
    --$NODE_CONFIG > $NODE_HOME/mint/fullUtxo.out

tail -n +3 $NODE_HOME/mint/fullUtxo.out | sort -k3 -nr > $NODE_HOME/mint/balance.out

cat $NODE_HOME/mint/balance.out

tx_in=" "
total_balance=0
while read -r utxo; do
    in_addr=$(echo $utxo | awk '{print $1}')
    idx=$(echo $utxo | awk '{print $2}')
    utxo_balance=$(echo $utxo | awk '{print $3}')
    total_balance=$(($total_balance+$utxo_balance))
    echo TxHash: $in_addr#$idx
    echo ADA: $utxo_balance
    tx_in="$tx_in --tx-in $in_addr#$idx"
done < $NODE_HOME/mint/balance.out
txcnt=$(cat $NODE_HOME/mint/balance.out | wc -l)
echo Total ADA balance: $total_balance
echo Number of UTXOs: $txcnt
echo "------------------------------tx-in--------------------"
echo $tx_in




#So, with those parameters in mind, this is what our transaction build command looks like.

echo "Building transaction build-raw.......\n"


# chmod 777 $metadata/metadata.json

# touch $metadata/matx.raw
# chmod 777 $metadata/matx.raw

# touch $metadata/matx.signed
# chmod 777 $metadata/matx.signed

# touch $metadata/fee_file
# chmod 777 $metadata/fee_file

# touch $metadata/tx_id
# chmod 777 $metadata/tx_id

# touch $metadata/token_detail
# chmod 777 $metadata/token_detail


cardano-cli transaction build-raw \
${tx_in} \
--tx-out $nft_utxo+$output \
--tx-out $nft_out+$minada+"$nft_amount $policyid.$nft_name" \
--mint="$nft_amount $policyid.$nft_name" \
--minting-script-file $policy/policy.script \
--metadata-json-file $metadata/metadata.json  \
--fee $fee \
--out-file $metadata/matx.raw



#Based on this raw transaction we can calculate the minimal transaction fee and store it in $fee.

cardano-cli transaction calculate-min-fee --tx-body-file $metadata/matx.raw \
--tx-in-count $txcnt \
--tx-out-count 2 \
--witness-count 1 \
--$NODE_CONFIG \
--protocol-params-file $NODE_HOME/mint/protocol.json | cut -d " " -f1 > $metadata/fee_file



fee=$(cat $metadata/fee_file)
echo "calculating...$fee \n"

output=$(expr $total_balance - $fee - $minada)
echo "output .... $output"



#Re-build the transaction, ready to be signed, being our variables now holding the correct value.

echo "Rebuilding transaction with correct value... \n"

cardano-cli transaction build-raw \
--fee $fee  \
$tx_in \
--tx-out $nft_utxo+$output \
--tx-out $nft_out+$minada+"$nft_amount $policyid.$nft_name" \
--mint="$nft_amount $policyid.$nft_name" \
--minting-script-file $policy/policy.script \
--metadata-json-file $metadata/metadata.json  \
--out-file $metadata/matx.raw


#Transactions need to be signed to prove authenticity and ownership of the policy key.

echo "Signing transaction to prove authenticity and ownership of the policy key \n"

cardano-cli transaction sign  \
--signing-key-file $NODE_HOME/mint/payment.skey  \
--signing-key-file $policy/policy.skey  \
--$NODE_CONFIG --tx-body-file $metadata/matx.raw  \
--out-file $metadata/matx.signed


# submit transaction

echo "Submit mint transaction... \n"

cardano-cli transaction submit --tx-file $metadata/matx.signed --$NODE_CONFIG

echo "Temp wallet status .......\n"

cardano-cli query utxo --address $nft_utxo --$NODE_CONFIG


echo "transaction id  .......\n"

#policyid.assetid


if echo $NODE_CONFIG | grep -q "testnet" 
then
    echo -n "https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=" > $metadata/tx_id
else
    echo -n "https://explorer.cardano.org/en/transaction?id=" > $metadata/tx_id
fi

cardano-cli transaction txid --tx-file $metadata/matx.signed >> $metadata/tx_id  

echo -n $policyid > $metadata/token_detail
echo -n "." >> $metadata/token_detail
echo -n "nft_name" | xxd -ps >> $metadata/token_detail







 





