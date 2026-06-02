const { ipcRenderer } = require("electron");

const fallbackData = {
  profile: {
    name: "EveryTachyon",
    level: 143,
    queue: "SR - Normal - Draft",
    estimated: "00:37"
  },
  mvp: {
    totalMatches: 240,
    wins: 132,
    mvpAwards: 38,
    bestChampion: "Ahri",
    avgKda: "6.8 / 3.1 / 8.2"
  },
  summoners: [
    { id: "SUM-001", name: "EveryTachyon", level: 143, region: "EUW", mainRole: "Mid" },
    { id: "SUM-002", name: "WOOF Gojo", level: 121, region: "EUW", mainRole: "Top" },
    { id: "SUM-003", name: "Athena Polias", level: 85, region: "EUNE", mainRole: "Support" }
  ],
  champions: [
    { id: "CH-001", name: "Ahri", role: "Mage", difficulty: "Medium", games: 72 },
    { id: "CH-002", name: "Lee Sin", role: "Fighter", difficulty: "Hard", games: 34 },
    { id: "CH-003", name: "Jinx", role: "Marksman", difficulty: "Easy", games: 29 },
    { id: "CH-004", name: "Thresh", role: "Support", difficulty: "Hard", games: 25 }
  ],
  matchHistory: [
    { id: "M-11201", queue: "Solo", champion: "Ahri", kda: "10/2/8", result: "Win", mvp: true },
    { id: "M-11202", queue: "Flex", champion: "Lee Sin", kda: "5/5/11", result: "Win", mvp: false },
    { id: "M-11203", queue: "Solo", champion: "Jinx", kda: "3/7/4", result: "Loss", mvp: false },
    { id: "M-11204", queue: "Solo", champion: "Ahri", kda: "12/1/9", result: "Win", mvp: true },
    { id: "M-11205", queue: "Normal", champion: "Thresh", kda: "1/6/21", result: "Win", mvp: false }
  ],
  runePages: [
    { id: "R-01", name: "Ahri Burst", primary: "Domination", secondary: "Sorcery" },
    { id: "R-02", name: "Jinx DPS", primary: "Precision", secondary: "Inspiration" },
    { id: "R-03", name: "Tank Engage", primary: "Resolve", secondary: "Inspiration" }
  ],
  ranks: [
    { queue: "Solo/Duo", tier: "Emerald II", lp: 71, wins: 124, losses: 103 },
    { queue: "Flex", tier: "Platinum I", lp: 39, wins: 56, losses: 48 }
  ],
  friends: [
    { name: "WOOF Gojo", status: "online", game: "Doof Arsch" },
    { name: "Athena Polias", status: "online", game: "Riot Mobile" },
    { name: "Qofer", status: "away", game: "Riot Mobile" },
    { name: "Tinpitthar", status: "offline", game: "Riot Mobile" },
    { name: "topelt karises", status: "away", game: "Away" }
  ],
  dbConnected: false
};

let data = { ...fallbackData };

