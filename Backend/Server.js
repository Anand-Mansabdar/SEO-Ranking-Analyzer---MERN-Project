import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./Config/db.js";
dotenv.config();

connectDB();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.send("Server running successfully");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on http://localhost:3000");
});
