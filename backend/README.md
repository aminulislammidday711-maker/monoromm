# Monorom 3 backend

Node.js/Express/MongoDB API for Monorom 3.

## Setup
1. `cd backend && npm install`
2. Copy `.env.example` to `.env` and fill `MONGODB_URI` and `JWT_SECRET`.
3. `npm run seed` to create 10 demo users.
4. `npm start`

## Admin
Admin login is handled by the backend. Default username is `admin`; set `ADMIN_PASSWORD` to the requested password (`Aminul@1`) in your deployment environment. Never put the admin password in frontend JavaScript.

## Sync
The frontend stores a local offline cache in IndexedDB and mirrors legacy localStorage keys. While offline, changes are queued. When connectivity returns, `/api/sync/push` uploads the queued key/value changes and `/api/sync/pull` downloads the newest server state. Last-write-wins is used per key.


## Automatic end-of-day reports
The browser records routine/game events offline and uploads them when connectivity returns. After a day rolls over, the client calls `/api/sync/finalize-day`. If SMTP is configured, the backend emails the daily routine report to all family/doctor contacts that have an email address. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` in Render. Phone-only contacts still require SMS integration (such as Twilio) and are not silently sent by a browser.
