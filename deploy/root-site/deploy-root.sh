#!/usr/bin/env bash
# Build the site for the affordableairdirect.com ROOT domain and ship it to the
# VPS static container. Run from your Mac. Re-run any time to update the site.
set -euo pipefail

KEY=~/.ssh/aha_dashboard_vps
H=root@31.97.209.123
D=/opt/aad-site
export PATH="$HOME/.local/node/bin:$PATH"

cd "$(dirname "$0")/../.."

echo "1/3  building for root domain…"
DEPLOY_BASE=/ npm run build

echo "2/3  shipping compose + nginx + dist…"
ssh -i "$KEY" "$H" "mkdir -p $D/html"
scp -i "$KEY" deploy/root-site/docker-compose.yml deploy/root-site/nginx.conf "$H:$D/"
rsync -az --delete -e "ssh -i $KEY" dist/ "$H:$D/html/"

echo "3/3  starting/reloading container…"
ssh -i "$KEY" "$H" "cd $D && docker compose up -d"

echo
echo "Done. One-time remaining steps:"
echo "  - nginx-proxy-manager: proxy host affordableairdirect.com (+ www) -> aad_site:80, SSL on"
echo "  - DNS (Cloudflare): point affordableairdirect.com A record at 31.97.209.123"
echo "  - Keep the old WordPress hosting alive for a week as rollback"
