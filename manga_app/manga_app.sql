DROP DATABASE IF EXISTS manga_app;
CREATE DATABASE manga_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE manga_app;

-- =====================================================
-- TABELLA UTENTI
-- =====================================================

CREATE TABLE utenti (
    id INT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    ruolo ENUM('user', 'admin') DEFAULT 'user',

    banned TINYINT(1) DEFAULT 0,

    avatar VARCHAR(255) DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELLA MANGA
-- =====================================================

CREATE TABLE manga (
    id INT AUTO_INCREMENT PRIMARY KEY,

    titolo VARCHAR(255) NOT NULL,
    autore VARCHAR(255) NOT NULL,

    descrizione TEXT,

    anno INT,

    stato VARCHAR(50),

    immagine VARCHAR(255),

    banner VARCHAR(255) DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELLA GENERI
-- =====================================================

CREATE TABLE generi (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL UNIQUE
);

-- =====================================================
-- RELAZIONE MANGA ↔ GENERI
-- =====================================================

CREATE TABLE manga_generi (
    id INT AUTO_INCREMENT PRIMARY KEY,

    id_manga INT NOT NULL,
    id_genere INT NOT NULL,

    FOREIGN KEY (id_manga)
        REFERENCES manga(id)
        ON DELETE CASCADE,

    FOREIGN KEY (id_genere)
        REFERENCES generi(id)
        ON DELETE CASCADE
);

-- =====================================================
-- TABELLA RECENSIONI
-- =====================================================

CREATE TABLE recensioni (
    id INT AUTO_INCREMENT PRIMARY KEY,

    id_utente INT NOT NULL,
    id_manga INT NOT NULL,

    voto INT NOT NULL CHECK (voto BETWEEN 1 AND 5),

    commento TEXT,

    data_recensione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_utente)
        REFERENCES utenti(id)
        ON DELETE CASCADE,

    FOREIGN KEY (id_manga)
        REFERENCES manga(id)
        ON DELETE CASCADE
);

-- =====================================================
-- TABELLA PREFERITI
-- =====================================================

CREATE TABLE preferiti (
    id INT AUTO_INCREMENT PRIMARY KEY,

    id_utente INT NOT NULL,
    id_manga INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_utente)
        REFERENCES utenti(id)
        ON DELETE CASCADE,

    FOREIGN KEY (id_manga)
        REFERENCES manga(id)
        ON DELETE CASCADE,

    UNIQUE KEY unique_preferito (id_utente, id_manga)
);

-- =====================================================
-- ADMIN DI DEFAULT
-- password: admin123
-- =====================================================

INSERT INTO utenti (
    username,
    password,
    ruolo
)
VALUES (
    'admin',
    '$2y$10$wH9Q5L6M6f5D1Dq2n8Q8WuL8S2Qz0M6K7zH8hK1P3nX8M4zK7L1uK',
    'admin'
);

-- =====================================================
-- GENERI BASE
-- =====================================================

INSERT INTO generi (nome) VALUES
('Azione'),
('Avventura'),
('Fantasy'),
('Horror'),
('Commedia'),
('Romantico'),
('Slice of Life'),
('Thriller'),
('Psicologico'),
('Sci-Fi'),
('Shonen'),
('Seinen');

-- =====================================================
-- MANGA DEMO
-- =====================================================

INSERT INTO manga (
    titolo,
    autore,
    descrizione,
    anno,
    stato,
    immagine,
    banner
)
VALUES
(
    'Jujutsu Kaisen',
    'Gege Akutami',
    'Yuji Itadori entra nel mondo delle maledizioni affrontando potenti nemici insieme agli stregoni della Jujutsu High.',
    2018,
    'In corso',
    'jujutsu_kaisen.jpg',
    'jujutsu_banner.jpg'
),
(
    'Attack on Titan',
    'Hajime Isayama',
    'L’umanità combatte per la sopravvivenza contro giganteschi Titani divoratori di uomini.',
    2009,
    'Concluso',
    'attack_on_titan.jpg',
    'aot_banner.jpg'
),
(
    'Tokyo Ghoul',
    'Sui Ishida',
    'Ken Kaneki diventa metà ghoul dopo un incidente e lotta tra la sua umanità e il lato mostruoso.',
    2011,
    'Concluso',
    'tokyo_ghoul.jpg',
    'tokyo_ghoul_banner.jpg'
),
(
    'Chainsaw Man',
    'Tatsuki Fujimoto',
    'Denji ottiene i poteri della motosega e viene trascinato in un brutale mondo di demoni.',
    2018,
    'In corso',
    'chainsaw_man.jpg',
    'chainsaw_banner.jpg'
),
(
    'Death Note',
    'Tsugumi Ohba',
    'Uno studente trova un quaderno capace di uccidere chiunque venga scritto al suo interno.',
    2003,
    'Concluso',
    'death_note.jpg',
    'deathnote_banner.jpg'
),
(
    'One Piece',
    'Eiichiro Oda',
    'Monkey D. Rufy naviga per conquistare il leggendario tesoro One Piece.',
    1997,
    'In corso',
    'one_piece.jpg',
    'onepiece_banner.jpg'
),
(
    'Demon Slayer',
    'Koyoharu Gotouge',
    'Tanjiro Kamado combatte demoni per salvare sua sorella Nezuko.',
    2016,
    'Concluso',
    'demon_slayer.jpg',
    'demonslayer_banner.jpg'
);

-- =====================================================
-- ASSOCIAZIONE GENERI AI MANGA
-- =====================================================

-- Jujutsu Kaisen
INSERT INTO manga_generi (id_manga, id_genere) VALUES
(1,1),
(1,3),
(1,11);

-- Attack on Titan
INSERT INTO manga_generi (id_manga, id_genere) VALUES
(2,1),
(2,8),
(2,9);

-- Tokyo Ghoul
INSERT INTO manga_generi (id_manga, id_genere) VALUES
(3,4),
(3,9),
(3,12);

-- Chainsaw Man
INSERT INTO manga_generi (id_manga, id_genere) VALUES
(4,1),
(4,4),
(4,11);

-- Death Note
INSERT INTO manga_generi (id_manga, id_genere) VALUES
(5,8),
(5,9),
(5,12);

-- One Piece
INSERT INTO manga_generi (id_manga, id_genere) VALUES
(6,1),
(6,2),
(6,11);

-- Demon Slayer
INSERT INTO manga_generi (id_manga, id_genere) VALUES
(7,1),
(7,3),
(7,11);