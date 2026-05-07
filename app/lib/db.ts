import Database from 'better-sqlite3';

const db = new Database('data.db');

db.exec(`

    CREATE TABLE IF NOT EXISTS posts (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        title       TEXT NOT NULL,
        content     TEXT NOT NULL,
        created_at  TEXT DEFAULT (datetime('now'))  
    );

    CREATE TABLE IF NOT EXISTS photos (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        filename    TEXT NOT NULL,
        caption     TEXT,
        created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS projects (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        title       TEXT NOT NULL,
        description TEXT NOT NULL,
        url         TEXT NOT NULL,
        created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tags (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        name    TEXT UNIQUE NOT NULL     
    );

    CREATE TABLE IF NOT EXISTS post_tags (
        post_id     INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        tag_id      INTEGER REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, tag_id) 
    );

    CREATE TABLE IF NOT EXISTS photo_tags (
        photo_id    INTEGER REFERENCES photos(id) ON DELETE CASCADE,
        tag_id      INTEGER REFERENCES tags(id) ON DELETE CASCADE, 
        PRIMARY KEY (photo_id, tag_id)
    );

    CREATE TABLE IF NOT EXISTS project_tags (
        project_id  INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        tag_id      INTEGER REFERENCES tags(id) ON DELETE CASCADE, 
        PRIMARY KEY  (project_id, tag_id)
    );

`);


export default db;