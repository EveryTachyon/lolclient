const { getPool } = require("./connection");

function padCode(prefix, id) {
  return `${prefix}-${String(id).padStart(3, "0")}`;
}

async function getPrimarySummonerId() {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT id FROM summoners WHERE is_primary = 1 ORDER BY id LIMIT 1"
  );
  if (rows.length) {
    return rows[0].id;
  }
  const [fallback] = await pool.query("SELECT id FROM summoners ORDER BY id LIMIT 1");
  return fallback[0]?.id || 1;
}

async function loadClientData() {
  const pool = getPool();
  const summonerId = await getPrimarySummonerId();

  const [profileRows] = await pool.query(
    `SELECT name, level, queue_label AS queue, queue_estimated AS estimated, rp, blue_essence
     FROM summoners WHERE id = ?`,
    [summonerId]
  );

  const [summonerRows] = await pool.query(
    "SELECT id, name, level, region, main_role AS mainRole FROM summoners ORDER BY id"
  );

  const [championRows] = await pool.query(
    "SELECT id, name, role, difficulty, games_played AS games FROM champions ORDER BY id"
  );

  const [matchRows] = await pool.query(
    `SELECT mh.match_code AS id, mh.queue_type AS queue, c.name AS champion,
            mh.kills, mh.deaths, mh.assists, mh.result, mh.mvp
     FROM match_history mh
     JOIN champions c ON c.id = mh.champion_id
     WHERE mh.summoner_id = ?
     ORDER BY mh.played_at DESC`,
    [summonerId]
  );

  const [runeRows] = await pool.query(
    `SELECT page_code AS id, name, primary_tree AS primary, secondary_tree AS secondary
     FROM rune_pages WHERE summoner_id = ? ORDER BY id`,
    [summonerId]
  );

  const [rankRows] = await pool.query(
    `SELECT queue_type AS queue, tier, lp, wins, losses
     FROM ranks WHERE summoner_id = ? ORDER BY id`,
    [summonerId]
  );

  const [friendRows] = await pool.query(
    `SELECT friend_name AS name, status, game_status AS game
     FROM friends WHERE summoner_id = ? ORDER BY id`,
    [summonerId]
  );

  const [mvpRows] = await pool.query(
    `SELECT
       COUNT(*) AS totalMatches,
       SUM(result = 'Win') AS wins,
       SUM(mvp = 1) AS mvpAwards,
       ROUND(AVG((kills + assists) / GREATEST(deaths, 1)), 1) AS avgKdaRatio
     FROM match_history
     WHERE summoner_id = ?`,
    [summonerId]
  );

  const [bestChampionRows] = await pool.query(
    `SELECT c.name, SUM(mh.result = 'Win') AS wins, COUNT(*) AS games
     FROM match_history mh
     JOIN champions c ON c.id = mh.champion_id
     WHERE mh.summoner_id = ?
     GROUP BY c.id, c.name
     ORDER BY wins DESC, games DESC
     LIMIT 1`,
    [summonerId]
  );

  const profile = profileRows[0];
  const mvpStats = mvpRows[0] || {};
  const avgKdaRatio = Number(mvpStats.avgKdaRatio || 0);

  return {
    profile: {
      name: profile.name,
      level: profile.level,
      queue: profile.queue,
      estimated: profile.estimated,
      rp: profile.rp,
      blueEssence: profile.blue_essence
    },
    mvp: {
      totalMatches: Number(mvpStats.totalMatches || 0),
      wins: Number(mvpStats.wins || 0),
      mvpAwards: Number(mvpStats.mvpAwards || 0),
      bestChampion: bestChampionRows[0]?.name || "N/A",
      avgKda: `${avgKdaRatio} KDA ratio`
    },
    summoners: summonerRows.map((s) => ({
      id: padCode("SUM", s.id),
      name: s.name,
      level: s.level,
      region: s.region,
      mainRole: s.mainRole
    })),
    champions: championRows.map((c) => ({
      id: padCode("CH", c.id),
      name: c.name,
      role: c.role,
      difficulty: c.difficulty,
      games: c.games
    })),
    matchHistory: matchRows.map((m) => ({
      id: m.id,
      queue: m.queue,
      champion: m.champion,
      kda: `${m.kills}/${m.deaths}/${m.assists}`,
      result: m.result,
      mvp: Boolean(m.mvp)
    })),
    runePages: runeRows.map((r) => ({
      id: r.id,
      name: r.name,
      primary: r.primary,
      secondary: r.secondary
    })),
    ranks: rankRows,
    friends: friendRows,
    dbConnected: true
  };
}

module.exports = { loadClientData, ping: require("./connection").ping };
