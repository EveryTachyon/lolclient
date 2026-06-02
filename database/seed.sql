INSERT INTO summoners (name, level, region, main_role, rp, blue_essence, queue_label, queue_estimated, is_primary) VALUES
('EveryTachyon', 143, 'EUW', 'Mid', 0, 7921, 'SR - Normal - Draft', '00:37', 1),
('WOOF Gojo', 121, 'EUW', 'Top', 0, 1200, 'SR - Normal - Draft', '01:10', 0),
('Athena Polias', 85, 'EUNE', 'Support', 0, 900, 'SR - Normal - Draft', '01:25', 0);

INSERT INTO champions (name, role, difficulty, games_played) VALUES
('Ahri', 'Mage', 'Medium', 72),
('Lee Sin', 'Fighter', 'Hard', 34),
('Jinx', 'Marksman', 'Easy', 29),
('Thresh', 'Support', 'Hard', 25);

INSERT INTO match_history (match_code, summoner_id, champion_id, queue_type, kills, deaths, assists, result, mvp) VALUES
('M-11201', 1, 1, 'Solo', 10, 2, 8, 'Win', 1),
('M-11202', 1, 2, 'Flex', 5, 5, 11, 'Win', 0),
('M-11203', 1, 3, 'Solo', 3, 7, 4, 'Loss', 0),
('M-11204', 1, 1, 'Solo', 12, 1, 9, 'Win', 1),
('M-11205', 1, 4, 'Normal', 1, 6, 21, 'Win', 0);

INSERT INTO rune_pages (page_code, summoner_id, name, primary_tree, secondary_tree) VALUES
('R-01', 1, 'Ahri Burst', 'Domination', 'Sorcery'),
('R-02', 1, 'Jinx DPS', 'Precision', 'Inspiration'),
('R-03', 1, 'Tank Engage', 'Resolve', 'Inspiration');

INSERT INTO ranks (summoner_id, queue_type, tier, lp, wins, losses) VALUES
(1, 'Solo/Duo', 'Emerald II', 71, 124, 103),
(1, 'Flex', 'Platinum I', 39, 56, 48);

INSERT INTO friends (summoner_id, friend_name, status, game_status) VALUES
(1, 'WOOF Gojo', 'online', 'Doof Arsch'),
(1, 'Athena Polias', 'online', 'Riot Mobile'),
(1, 'Qofer', 'away', 'Riot Mobile'),
(1, 'Tinpitthar', 'offline', 'Riot Mobile'),
(1, 'topelt karises', 'away', 'Away');
