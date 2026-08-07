// ---------------------------------------------------------------------------
// Affordable Air Direct — Meta Conversions API relay
//
// Receives events from the store (browser), SHA-256 hashes PII, enriches with
// the real client IP + user-agent, and forwards to the Meta Graph API. The
// access token lives ONLY here, in an environment variable — never in the
// browser or the repo.
//
// Env:
//   META_PIXEL_ID       required  your dataset / pixel id
//   META_CAPI_TOKEN     required  the Conversions API access token
//   META_TEST_CODE      optional  Events Manager "Test Events" code (TESTxxxx)
//   ALLOWED_ORIGINS     optional  comma-separated; defaults to the two store origins
//   PORT                optional  default 8788
//   GRAPH_VERSION       optional  default v21.0
// ---------------------------------------------------------------------------
import http from 'node:http'
import crypto from 'node:crypto'

const {
  META_PIXEL_ID,
  META_CAPI_TOKEN,
  META_TEST_CODE,
  GRAPH_VERSION = 'v21.0',
  PORT = 8788,
} = process.env

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  'https://servicespartan432.github.io,https://affordableairdirect.com')
  .split(',').map((s) => s.trim()).filter(Boolean)

if (!META_PIXEL_ID || !META_CAPI_TOKEN) {
  console.error('FATAL: META_PIXEL_ID and META_CAPI_TOKEN must be set')
  process.exit(1)
}

const GRAPH_URL = `https://graph.facebook.com/${GRAPH_VERSION}/${META_PIXEL_ID}/events`

// ---- normalization + hashing (per Meta's advanced-matching spec) ----------
const sha256 = (v) => crypto.createHash('sha256').update(v).digest('hex')

const hashField = (raw, kind) => {
  if (!raw) return undefined
  let v = String(raw).trim().toLowerCase()
  if (kind === 'phone') {
    v = v.replace(/[^0-9]/g, '')
    if (v.length === 10) v = '1' + v          // default US country code
    v = v.replace(/^0+/, '')
  }
  if (kind === 'email') v = v.replace(/\s+/g, '')
  if (!v) return undefined
  return sha256(v)
}

function buildUserData(u = {}, req) {
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress || ''
  const ud = {
    em: hashField(u.email, 'email'),
    ph: hashField(u.phone, 'phone'),
    fn: hashField(u.firstName, 'name'),
    ln: hashField(u.lastName, 'name'),
    external_id: hashField(u.email, 'email'), // stable id from email
    client_user_agent: u.client_user_agent || req.headers['user-agent'] || undefined,
    client_ip_address: ip || undefined,
    fbp: u.fbp || undefined,
    fbc: u.fbc || undefined,
  }
  Object.keys(ud).forEach((k) => ud[k] === undefined && delete ud[k])
  return ud
}

// ---- http server ----------------------------------------------------------
const cors = (res, origin) => {
  if (ALLOWED_ORIGINS.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Vary', 'Origin')
}

const send = (res, code, obj) => {
  res.writeHead(code, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(obj))
}

const server = http.createServer((req, res) => {
  const origin = req.headers.origin || ''
  cors(res, origin)

  if (req.method === 'OPTIONS') return send(res, 204, {})
  if (req.method === 'GET' && req.url === '/health') return send(res, 200, { ok: true })
  if (req.method !== 'POST') return send(res, 405, { error: 'method not allowed' })

  let raw = ''
  req.on('data', (c) => {
    raw += c
    if (raw.length > 1e6) req.destroy() // guard against oversized payloads
  })
  req.on('end', async () => {
    let body
    try { body = JSON.parse(raw || '{}') } catch { return send(res, 400, { error: 'bad json' }) }
    if (!body.event_name) return send(res, 400, { error: 'event_name required' })

    const event = {
      event_name: body.event_name,
      event_time: body.event_time || Math.floor(Date.now() / 1000),
      event_id: body.event_id,
      event_source_url: body.event_source_url,
      action_source: body.action_source || 'website',
      user_data: buildUserData(body.user_data, req),
      custom_data: body.custom_data || undefined,
    }

    const payload = { data: [event] }
    if (META_TEST_CODE) payload.test_event_code = META_TEST_CODE

    try {
      const r = await fetch(GRAPH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, access_token: META_CAPI_TOKEN }),
      })
      const out = await r.json()
      if (!r.ok) {
        console.error('Meta CAPI error', r.status, JSON.stringify(out))
        return send(res, 502, { error: 'meta_error', detail: out })
      }
      return send(res, 200, { ok: true, event: event.event_name, meta: out })
    } catch (e) {
      console.error('relay error', e.message)
      return send(res, 500, { error: 'relay_error' })
    }
  })
})

server.listen(PORT, () => {
  console.log(`CAPI relay listening on :${PORT} -> ${GRAPH_URL}`)
  console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`)
  if (META_TEST_CODE) console.log(`TEST MODE: sending test_event_code=${META_TEST_CODE}`)
})
