# Meta Conversions API relay (VPS)

Tiny zero-dependency Node service. The store (browser) POSTs events here; this
service hashes the PII, adds the real client IP + user-agent, and forwards to
Meta. **The CAPI token lives only in this service's `.env` — never in the
browser, never in git.**

## Deploy on the VPS (alongside aha-dashboard / pm2)

```bash
# 1. Copy this folder to the VPS, e.g. /opt/aad-capi-relay
scp -r server/capi-relay user@YOUR_VPS:/opt/aad-capi-relay

# 2. Configure secrets
cd /opt/aad-capi-relay
cp .env.example .env
nano .env            # set META_PIXEL_ID and META_CAPI_TOKEN

# 3. Run under pm2 (no npm install needed — uses only Node built-ins + fetch)
pm2 start index.js --name aad-capi-relay
pm2 save
```

The service listens on `PORT` (default 8788). Put it behind your existing nginx
on its own subdomain so the browser can reach it over HTTPS:

```nginx
server {
  server_name capi.affordableairdirect.com;
  location / {
    proxy_pass http://127.0.0.1:8788;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;   # real client IP for match quality
  }
  # add certbot TLS as you do for the other sites
}
```

Then point the store at it (in the store repo):

```
VITE_CAPI_URL=https://capi.affordableairdirect.com/capi
VITE_META_PIXEL_ID=<your pixel id>
```

## Test before going live

1. In Events Manager → **Test Events**, copy the `TESTxxpixel` code into `.env`
   as `META_TEST_CODE`, then `pm2 restart aad-capi-relay`.
2. Walk the store quote flow. You should see PageView / ViewContent / Lead /
   Schedule appear in Test Events, each marked **Deduplicated with browser** (that
   confirms the Pixel + CAPI pairing).
3. Remove `META_TEST_CODE` and `pm2 restart` to send live events.

## Health check

`GET /health` → `{ "ok": true }`
