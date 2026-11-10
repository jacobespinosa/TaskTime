import pg from "pg";
import fs from "node:fs";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    connectionTimeoutMillis: 5000,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync("./certs/prod-ca-2021.crt", "utf8")
    }
});

export default pool;
