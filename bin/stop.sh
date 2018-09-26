#!/bin/bash
#git clone https://github.com/ixofoundation/ixo-pds.git
#cd ixo-pds
green=`tput setaf 2`
echo "***********************************"
echo "* KEYSAFE TOOL SHUTDOWN           *"
echo "***********************************"
echo ""
docker-compose stop
docker-compose rm
echo ""
echo "***********************************"
echo "* KEYSAFE TOOL SHUTDOWN COMPLETE  *"
echo "***********************************"