const views = {
  play: () => `
    <section class="screen">
      <h2 class="screen-title">Queue Lobby</h2>
      <div class="queue-layout">
        <div class="queue-board">
          <div class="queue-top">${data.profile.queue}</div>
          <div class="slots">
            <div class="slot"><div class="orb"></div></div>
            <div class="slot"><div class="orb"></div></div>
            <div class="slot main-slot">
              <div>
                <div class="orb"></div>
                <div style="margin-top:12px;font-weight:700;">${data.profile.name}</div>
                <div style="margin-top:6px;color:#8ea4c6;">Level ${data.profile.level}</div>
              </div>
            </div>
            <div class="slot"><div class="orb"></div></div>
            <div class="slot"><div class="orb"></div></div>
          </div>

          <div class="queue-bottom">
            <button class="queue-btn warn" type="button">Decline</button>
            <span class="pill">IN QUEUE</span>
            <button class="queue-btn" type="button">Find Match</button>
          </div>
        </div>

        <div class="card">
          <h3>Invites</h3>
          <p>No pending invites</p>
          <h3>Suggested</h3>
          <p>WOOF Gojo</p>
          <p>Athena Polias</p>
        </div>
      </div>
    </section>
  `,

  overview: () => `
    <section class="screen">
      <h2 class="screen-title">MVP Dashboard</h2>
      <div class="grid">
        <div class="kpi"><div class="label">Total Matches</div><div class="value">${data.mvp.totalMatches}</div></div>
        <div class="kpi"><div class="label">Wins</div><div class="value">${data.mvp.wins}</div></div>
        <div class="kpi"><div class="label">MVP Awards</div><div class="value">${data.mvp.mvpAwards}</div></div>
        <div class="kpi"><div class="label">Best Champion</div><div class="value">${data.mvp.bestChampion}</div></div>
      </div>
      <div class="card">
        <h3>Average KDA</h3>
        <p>${data.mvp.avgKda}</p>
      </div>
    </section>
  `,

    database: () => `
      <section class="screen">
      <h2 class="screen-title">Andmebaasi kirjeldus</h2>
      <div class="card">
        <h3>Kus andmebaas?</h3>
        <p>Andmebaas: <strong>MySQL</strong> (${data.dbConnected ? "connected" : "not connected, fallback data"}).</p>
        <p>Host: localhost, database: <code>lolclient</code></p>
        <p>Init command: <code>npm run db:init</code></p>
      </div>
      <div class="card">
        <h3>Tabelid</h3>
        <table>
          <thead><tr><th>Table</th><th>Fields</th></tr></thead>
          <tbody>
            <tr><td>summoners</td><td>id, name, level, region, main_role</td></tr>
            <tr><td>champions</td><td>id, name, role, difficulty, games</td></tr>
            <tr><td>match_history</td><td>id, summoner_id, champion_id, queue, kda, result, mvp</td></tr>
            <tr><td>rune_pages</td><td>id, summoner_id, name, primary_tree, secondary_tree</td></tr>
            <tr><td>ranks</td><td>summoner_id, queue, tier, lp, wins, losses</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `,

  relations: () => `
    <section class="screen">
      <h2 class="screen-title">Seosed (Relations)</h2>
      <div class="card">
        <ul>
          <li>Summoner 1 -> N MatchHistory</li>
          <li>Champion 1 -> N MatchHistory</li>
          <li>Summoner 1 -> N RunePages</li>
          <li>Summoner 1 -> N Ranks</li>
        </ul>
      </div>
      <div class="card">
        <h3>MVP logic</h3>
        <p>MVP salvestub match_history kirjesse boolean väärtusena.</p>
      </div>
    </section>
  `,

  summoners: () => `
    <section class="screen">
      <h2 class="screen-title">Summoners</h2>
      <div class="card">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Level</th><th>Region</th><th>Main role</th></tr></thead>
          <tbody>
            ${data.summoners.map((s) => `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.level}</td><td>${s.region}</td><td>${s.mainRole}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `,

  champions: () => `
    <section class="screen">
      <h2 class="screen-title">Champions</h2>
      <div class="card">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Difficulty</th><th>Games</th></tr></thead>
          <tbody>
            ${data.champions.map((c) => `<tr><td>${c.id}</td><td>${c.name}</td><td>${c.role}</td><td>${c.difficulty}</td><td>${c.games}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `,

  matches: () => `
    <section class="screen">
      <h2 class="screen-title">Match History</h2>
      <div class="card">
        <table>
          <thead><tr><th>Match</th><th>Queue</th><th>Champion</th><th>KDA</th><th>Result</th><th>MVP</th></tr></thead>
          <tbody>
            ${data.matchHistory.map((m) => `<tr><td>${m.id}</td><td>${m.queue}</td><td>${m.champion}</td><td>${m.kda}</td><td class="${m.result === "Win" ? "positive" : "negative"}">${m.result}</td><td>${m.mvp ? "Yes" : "No"}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `,

  runes: () => `
    <section class="screen">
      <h2 class="screen-title">Rune Pages / Masteries</h2>
      <div class="card">
        <table>
          <thead><tr><th>ID</th><th>Page</th><th>Primary</th><th>Secondary</th></tr></thead>
          <tbody>
            ${data.runePages.map((r) => `<tr><td>${r.id}</td><td>${r.name}</td><td>${r.primary}</td><td>${r.secondary}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `,

  ranks: () => `
    <section class="screen">
      <h2 class="screen-title">Ranks</h2>
      <div class="card">
        <table>
          <thead><tr><th>Queue</th><th>Tier</th><th>LP</th><th>Wins</th><th>Losses</th><th>Winrate</th></tr></thead>
          <tbody>
            ${data.ranks.map((r) => {
              const total = r.wins + r.losses;
              const wr = ((r.wins / total) * 100).toFixed(1);
              return `<tr><td>${r.queue}</td><td>${r.tier}</td><td>${r.lp}</td><td>${r.wins}</td><td>${r.losses}</td><td>${wr}%</td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `
};

function renderSocialPanel() {
  const panel = document.getElementById("social-panel");
  panel.innerHTML = `
    <div class="card finding">
      <h3>Finding Match</h3>
      <div class="timer" id="queue-timer">0:38</div>
      <small>Estimated: ${data.profile.estimated}</small>
    </div>
    <div class="card social-list">
      <h3>Social</h3>
      ${data.friends.map((f) => `
        <div class="row">
          <div><span class="status ${f.status}"></span>${f.name}</div>
          <div>${f.game}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function render(viewName) {
  const target = document.getElementById("main-content");
  target.innerHTML = views[viewName]();
}

function setActiveNav(viewName) {
  document.querySelectorAll(".rail-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });
}

function bindNav() {
  document.querySelectorAll(".rail-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const viewName = btn.dataset.view;
      setActiveNav(viewName);
      render(viewName);
    });
  });
}

function startQueueTimer() {
  const timer = document.getElementById("queue-timer");
  if (!timer) {
    return;
  }

  let seconds = 38;
  setInterval(() => {
    seconds += 1;
    const mins = Math.floor(seconds / 60);
    const secs = String(seconds % 60).padStart(2, "0");
    timer.textContent = `${mins}:${secs}`;
  }, 1000);
}

async function loadDataFromDatabase() {
  try {
    const loaded = await ipcRenderer.invoke("db:get-client-data");
    if (loaded) {
      data = loaded;
    }
  } catch (error) {
    console.warn("Could not load MySQL data:", error.message);
  }
}

async function boot() {
  await loadDataFromDatabase();
  renderSocialPanel();
  bindNav();
  render("play");
  startQueueTimer();
}

boot();
