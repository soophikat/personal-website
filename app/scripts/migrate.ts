import pool, { initSchema } from "../lib/db";

async function migrate() {
    try {
        await initSchema();
        console.log("Database schema is up to date.");
    } catch (error) {
        console.error("Database migration failed:", error);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

void migrate();
