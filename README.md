# FEC SDC Forum Bot

Discord bot for FECSDC membership requests. Watches a forum channel. Sends DM to post owner and replies in the post when a post is created or a tag changes.

## Flow

| Event | Message |
|---|---|
| Post created | Request submitted successfully |
| Tag: In Process | Contact a senior executive to confirm membership |
| Tag: Verified | Access granted to exclusive channels |
| Tag: Cancelled | Request cancelled, guidelines not followed |

## Stack

- Node.js 18+
- discord.js v14
- Express (health endpoint for Render pings)

## Endpoints

- `GET /` → liveness text
- `GET /health` → `{ up, ready }`

## License

ISC