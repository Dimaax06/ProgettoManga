USE dimangax;

-- Admin user (password: admin123)
INSERT IGNORE INTO users (id, username, email, password_hash, role) VALUES
('admin-uuid-0001', 'DiMangaX_Admin', 'admin@dimangax.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK3jB4dZy', 'admin');

-- Demo user (password: demo123)
INSERT IGNORE INTO users (id, username, email, password_hash, role, bio) VALUES
('user-uuid-0001', 'OtakuPrime', 'demo@dimangax.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uJne/oYSa.', 'user', 'Hardcore manga reader since 2010. Fan of dark fantasy and psychological thrillers.');

-- Manga catalog
INSERT IGNORE INTO manga (id, title, author, description, cover_url, genres, status, chapters, year, is_featured) VALUES
('manga-001', 'Demon Slayer: Kimetsu no Yaiba', 'Koyoharu Gotouge',
 'A young boy becomes a demon slayer after his family is slaughtered and his sister is turned into a demon. Set in Taisho-era Japan, this epic tale follows Tanjiro Kamado as he joins the Demon Slayer Corps to find a cure for his sister and avenge his family.',
 'https://m.media-amazon.com/images/I/81Dp9LKML5L.jpg',
 '["Action","Adventure","Supernatural","Fantasy","Shounen"]', 'completed', 205, 2016, 1),

('manga-002', 'Attack on Titan', 'Hajime Isayama',
 'In a world where humanity lives within enormous walled cities to protect themselves from Titans, gigantic humanoid creatures who devour humans seemingly without reason, the story follows Eren Yeager who vows to exterminate the Titans after they destroy his hometown.',
 'https://m.media-amazon.com/images/I/71dHOQ8RBPL.jpg',
 '["Action","Drama","Fantasy","Horror","Mystery","Shounen"]', 'completed', 139, 2009, 1),

('manga-003', 'One Piece', 'Eiichiro Oda',
 'The story follows the adventures of Monkey D. Luffy, who, inspired by his childhood hero "Red-Haired" Shanks, sets off on a journey from the East Blue Sea to find the fabled treasure the "One Piece" and proclaim himself the King of the Pirates.',
 'https://m.media-amazon.com/images/I/81CEG-RJJEL.jpg',
 '["Action","Adventure","Comedy","Fantasy","Shounen"]', 'ongoing', 1107, 1997, 1),

('manga-004', 'Jujutsu Kaisen', 'Gege Akutami',
 'A boy swallows a cursed talisman – the finger of a Demon – and becomes cursed himself. He enters a shaman school to be able to locate the demon''s other body parts and thus exorcise himself.',
 'https://m.media-amazon.com/images/I/81xzQaHCVOL.jpg',
 '["Action","Fantasy","Horror","Supernatural","Shounen"]', 'ongoing', 265, 2018, 1),

('manga-005', 'Naruto', 'Masashi Kishimoto',
 'Naruto Uzumaki, a mischievous adolescent ninja, struggles as he searches for recognition and dreams of becoming the Hokage, the village''s leader and strongest ninja.',
 'https://m.media-amazon.com/images/I/81oOPnPDaHL.jpg',
 '["Action","Adventure","Comedy","Fantasy","Shounen"]', 'completed', 700, 1999, 1),

('manga-006', 'Death Note', 'Tsugumi Ohba',
 'Light Yagami is an ace student with great prospects—and he''s bored out of his mind. But all that changes when he finds the Death Note, a notebook dropped by a rogue Shinigami death god.',
 'https://m.media-amazon.com/images/I/71tPvKOmLGL.jpg',
 '["Mystery","Psychological","Supernatural","Thriller","Seinen"]', 'completed', 108, 2003, 1),

('manga-007', 'Fullmetal Alchemist', 'Hiromu Arakawa',
 'Two brothers use alchemy to try to bring their deceased mother back to life, but the attempt fails, and they pay a terrible price. Now they seek the Philosopher''s Stone to restore themselves.',
 'https://m.media-amazon.com/images/I/813E1hBGezL.jpg',
 '["Action","Adventure","Fantasy","Sci-Fi","Shounen"]', 'completed', 116, 2001, 1),

('manga-008', 'My Hero Academia', 'Kohei Horikoshi',
 'In a world where 80% of people have some kind of super-powered Quirk, Izuku Midoriya was unlucky enough to be born completely normal. But that won''t stop him from enrolling in a prestigious hero academy.',
 'https://m.media-amazon.com/images/I/81LBxCflXML.jpg',
 '["Action","Comedy","Fantasy","Shounen","Supernatural"]', 'completed', 430, 2014, 1),

