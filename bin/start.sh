#!/bin/bash
#git clone https://github.com/ixofoundation/ixo-block-sync.git
#cd ixo-block-sync
#green=`tput setaf 2`
echo "***********************************"
echo "* IXO KEYSAFE TOOL START          *"
echo "***********************************"
echo ""

docker-compose up -d

echo -n "Starting IXO Keysafe Tool ..."
sleep 3
echo ${green} "done"
docker-compose ps
echo ""
echo "***********************************"
echo "* IXO KEYSAFE TOOL COMPLETE       *"
echo "***********************************"
