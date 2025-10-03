import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import db from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS now");
    res.json({ message: "Server is running", time: rows });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
