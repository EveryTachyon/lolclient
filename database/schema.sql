CREATE TABLE IF NOT EXISTS summoners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  level INT NOT NULL DEFAULT 1,
  region VARCHAR(16) NOT NULL,
  main_role VARCHAR(16) NOT NULL,
  rp INT NOT NULL DEFAULT 0,
  blue_essence INT NOT NULL DEFAULT 0,
  queue_label VARCHAR(128) DEFAULT 'SR - Normal - Draft',
  queue_estimated VARCHAR(16) DEFAULT '00:37',
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS champions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE,
  role VARCHAR(32) NOT NULL,
  difficulty VARCHAR(16) NOT NULL,
  games_played INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS match_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  match_code VARCHAR(16) NOT NULL,
  summoner_id INT NOT NULL,
  champion_id INT NOT NULL,
  queue_type VARCHAR(32) NOT NULL,
  kills INT NOT NULL,
  deaths INT NOT NULL,
  assists INT NOT NULL,
  result ENUM('Win', 'Loss') NOT NULL,
  mvp TINYINT(1) NOT NULL DEFAULT 0,
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_match_summoner FOREIGN KEY (summoner_id) REFERENCES summoners(id) ON DELETE CASCADE,
  CONSTRAINT fk_match_champion FOREIGN KEY (champion_id) REFERENCES champions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rune_pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_code VARCHAR(16) NOT NULL,
  summoner_id INT NOT NULL,
  name VARCHAR(64) NOT NULL,
  primary_tree VARCHAR(32) NOT NULL,
  secondary_tree VARCHAR(32) NOT NULL,
  CONSTRAINT fk_rune_summoner FOREIGN KEY (summoner_id) REFERENCES summoners(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ranks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  summoner_id INT NOT NULL,
  queue_type VARCHAR(32) NOT NULL,
  tier VARCHAR(32) NOT NULL,
  lp INT NOT NULL DEFAULT 0,
  wins INT NOT NULL DEFAULT 0,
  losses INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_rank_summoner FOREIGN KEY (summoner_id) REFERENCES summoners(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS friends (
  id INT AUTO_INCREMENT PRIMARY KEY,
  summoner_id INT NOT NULL,
  friend_name VARCHAR(64) NOT NULL,
  status ENUM('online', 'away', 'offline') NOT NULL DEFAULT 'offline',
  game_status VARCHAR(128) DEFAULT '',
  CONSTRAINT fk_friend_summoner FOREIGN KEY (summoner_id) REFERENCES summoners(id) ON DELETE CASCADE
);
