import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Database setup
  const db = new Database("database.db");
  db.exec(`
    CREATE TABLE IF NOT EXISTS detections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_number TEXT NOT NULL,
      confidence REAL NOT NULL,
      original_image_path TEXT NOT NULL,
      processed_image_path TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  app.use(express.json({ limit: '10mb' }));

  // Multer setup for storing history images
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage });

  // API Routes
  
  // Save detection result
  app.post("/api/save-detection", upload.single("image"), (req: any, res) => {
    try {
      const { vehicleNumber, confidence } = req.body;
      const originalPath = req.file ? `/uploads/${req.file.filename}` : "";
      
      const stmt = db.prepare(`
        INSERT INTO detections (vehicle_number, confidence, original_image_path, processed_image_path)
        VALUES (?, ?, ?, ?)
      `);
      
      const result = stmt.run(vehicleNumber, confidence, originalPath, originalPath); // Simplified: using same path for now
      
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      console.error("Error saving detection:", error);
      res.status(500).json({ error: "Failed to save detection" });
    }
  });

  // Get detection history
  app.get("/api/history", (req, res) => {
    try {
      const { search } = req.query;
      let rows;
      if (search) {
        const stmt = db.prepare("SELECT * FROM detections WHERE vehicle_number LIKE ? ORDER BY timestamp DESC");
        rows = stmt.all(`%${search}%`);
      } else {
        rows = db.prepare("SELECT * FROM detections ORDER BY timestamp DESC").all();
      }
      res.json(rows);
    } catch (error) {
      console.error("Error fetching history:", error);
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: process.cwd()
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware attached.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
