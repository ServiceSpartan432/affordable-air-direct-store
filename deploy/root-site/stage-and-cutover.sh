#!/usr/bin/env bash
# Stage a store build now, swap it live at 1 AM Pacific.
#
# WHY NOT JUST deploy-root.sh: that rsyncs --delete straight over the live
# html/ directory. On 2026-08-17 three of five store deploys landed between
# 12:18 and 2:40pm and two visitors 404'd on hashed assets that vanished
# mid-deploy, which blanks the SPA for someone in the middle of the funnel.
# The build is staged here and swapped in the small hours, with the swap
# verified and rolled back automatically if anything comes back non-200.
#
# Usage:  deploy/root-site/stage-and-cutover.sh
set -euo pipefail

KEY=~/.ssh/aha_dashboard_vps
H=root@31.97.209.123
D=/opt/aad-site
export PATH="$HOME/.local/node/bin:$PATH"

cd "$(dirname "$0")/../.."

echo "1/4  building for the root domain…"
DEPLOY_BASE=/ npm run build

echo "2/4  staging to $D/staged (the live site is untouched)…"
ssh -i "$KEY" "$H" "mkdir -p $D/staged"
rsync -az --delete -e "ssh -i $KEY" dist/ "$H:$D/staged/"

echo "3/4  installing the cutover script…"
ssh -i "$KEY" "$H" "cat > /opt/cutover-aad.sh && chmod +x /opt/cutover-aad.sh" <<'CUT'
#!/usr/bin/env bash
# Swap staged -> live, verify, roll back on any failure. One-shot: clears its
# own cron entry on the way out, however it exits.
set -uo pipefail
D=/opt/aad-site
LOG=/var/log/cutover-aad.log
exec >>"$LOG" 2>&1
echo "=== cutover $(date -u) ==="

trap 'crontab -l 2>/dev/null | grep -v cutover-aad.sh | crontab -' EXIT

rm -rf "$D/html.prev"
cp -a "$D/html" "$D/html.prev"
rsync -a --delete "$D/staged/" "$D/html/"
sleep 3

# The hashed asset is the thing that actually goes missing in a bad deploy, so
# check the one THIS build references, not just that the page returns HTML.
ASSET=$(grep -o '/assets/index-[^"]*\.js' "$D/html/index.html" | head -1)
FAIL=0
for P in / "$ASSET" /lp /journey/zip; do
  CODE=$(curl -s -o /dev/null -w '%{http_code}' "https://affordableairdirect.com${P}" || echo 000)
  echo "  ${P} -> ${CODE}"
  [ "$CODE" = "200" ] || FAIL=1
done

if [ "$FAIL" = "1" ]; then
  echo "  FAILED verification — rolling back"
  rsync -a --delete "$D/html.prev/" "$D/html/"
  exit 1
fi
echo "  cutover ok"
CUT

echo "4/4  scheduling it for 1 AM Pacific (08:00 UTC)…"
ssh -i "$KEY" "$H" '
  # 1 AM Pacific is 08:00 UTC, and the UTC date rolls over at 5 PM Pacific — so
  # "tomorrow" is a day late for any run started after 5 PM local. Pick the NEXT
  # 08:00 UTC instead: today if we are still ahead of it, tomorrow otherwise.
  if [ "$(date -u +%-H)" -lt 8 ]; then WHEN="today 08:00"; else WHEN="tomorrow 08:00"; fi
  DAY=$(date -u -d "$WHEN" +%-d); MON=$(date -u -d "$WHEN" +%-m)
  ( crontab -l 2>/dev/null | grep -v cutover-aad.sh; echo "0 8 $DAY $MON * /opt/cutover-aad.sh" ) | crontab -
  echo "  goes live: $(TZ=America/Los_Angeles date -d "$(date -u -d "$WHEN" +%FT%T) UTC" "+%a %b %-d, %-I:%M %p %Z")"
  crontab -l | grep cutover-aad.sh
'

echo
echo "Staged. It goes live at 1 AM Pacific, verifies /, the hashed JS asset,"
echo "/lp and /journey/zip, and rolls back by itself if any of them miss 200."
echo "Log on the VPS: /var/log/cutover-aad.log"
echo "To cancel:  ssh -i $KEY $H \"crontab -l | grep -v cutover-aad.sh | crontab -\""
