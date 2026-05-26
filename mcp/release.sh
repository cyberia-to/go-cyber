#!/usr/bin/env bash
set -euo pipefail

VERSION=$(node -p "require('./package.json').version")
TAG="v${VERSION}"

echo "=== Releasing bostrom-mcp ${TAG} ==="
echo ""

# 1. Build
echo "--- Build ---"
npm run build
echo ""

# 2. Update server.json version
echo "--- Update server.json ---"
node -e "
const fs = require('fs');
const sj = JSON.parse(fs.readFileSync('server.json','utf8'));
sj.version = '${VERSION}';
sj.packages[0].version = '${VERSION}';
fs.writeFileSync('server.json', JSON.stringify(sj, null, 2) + '\n');
console.log('server.json updated to ${VERSION}');
"
echo ""

# 3. Commit if there are changes
if ! git diff --quiet server.json 2>/dev/null; then
  git add server.json
  git commit -m "Bump server.json to ${VERSION}"
fi

# 4. Push to GitHub
echo "--- Push to GitHub ---"
git push origin main
echo ""

# 5. Create GitHub release
echo "--- Create GitHub Release ${TAG} ---"
gh release create "${TAG}" \
  --repo cyberia-to/bostrom-mcp \
  --title "bostrom-mcp ${TAG}" \
  --generate-notes
echo ""

# 6. Publish to npm
echo "--- Publish to npm ---"
npm publish
echo ""

# 7. Publish to MCP Registry (auto-auth with GitHub PAT from .mcpregistry_github_token)
echo "--- Publish to MCP Registry ---"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GH_TOKEN_FILE="${SCRIPT_DIR}/.mcpregistry_github_token"
if [[ -f "$GH_TOKEN_FILE" ]]; then
  mcp-publisher login github -token "$(cat "$GH_TOKEN_FILE")"
fi
mcp-publisher publish
echo ""

# 8. Smithery (auto-syncs from GitHub via smithery.yaml — just verify)
echo "--- Smithery ---"
echo "Smithery auto-syncs from GitHub. Verify at: https://smithery.ai/server/@cyberia-to/bostrom-mcp"
echo ""

# 9. Verify
echo "=== Released ${TAG} ==="
echo "  GitHub:   https://github.com/cyberia-to/bostrom-mcp/releases/tag/${TAG}"
echo "  npm:      https://www.npmjs.com/package/bostrom-mcp/v/${VERSION}"
echo "  Registry: https://registry.modelcontextprotocol.io (search: bostrom)"
echo "  Smithery: https://smithery.ai/server/@cyberia-to/bostrom-mcp"
