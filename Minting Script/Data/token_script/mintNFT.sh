
echo "\n Hi Camil, Hope you are doing great!"
echo "\n Starting NFT minting on the Cardano Blockchain..."

### First, start my node with following command....
: '
cardano-node run --topology ./testnet-topology.json \
--database-path ./db \
--socket-path ./socket/node.socket \
--port 3001 \
--config ./testnet-config.json 
'

echo "\n Checking new NFT information..."

nft_name="test_nft"
nft_detail="This is test nft"
nft_creator="pritesh"
nft_url="ipfs://QmProXRZVXuP4PgoJSRSYEap1DF7NKZb1hzyK89EeBq93p"
nft_ipfs="ipfs://QmProXRZVXuP4PgoJSRSYEap1DF7NKZb1hzyK89EeBq93p"

echo "....nft_name: $nft_name"
echo "....nft_detail: $nft_detail"
echo "....nft_creator: $nft_creator"
echo "....nft_url: $nft_url"
echo "....nft_ipfs: $nft_ipfs"

echo "\n We need to export the specific socket path, set payment address, network configuration...\n"

## we need to export the specific socket path to variable CARDANO_NODE_SOCKET_PATH
export CARDANO_NODE_SOCKET_PATH="/home/song/Downloads/TESTNET_NODE/socket/node.socket"

## we need to set payment address, network configuration.
address="addr_test1vpn64nz6ks7mjm6s2yr65kmpumccek5zgvd0tvgwhlm3rpqz2u3yp"
testnet="1097911063"

echo "CARDANO_NODE_SOCKET_PATH: $CARDANO_NODE_SOCKET_PATH"
echo "address: $address"
echo "testnet: $testnet"

# We also want to check if our Node is up to date. The good way to quickly check your node is to issue the query tip 
# for a couple of seconds and check if the slot is changing....

echo "\n Show utxo in address..."
cardano-cli query utxo --address $address --testnet-magic $testnet

echo "\n Now we're setup and good to go...."




### First of all we need to create a payment key set (Verification and signing).
: '
cardano-cli address key-gen --verification-key-file payment.vkey \
							--signing-key-file payment.skey

cardano-cli address build --payment-verification-key-file payment.vkey \
	                      --out-file payment.addr \
	                      --testnet-magic $testnet

address=$(cat payment.addr)

echo "--------new address: $address"

cardano-cli query utxo --address $address --testnet-magic $testnet
'



### Generate the policy.
# Policies are defining factor under which tokens can be minted. Only those in possession of the policy keys 
# can mint or burn tokens, minted under this specific poicy.

echo "\n Creating policy under which tokens can be minted..."

if [ ! -d "policy/" ];
then mkdir policy
fi	

# First of all we need some key pairs.

cardano-cli address key-gen \
    --verification-key-file policy/policy.vkey \
    --signing-key-file policy/policy.skey

# Create a policy.script file and fill it with an empty string

touch policy/policy.script && echo "" > policy/policy.script

# Use echo to populate the file:

echo "{" >> policy/policy.script 
echo "  \"keyHash\": \"$(cardano-cli address key-hash --payment-verification-key-file policy/policy.vkey)\"," >> policy/policy.script 
echo "  \"type\": \"sig\"" >> policy/policy.script 
echo "}" >> policy/policy.script

# we need to generate the policy ID from the script file

cardano-cli transaction policyid --script-file ./policy/policy.script > policy/policyID

policyid=$(cat policy/policyID)

echo "\n ......policyid: $policyid"


### Assets Minting.(Create Metadata.json)

echo "Making metadata.json...\n"


if [ ! -d "metadata/" ];
then mkdir metadata
fi

touch metadata/metadata.json && echo "" > metadata/metadata.json

echo "{" >> metadata/metadata.json
echo "  \"721\": {" >> metadata/metadata.json
echo "   \"$policyid\": {" >> metadata/metadata.json
echo "    \"$nft_name\": {" >> metadata/metadata.json
echo "     \"description\": \"$nft_detail\"," >> metadata/metadata.json
echo "     \"name\": \"$nft_name\"," >> metadata/metadata.json
echo "     \"image\": \"$nft_ipfs\"," >> metadata/metadata.json
echo "     \"creator\": \"$nft_creator\"," >> metadata/metadata.json
echo "     \"type\": \"image\"" >> metadata/metadata.json
echo "}" >> metadata/metadata.json
echo "}" >> metadata/metadata.json
echo "}" >> metadata/metadata.json
echo "}" >> metadata/metadata.json


## Build the raw transaction to send to oneself
# Before we start, we will need some setup, to make the transaction building easier. 
# Query the payment address and take note of the different values present.

txhash = $(cardano-cli query utxo --address $address --testnet-magic $testnet |  sed -n '2 p' | cut -d " " -f1)
txix   = $(cardano-cli query utxo --address $address --testnet-magic $testnet |  sed -n '2 p' | cut -d " " -f2)
funds  = $(cardano-cli query utxo --address $address --testnet-magic $testnet |  sed -n '2 p' | cut -d " " -f3)
fee    = "0"
output = "0"

#So, with those parameters in mind, this is what our transaction build command looks like.

echo "Building transaction build-raw.......\n"

cardano-cli transaction build-raw \
 --fee $fee \
 --tx-in $txhash#$txix \
 --tx-out $address+$output+"$nft_amount $policyid.$nft_name" \
 --mint="$nft_amount $policyid.$nft_name" \
--metadata-json-file metadata/metadata.json  \
 --out-file matx.raw

 #Based on this raw transaction we can calculate the minimal transaction fee and store it in $fee.

fee=$(cardano-cli transaction calculate-min-fee \
                            --tx-body-file matx.raw \
                            --tx-in-count 1 \
                            --tx-out-count 1 \
                            --witness-count 1 \
                            --testnet-magic $testnet
                            --protocol-params-file protocol.json | cut -d " " -f1)


echo "calculating...$fee \n"

output=$(expr $funds - $fee)

#Re-build the transaction, ready to be signed, being our variables now holding the correct value.

echo "Rebuilding transaction with correct value... \n"

cardano-cli transaction build-raw \
--fee $fee  \
--tx-in $txhash#$txix  \
--tx-out $address+$output+"$nft_amount $policyid.$nft_name" \
--mint="$nft_amount $policyid.$nft_name" \
--metadata-json-file metadata/metadata.json  \
--out-file matx.raw

#Transactions need to be signed to prove authenticity and ownership of the policy key.

echo "Signing transaction to prove authenticity and ownership of the policy key \n"

cardano-cli transaction sign  \
--signing-key-file payment.skey  \
--signing-key-file policy/policy.skey  \
--script-file policy/policy.script  \
--testnet-magic $testnet --tx-body-file matx.raw  \
--out-file matx.signed

# submit transaction

echo "Submit mint transaction... \n"

cardano-cli transaction submit --tx-file matx.signed --$testnet

echo "Temp wallet status .......\n"

cardano-cli query utxo --address $address --testnet-magic $testnet




