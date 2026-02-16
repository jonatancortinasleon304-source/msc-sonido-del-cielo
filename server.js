const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json({ limit: "2mb" }));

// 🔐 Usa el MISMO PIN que en index.html (CLOUD_PIN)
const TEAM_PIN = "1234";

const DB_FILE = "./db.json";

function readDB() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, "utf8")); }
  catch { return { songs: [] }; }
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

app.get("/api/songs", (req, res) => {
  if ((req.query.pin || "") !== TEAM_PIN) return res.status(403).json({ ok:false, error:"PIN inválido" });
  const db = readDB();
  res.json({ ok:true, songs: db.songs || [] });
});

app.post("/api/songs", (req, res) => {
  if ((req.body.pin || "") !== TEAM_PIN) return res.status(403).json({ ok:false, error:"PIN inválido" });
  const songs = Array.isArray(req.body.songs) ? req.body.songs : [];
  writeDB({ songs });
  res.json({ ok:true, saved: songs.length });
});

app.get("/", (_req, res) => res.sendFile(__dirname + "/index.html"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Running on", port));
