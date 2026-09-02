# Meta Conversions API — MOVED

**There is no relay in this repo any more. Do not re-add one.**

The store posts its CAPI events to `https://capi.affordableairdirect.com/api/capi`
(see `capiUrl` in `src/data/config.js`). That hostname resolves to the
**aha-team-hub** container, not to anything here:

| | |
|---|---|
| Route | `aha-team-hub/app/api/capi/route.ts` |
| Payload builder | `aha-team-hub/lib/metaCapi.ts` → `buildUserData()` |
| Pixel id / CAPI token | `/opt/aha-team-hub/.env` on the VPS |

## Why this file exists instead of the code

A standalone Node relay used to live here (`index.js`, run under pm2). It was
superseded by the hub route and never deployed again — `/opt/aad-capi-relay` does
not exist, no pm2 process runs it, and nothing outside Docker listens on the box.

It was deleted on 2026-09-02 because it had become actively misleading: its
`buildUserData()` had drifted out of date and sent **no location match keys at
all** (no `zp`, `ct`, `st`, `country`), while the live hub builder sends all four.
Reading this folder to answer "what do we send Meta?" gives you the wrong answer,
and that is exactly what happened during an investigation into out-of-area ad
targeting.

If you need to change what goes to Meta, change `lib/metaCapi.ts` in aha-team-hub.
