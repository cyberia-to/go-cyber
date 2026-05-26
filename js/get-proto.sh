#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

PROTO_DIR="./proto"
CYBER_DIR="$PROTO_DIR/cyber"
ZIP_FILE="$CYBER_DIR/tmp.zip"
CYBER_REF='v2.0.0'
mkdir -p "$CYBER_DIR"

wget -qO "$ZIP_FILE" "https://github.com/cybercongress/go-cyber/archive/refs/tags/$CYBER_REF.zip"
unzip "$ZIP_FILE" "*.proto" -d "$CYBER_DIR"
rm "$ZIP_FILE"

wget -qO "$ZIP_FILE" "https://github.com/tendermint/liquidity/archive/master.zip"
unzip "$ZIP_FILE" "*.proto" -d "$CYBER_DIR"
rm "$ZIP_FILE"
