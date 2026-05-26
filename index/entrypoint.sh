#! /bin/bash

if [ ! -d "/root/.cyberindex/" ]
then
    export $(cat /.env)
    mkdir /root/.cyberindex
    echo -e "chain:\n    bech32_prefix: $CHAIN_PREFIX\n    modules:\n        - modules\n        - messages\n        - auth\n        - consensus\n        - daily refetch\n        - message_type\n        - bank\n        - graph\n        - grid\n        - resources\n        - wasm\nnode:\n    type: remote\n    config:\n        rpc:\n            client_name: \"cyberindex\"\n            max_connections: 10\n            address: \"$RPC_URL\"\n        grpc:\n            address: \"$GRPC_URL\"\n            insecure: $GPRC_INSECURE\n    workers: $INDEX_WORKERS\n    start_height: $START_HEIGHT\n    average_block_time: 5s\n    listen_new_blocks: $LISTEN_NEW_BLOCKS\n    parse_old_blocks: $PARSE_OLD_BLOCKS\n    parse_genesis: $PARSE_GENESIS\ndatabase:\n    url: postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:5432/$POSTGRES_DB?sslmode=disable&search_path=public\n    max_open_connections: 1\n    max_idle_connections: 1\n    partition_size: 100000\n    partition_batch: 1000\n    ssl_mode_enable: \"$POSTGRES_SSL\"\n    ssl_root_cert: \"\"\n    ssl_cert: \"\"\n    ssl_key: \"\"\nlogging:\n    level: $LOG_LEVEL\n    format: text\nactions:\n    host: 127.0.0.1\n    port: 3000" >> /root/.cyberindex/config.yaml
fi

if [ ! -f "/root/.cyberindex/config.yaml" ]
then
    export $(cat /.env)
    echo -e "chain:\n    bech32_prefix: $CHAIN_PREFIX\n    modules:\n        - modules\n        - messages\n        - auth\n        - consensus\n        - daily refetch\n        - message_type\n        - bank\n        - graph\n        - grid\n        - resources\n        - wasm\nnode:\n    type: remote\n    config:\n        rpc:\n            client_name: \"cyberindex\"\n            max_connections: 10\n            address: \"$RPC_URL\"\n        grpc:\n            address: \"$GRPC_URL\"\n            insecure: $GPRC_INSECURE\n    workers: $INDEX_WORKERS\n    start_height: $START_HEIGHT\n    average_block_time: 5s\n    listen_new_blocks: $LISTEN_NEW_BLOCKS\n    parse_old_blocks: $PARSE_OLD_BLOCKS\n    parse_genesis: $PARSE_GENESIS\ndatabase:\n    url: postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:5432/$POSTGRES_DB?sslmode=disable&search_path=public\n    max_open_connections: 1\n    max_idle_connections: 1\n    partition_size: 100000\n    partition_batch: 1000\n    ssl_mode_enable: \"$POSTGRES_SSL\"\n    ssl_root_cert: \"\"\n    ssl_cert: \"\"\n    ssl_key: \"\"\nlogging:\n    level: $LOG_LEVEL\n    format: text\nactions:\n    host: 127.0.0.1\n    port: 3000" >> /root/.cyberindex/config.yaml
fi

exec "$@"
