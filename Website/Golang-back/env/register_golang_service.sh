# Add execute permissions to the startup script.

echo "Building golang binary file..."

cd $BACKEND_PATH
# go build -ldflags "-s -w"
go build

#Move the unit file to /etc/systemd/system and give it permissions

sudo cp -rf $BACKEND_PATH/env/golang-backend.service /etc/systemd/system/golang-backend.service

sudo chmod 757 /etc/systemd/system/golang-backend.service

#enable auto-starting of cardano node at booting time.

sudo systemctl daemon-reload
echo "Reload system daemons..............\n"

sudo systemctl enable golang-backend
echo "Enable golang Service.............. \n"

systemctl restart golang-backend
echo "start golang Service.............. \n"