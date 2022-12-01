systemctl stop minting_nft.com
rm -rf /var/www/aws-scraping/backend/minting_nft.com
rm -rf /var/www/aws-scraping/backend/text.log
cp ./minting_nft.com /var/www/aws-scraping/backend/
systemctl start minting_nft.com
systemctl restart mongodb