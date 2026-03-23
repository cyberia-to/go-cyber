#!/bin/bash
set -e

REPO="cyberia-to/go-cyber"
VERSION=${VERSION:-$(curl -sf "https://api.github.com/repos/$REPO/releases/latest" | grep tag_name | cut -d'"' -f4)}
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m | sed 's/x86_64/amd64/; s/aarch64/arm64/')
BASE_URL="https://github.com/$REPO/releases/download/${VERSION}"

# Default: cyb (CLI). With --node: cyber (full node, Linux only)
BINARY="cyb"
if [ "${1}" = "--node" ]; then
    BINARY="cyber"
    if [ "$OS" != "linux" ]; then
        echo "Error: cyber (node) is only available for Linux"
        exit 1
    fi
fi

ARCHIVE="${BINARY}_${VERSION}_${OS}_${ARCH}"
if [ "$OS" = "windows" ] && [ "$BINARY" = "cyb" ]; then
    EXT="zip"
else
    EXT="tar.gz"
fi

echo "Installing ${BINARY} ${VERSION} for ${OS}/${ARCH}..."

TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

curl -sL "${BASE_URL}/${ARCHIVE}.${EXT}" -o "$TMPDIR/archive"
if [ "$EXT" = "zip" ]; then
    unzip -q "$TMPDIR/archive" -d "$TMPDIR"
else
    tar xzf "$TMPDIR/archive" -C "$TMPDIR"
fi

sudo install -m 755 "$TMPDIR/$BINARY" "/usr/local/bin/$BINARY"
echo "Installed: $($BINARY version)"
