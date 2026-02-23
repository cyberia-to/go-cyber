#!/bin/bash

## https://gist.github.com/Cordtus/87b147862627d3039f394695b78e4361
## dump connected peers to comma separated persistent_peers list

RED='\033[0;91m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'
x=0

printf "\n${RED}rpc${NC} address?: "
read -r RPC
DATA=$(curl -s $RPC/net_info)
if [  -z "$DATA" ]
then
  printf "%b\n${RED}rpc%b${NC} error\n\n"
  exit
fi
NETWORK=$(echo $DATA | jq '.result | .peers | .[0] | .node_info | .network' | tr -d '"')
COUNT=$(echo $DATA | jq '.result | .n_peers' | tr -d '"')
while [ $x -lt $COUNT ]
do
  if [ $(echo $DATA | jq ".result | .peers | .[$x] | .is_outbound") == 'true' ]
  then
    ID=$(echo $DATA | jq ".result | .peers | .[$x] | .node_info | .id" 2> /dev/null)
    ADDRESS=$(echo $DATA | jq ".result | .peers | .[$x] | .remote_ip" 2> /dev/null)
    PORT=$(echo $DATA | jq ".result | .peers | .[$x] | .node_info | .listen_addr" 2> /dev/null | tr -d '"')
    PEER=$(echo $ID | tr -d '"')@$(echo $ADDRESS | tr -d '"'):${PORT##*:}
    PEERS[${#PEERS[@]}]="$PEER"
    ((x++))
  else
    ((x++))
  fi
done

printf "\n${RED}$x${NC} outbound peers found"

printf "\n${RED}number${NC} of peers to list? (1,3,10,all): "
read -r NUMBER

if [ -z $NUMBER ]
then
TOTAL="$x"
elif [ $NUMBER == "all" ] || [ $NUMBER -ge $x ]
then
TOTAL="$x"
else
TOTAL="$NUMBER"
fi

while [[ $i -lt $TOTAL ]]
do
  P_LIST="$P_LIST,$(echo ${PEERS[$i]} | tr -d '\n')"
  ((i++))
done
printf "\npersistent_peers = \"${P_LIST:1}\"\n"