('manga-009', 'Berserk', 'Kentaro Miura',
 'Guts is a lone mercenary warrior struggling for his survival in a brutal medieval world. He bears a Brand of Sacrifice, which marks him as a target for malicious supernatural creatures called Apostles.',
 'https://m.media-amazon.com/images/I/81kJSEiDSoL.jpg',
 '["Action","Adventure","Drama","Fantasy","Horror","Seinen"]', 'ongoing', 374, 1989, 1),

('manga-010', 'Chainsaw Man', 'Tatsuki Fujimoto',
 'Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while repaying his debt by working as a Devil Hunter.',
 'https://m.media-amazon.com/images/I/81U8HAn4heL.jpg',
 '["Action","Comedy","Fantasy","Horror","Supernatural"]', 'ongoing', 170, 2018, 1),

('manga-011', 'Vinland Saga', 'Makoto Yukimura',
 'Thorfinn, the son of the greatest warrior in Iceland, grows up dreaming of reaching Vinland — an unexplored land in the New World. After his father is killed, Thorfinn dedicates his life to revenge.',
 'https://m.media-amazon.com/images/I/81a8+G9+VNL.jpg',
 '["Action","Adventure","Drama","History","Seinen"]', 'ongoing', 210, 2005, 0),

('manga-012', 'Tokyo Ghoul', 'Sui Ishida',
 'Ken Kaneki is a bookworm college student who is half-killed in a ghoul attack. He is taken to the hospital in critical condition and is saved by receiving an organ transplant from a ghoul. Now he must adapt to life as a ghoul while surviving in a dangerous world.',
 'https://m.media-amazon.com/images/I/71V7ZNdnLlL.jpg',
 '["Action","Drama","Fantasy","Horror","Mystery","Seinen"]', 'completed', 143, 2011, 0),

('manga-013', 'Hunter x Hunter', 'Yoshihiro Togashi',
 'Gon Freecss, a young boy from Whale Island, dreams of following in his absent father''s footsteps and becoming a Hunter. Hunters are licensed elites who specialize in finding people, places, and objects.',
 'https://m.media-amazon.com/images/I/71yOzXSbx5L.jpg',
 '["Action","Adventure","Fantasy","Shounen","Supernatural"]', 'hiatus', 401, 1998, 0),

('manga-014', 'Vagabond', 'Takehiko Inoue',
 'A fictionalized account of the life of the legendary Japanese swordsman Miyamoto Musashi, considered the greatest ever to have lived. Set in the turbulent early 17th century.',
 'https://m.media-amazon.com/images/I/51Tc0nVSiNL.jpg',
 '["Action","Adventure","Drama","History","Seinen"]', 'hiatus', 327, 1998, 0),

('manga-015', 'Slam Dunk', 'Takehiko Inoue',
 'Hanamichi Sakuragi, a delinquent high school student, joins the basketball team after falling for a girl who likes basketball. His raw athletic talent and competitive spirit drive him to become one of the best players.',
 'https://m.media-amazon.com/images/I/71j-wPe4MQL.jpg',
 '["Comedy","Drama","Romance","Sports","Shounen"]', 'completed', 276, 1990, 0);

-- Sample reviews
INSERT IGNORE INTO reviews (id, user_id, manga_id, rating, comment) VALUES
('rev-001', 'user-uuid-0001', 'manga-001', 5, 'An absolute masterpiece. The fight choreography and emotional depth are unparalleled. Tanjiro''s journey is one of the most heartfelt in manga history.'),
('rev-002', 'user-uuid-0001', 'manga-002', 5, 'Attack on Titan is a generational masterpiece. The plot twists, the lore, the moral complexity — nothing comes close. Isayama is a genius.'),
('rev-003', 'user-uuid-0001', 'manga-006', 5, 'Death Note is psychological warfare at its finest. The cat and mouse between Light and L is some of the most thrilling storytelling in manga.'),
('rev-004', 'user-uuid-0001', 'manga-009', 5, 'Berserk is the gold standard of dark fantasy. Miura''s artwork and world-building are on another level entirely. A true legend.');

-- Sample favorites
INSERT IGNORE INTO favorites (id, user_id, manga_id) VALUES
('fav-001', 'user-uuid-0001', 'manga-001'),
('fav-002', 'user-uuid-0001', 'manga-002'),
('fav-003', 'user-uuid-0001', 'manga-004'),
('fav-004', 'user-uuid-0001', 'manga-009');
