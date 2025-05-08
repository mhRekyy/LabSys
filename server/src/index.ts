// src/index.ts
import express from "express";
import cors from "cors";
import { db } from "./db";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Laboratorium");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data alat" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
