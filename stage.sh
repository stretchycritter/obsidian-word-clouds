#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

CONFIG_FILE=".deploy.local"

# Resolution order:
# 1) First script argument
# 2) OBSIDIAN_DEPLOY_TARGET env var
# 3) .deploy.local file (first non-empty line)
TARGET="${1:-${OBSIDIAN_DEPLOY_TARGET:-}}"

if [[ -z "$TARGET" && -f "$CONFIG_FILE" ]]; then
  TARGET="$(grep -v '^[[:space:]]*$' "$CONFIG_FILE" | head -n 1 || true)"
fi

if [[ -z "$TARGET" ]]; then
  cat <<'MSG'
Missing deploy target.

Set one of:
1) Argument: ./stage.sh /absolute/path/to/vault-or-plugin-dir
2) Env var: export OBSIDIAN_DEPLOY_TARGET=/absolute/path/to/vault-or-plugin-dir
3) Local file: echo "/absolute/path/to/vault-or-plugin-dir" > .deploy.local
MSG
  exit 1
fi

npm run deploy -- "$TARGET"
