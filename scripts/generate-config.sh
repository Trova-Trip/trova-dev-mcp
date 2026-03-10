#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENTRY_FILE="$SCRIPT_DIR/src/index.ts"

BUN_PATH=$(command -v bun 2>/dev/null) || {
  echo "Error: bun not found in PATH" >&2
  exit 1
}

ENV_FILE="$SCRIPT_DIR/.env"
if [ -f "$ENV_FILE" ]; then
  echo "Using .env" >&2
else
  ENV_FILE="$SCRIPT_DIR/.env.example"
  if [ ! -f "$ENV_FILE" ]; then
    echo "Error: neither .env nor .env.example found" >&2
    exit 1
  fi
  echo "Warning: .env not found, using placeholders from .env.example" >&2
fi

# Read env vars (skip comments and blank lines)
ENV_JSON=""
while IFS='=' read -r key value; do
  key=$(echo "$key" | xargs)
  [ -z "$key" ] && continue
  case "$key" in \#*) continue ;; esac
  value=$(echo "$value" | xargs)
  [ -n "$ENV_JSON" ] && ENV_JSON+=","
  ENV_JSON+=$'\n'"      \"$key\": \"$value\""
done < "$ENV_FILE"

if [ -z "$ENV_JSON" ]; then
  echo "Error: no environment variables found in $ENV_FILE" >&2
  exit 1
fi

cat <<EOF
{
  "trova-dev": {
    "command": "$BUN_PATH",
    "args": ["run", "$ENTRY_FILE"],
    "env": {$ENV_JSON
    }
  }
}
EOF
