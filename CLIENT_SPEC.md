# Full Client Spec (MVP)

## Okei - Scope

This client includes a full MVP data model and UI structure for a League-style desktop app:

- Play/Queue client screen
- Social panel
- Summoners
- Champions
- MatchHistory
- Rune pages (masteries)
- Ranks
- MVP dashboard
- Database description and entity relations

## Kus andmebaas?

### Current MVP

Database is simulated with in-memory JSON in `app.js` for fast prototyping and UI testing.

### Production-ready target

- Backend API service (Node.js/Express or similar)
- PostgreSQL database
- Optional Redis cache for profiles/leaderboards

Suggested environment:

- Local development: Docker PostgreSQL or local Postgres service
- Production: managed PostgreSQL (AWS RDS, Supabase, Railway, etc.)

## Andmebaasi kirjeldus

### Core tables

1. `summoners`
   - `id` (PK)
   - `name`
   - `level`
   - `region`
   - `main_role`
   - `created_at`

2. `champions`
   - `id` (PK)
   - `name`
   - `role`
   - `difficulty`
   - `release_patch`

3. `match_history`
   - `id` (PK)
   - `summoner_id` (FK -> summoners.id)
   - `champion_id` (FK -> champions.id)
   - `queue_type`
   - `kills`
   - `deaths`
   - `assists`
   - `result` (WIN/LOSS)
   - `mvp` (boolean)
   - `played_at`

4. `rune_pages`
   - `id` (PK)
   - `summoner_id` (FK -> summoners.id)
   - `name`
   - `primary_tree`
   - `secondary_tree`
   - `shard_1`
   - `shard_2`
   - `shard_3`

5. `ranks`
   - `id` (PK)
   - `summoner_id` (FK -> summoners.id)
   - `queue_type` (SOLO_DUO/FLEX)
   - `tier` (IRON..CHALLENGER)
   - `division` (IV..I)
   - `lp`
   - `wins`
   - `losses`
   - `updated_at`

## Seosed (Relations)

- Summoner `1 -> N` MatchHistory
- Champion `1 -> N` MatchHistory
- Summoner `1 -> N` RunePages
- Summoner `1 -> N` Ranks

Logical extras:

- Champion performance can be aggregated from `match_history`.
- MVP score is derived from each match row (`mvp = true`) and summed per summoner/champion.

## MVP Metrics

Recommended MVP dashboard values:

- Total matches
- Total wins
- Winrate %
- MVP awards
- Best champion by winrate
- Average K/D/A

Example formulas:

- `winrate = wins / (wins + losses) * 100`
- `avg_kda = (sum(kills + assists) / max(sum(deaths), 1))`
- `mvp_count = count(match_history where mvp = true)`

## Summoners module

View fields:

- Name
- Level
- Region
- Main role
- Last active

Actions:

- Search summoner
- Filter by region
- Open profile

## Champions module

View fields:

- Champion name
- Role
- Difficulty
- Games played
- Winrate

Actions:

- Sort by games/winrate
- Filter by role

## MatchHistory module

View fields:

- Match ID
- Queue type
- Champion
- K/D/A
- Result
- MVP
- Date/time

Actions:

- Filter by queue
- Filter wins/losses
- Filter by champion

## Rune Pages / Masteries module

View fields:

- Page name
- Primary tree
- Secondary tree
- Shards

Actions:

- Create page
- Duplicate page
- Delete page
- Set active page per champion/role

## Ranks module

View fields:

- Queue type
- Tier + Division
- LP
- Wins
- Losses
- Winrate

Actions:

- Switch queue view (Solo/Flex)
- Season split history

## API endpoints (recommended)

- `GET /api/summoners`
- `GET /api/summoners/:id`
- `GET /api/champions`
- `GET /api/matches?summonerId=:id`
- `GET /api/runes?summonerId=:id`
- `GET /api/ranks?summonerId=:id`
- `GET /api/mvp?summonerId=:id`

## Final MVP checklist

- [x] Summoners view
- [x] Champions view
- [x] MatchHistory view
- [x] Rune pages (masteries) view
- [x] Ranks view
- [x] MVP dashboard
- [x] Andmebaasi kirjeldus
- [x] Seosed
