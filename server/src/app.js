import express from "express";
import cors from "cors";
import "dotenv/config";

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

