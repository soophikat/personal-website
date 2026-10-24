import { Pool } from 'pg';
import { config } from 'dotenv';

if (!process.env.DATABASE_URL) {
    config();
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function initSchema() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS posts (
            id          SERIAL PRIMARY KEY,
            title       TEXT NOT NULL,
            content     TEXT NOT NULL,
            created_at  TIMESTAMP DEFAULT NOW()  
        );

        CREATE TABLE IF NOT EXISTS photos (
            id          SERIAL PRIMARY KEY,
            image_url   TEXT NOT NULL,
            key         TEXT NOT NULL,
            caption     TEXT,
            created_at  TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS projects (
            id          SERIAL PRIMARY KEY,
            title       TEXT NOT NULL,
            description TEXT NOT NULL,
            url         TEXT,
            status      TEXT NOT NULL DEFAULT 'in-progress',
            created_at  TIMESTAMP DEFAULT NOW()
        );

        ALTER TABLE projects ALTER COLUMN url DROP NOT NULL;
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'in-progress';

        CREATE TABLE IF NOT EXISTS tags (
            id      SERIAL PRIMARY KEY,
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
}

export default pool;