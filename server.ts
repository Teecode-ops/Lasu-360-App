import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Mock University Central Database
const UNIVERSITY_DB = {
  students: {
    "LASU/2020/001": {
      cgpa: 4.88,
      debts: 250000,
      grades: { "CSC 301": "A", "CSC 302": "A", "MTH 301": "B" }
    },
    "HOD/LASU/001": {
      cgpa: 5.0,
      debts: 0,
      grades: {}
    }
  }
};

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "University Central Server" });
});

// Debug route to see the "External" Database content
app.get("/api/university/debug/all", (req, res) => {
  res.json(UNIVERSITY_DB);
});

// Fetch confidential student data
app.get("/api/university/confidential/:matricNo*", (req, res) => {
  const params = req.params as any;
  const matricNo = Array.isArray(params.matricNo) ? params.matricNo.join('/') : params.matricNo;
  console.log(`[API] Fetching confidential data for: ${matricNo}`);
  
  // @ts-ignore
  const data = UNIVERSITY_DB.students[matricNo];
  
  if (data) {
    res.json(data);
  } else {
    console.warn(`[API] Record not found: ${matricNo}`);
    res.status(404).json({ error: "Student record not found in University Central DB" });
  }
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('/:any*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // In the Cloud environment, we always need to listen on port 3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`Backend and Frontend integrated! Use /api/health to test.`);
  });
}

startServer();

export default app;
