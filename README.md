# Full League Client MVP

This is a full desktop League-style client mock made with Electron.
It includes play queue UI, social panel, and full data sections for MVP/database modeling.

## How to start

```bash
npm install
npm start
```

## Client parts (all included)

- Top bar: party, game tabs, RP/BE, profile
- Play screen: queue lobby with team slots and queue timer
- Social panel: friend list with status
- MVP dashboard: wins, matches, MVP awards, KDA
- Summoners view
- Champions view
- Match History view
- Rune Pages / Masteries view
- Ranks view
- Andmebaasi kirjeldus view
- Seosed view

## File overview

- `main.js` - Electron window/bootstrap
- `index.html` - app layout/shell
- `style.css` - full client theme/styles
- `app.js` - client logic, routing, data, queue timer
- `CLIENT_SPEC.md` - full crafted MVP/database/seosed specification

## Andmebaasi kirjeldus (MVP)

Current implementation uses in-memory data in `app.js`.
Production recommendation: backend API + PostgreSQL database.

### Suggested tables

- `summoners` (`id`, `name`, `level`, `region`, `main_role`)
- `champions` (`id`, `name`, `role`, `difficulty`, `games`)
- `match_history` (`id`, `summoner_id`, `champion_id`, `queue`, `kda`, `result`, `mvp`)
- `rune_pages` (`id`, `summoner_id`, `name`, `primary_tree`, `secondary_tree`)
- `ranks` (`summoner_id`, `queue`, `tier`, `lp`, `wins`, `losses`)

### Seosed

- Summoner 1 -> N MatchHistory
- Champion 1 -> N MatchHistory
- Summoner 1 -> N RunePages
- Summoner 1 -> N Ranks
