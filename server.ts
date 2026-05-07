import express from "express";
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
      status: "Staff",
      grades: {}
    },
    "HOC/LASU/001": {
      cgpa: 3.85,
      debts: 0,
      status: "Final Year Rep",
      grades: { "CSC 301": "B+", "CSC 302": "A" }
    }
  }
};

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "University Central Server", env: process.env.NODE_ENV });
});

// Fetch confidential student data - Handling slashes in matric numbers
app.get("/api/university/confidential/*", (req, res) => {
  const matricNo = req.params[0];
  console.log(`[API] Fetching confidential data for: ${matricNo}`);
  
  if (!matricNo) {
    return res.status(400).json({ error: "Matric number is required" });
  }

  // @ts-ignore
  const data = UNIVERSITY_DB.students[matricNo];
  
  if (data) {
    res.json(data);
  } else {
    console.warn(`[API] Record not found: ${matricNo}`);
    // Return a generic fallback so UI doesn't hang forever
    res.status(404).json({ error: "Student record not found in University Central DB" });
  }
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only listen if not on Vercel
  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`Backend and Frontend integrated! Use /api/health to test.`);
    });
  }
}

startServer();

export default app;
