#!/bin/sh
echo "uploading image to NFT storage.............."

curl -X POST --data-binary @$1 -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEJEOGUyN0UyODVDNTQ0MTllRDkzQjBjNDg3NTQ5RENCODUyOTQ3NzkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyMjE2MDUwNDI0NywibmFtZSI6IkNhbWlsIFNhbGliYSJ9.-xgjhCzSpySw4wQ1YTYCRYCdwk5ER4ESKJ94tLDhtMo' https://api.nft.storage/upload
