import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./db/pool.js"

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({
    origin: "http://localhost:5173"
}))

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/api/db-test", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT NOW() AS current_time"
        );

        res.status(200).json({
            status: "connected",
            databaseTime: result.rows[0].current_time
        });
    } catch (error) {
        console.error("Database connection failed:", error);

        res.status(500).json({
            status: "error",
            message: "Database connection failed"
        });
    }
});

