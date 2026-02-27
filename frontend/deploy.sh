#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<EOF
Usage: $0 -h host -u user -p remote_path [-i ssh_key] [-a api_url]

Builds the frontend (Vite) and deploys the generated `dist` to the remote host.

Options:
  -h host         Remote host (IP or DNS)
  -u user         Remote SSH user
  -p remote_path  Remote path where files will be served (e.g. /var/www/mycontacts)
  -i ssh_key      Path to private SSH key (optional, will use default ssh agent)
  -a api_url      Value for VITE_API_URL during build (optional)
  -s              Skip local build (assumes `dist` already present)
  -r remote_tmp   Remote temporary directory (optional)
EOF
}

HOST=""
USER=""
REMOTE_PATH="/var/www/mycontacts"
KEY=""
API_URL=""
SKIP_BUILD=0
REMOTE_TMP="/tmp/mycontacts-dist-$(date +%s)"

while getopts ":h:u:p:i:a:sr:" opt; do
  case ${opt} in
    h ) HOST="$OPTARG" ;;
    u ) USER="$OPTARG" ;;
    p ) REMOTE_PATH="$OPTARG" ;;
    i ) KEY="$OPTARG" ;;
    a ) API_URL="$OPTARG" ;;
    s ) SKIP_BUILD=1 ;;
    r ) REMOTE_TMP="$OPTARG" ;;
    \? ) usage; exit 1 ;;
  esac
done

if [ -z "$HOST" ] || [ -z "$USER" ]; then
  echo "host and user are required"
  usage
  exit 1
fi

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$SCRIPT_DIR"

if [ $SKIP_BUILD -eq 0 ]; then
  if [ -n "$API_URL" ]; then
    echo "Building with VITE_API_URL=$API_URL"
    VITE_API_URL="$API_URL" npm run build
  else
    echo "Building without overriding VITE_API_URL"
    npm run build
  fi
else
  echo "Skipping build; using existing dist/"
fi

# choose upload method: rsync if available, else scp
UPLOAD_CMD=""
SSH_OPTS="-o StrictHostKeyChecking=accept-new"
if [ -n "$KEY" ]; then
  SSH_OPTS="$SSH_OPTS -i $KEY"
fi

if command -v rsync >/dev/null 2>&1; then
  echo "Using rsync to upload dist/ to ${USER}@${HOST}:${REMOTE_TMP}"
  rsync -avz -e "ssh $SSH_OPTS" --delete dist/ "${USER}@${HOST}:${REMOTE_TMP}/"
else
  echo "rsync not found; falling back to scp"
  ssh $SSH_OPTS ${USER}@${HOST} "mkdir -p ${REMOTE_TMP}"
  scp $SSH_OPTS -r dist/* "${USER}@${HOST}:${REMOTE_TMP}/"
fi

echo "Deploying on remote host: moving files to ${REMOTE_PATH} and reloading nginx"
ssh $SSH_OPTS ${USER}@${HOST} bash -s <<EOF
set -euo pipefail
sudo mkdir -p ${REMOTE_PATH}
sudo rm -rf ${REMOTE_PATH}/*
sudo mv ${REMOTE_TMP}/* ${REMOTE_PATH}/ || (sudo cp -a ${REMOTE_TMP}/. ${REMOTE_PATH}/)
sudo chown -R www-data:www-data ${REMOTE_PATH}
if command -v systemctl >/dev/null 2>&1; then
  sudo systemctl reload nginx || sudo systemctl restart nginx || true
else
  sudo service nginx reload || sudo service nginx restart || true
fi
rm -rf ${REMOTE_TMP}
EOF

echo "Deploy finished. Files available at ${REMOTE_PATH} on ${HOST}"
