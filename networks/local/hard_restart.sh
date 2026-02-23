docker-compose rm
rm -rf ./data
mkdir data
echo '{"height": "0","round": 0,"step": 0}' > ./data/priv_validator_state.json
docker-compose up
