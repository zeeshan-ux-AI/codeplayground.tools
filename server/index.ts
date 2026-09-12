import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "15mb" }));

// Initialize Neon Postgres SQL runner if DATABASE_URL is available
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

// Initialize Database Table Schema
async function initDb() {
  if (!sql) {
    console.warn("⚠️ DATABASE_URL not set. Running backend with memory fallback.");
    return;
  }
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        share_code VARCHAR(120) UNIQUE NOT NULL,
        title VARCHAR(255) DEFAULT 'Untitled Project',
        project_type VARCHAR(50) DEFAULT 'web',
        files_json JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("✅ Neon Postgres database table 'projects' initialized successfully.");
  } catch (err: any) {
    console.error("❌ Failed to initialize Neon DB schema:", err.message);
  }
}

// Trigger DB Initialization
initDb();

// 1. Health Check & DB Status
app.get("/api/health", async (_req: Request, res: Response) => {
  let dbStatus = "disconnected";
  if (sql) {
    try {
      await sql`SELECT 1`;
      dbStatus = "connected";
    } catch {
      dbStatus = "error";
    }
  }

  res.json({
    status: "online",
    service: "CodePlayground Production API",
    database: `Neon Postgres (${dbStatus})`,
    timestamp: new Date().toISOString(),
  });
});

// 2. Share Project (Save to Neon Database)
app.post("/api/projects/share", async (req: Request, res: Response) => {
  try {
    const { name, type, files, html, css, js } = req.body;
    const projectFiles = files || { "index.html": html || "", "styles.css": css || "", "script.js": js || "" };
    const projectTitle = name || "Untitled Project";
    const projectType = type || "web";

    // Generate unique short share code
    const payloadStr = JSON.stringify({ name: projectTitle, type: projectType, files: projectFiles });
    const shareCode = Buffer.from(payloadStr).toString("base64url");

    if (sql) {
      try {
        await sql`
          INSERT INTO projects (share_code, title, project_type, files_json)
          VALUES (${shareCode}, ${projectTitle}, ${projectType}, ${JSON.stringify(projectFiles)})
          ON CONFLICT (share_code) DO NOTHING;
        `;
      } catch (dbErr: any) {
        console.error("Neon DB Insert Note:", dbErr.message);
      }
    }

    const shareUrl = `https://www.codeplayground.tools/p/${shareCode}`;
    res.json({
      success: true,
      shareId: shareCode,
      shareUrl,
      message: "Project share link generated!",
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Failed to generate share link" });
  }
});

// 3. Get Shared Project (Fetch from Neon Database or Decode Token)
app.get("/api/projects/:shareId", async (req: Request, res: Response) => {
  try {
    const { shareId } = req.params;

    if (sql) {
      try {
        const rows = await sql`
          SELECT title, project_type, files_json FROM projects WHERE share_code = ${shareId} LIMIT 1;
        `;
        if (rows.length > 0) {
          const row = rows[0];
          return res.json({
            success: true,
            project: {
              name: row.title,
              type: row.project_type,
              files: typeof row.files_json === "string" ? JSON.parse(row.files_json) : row.files_json
            }
          });
        }
      } catch (dbErr) {
        console.warn("Falling back to token decoder:", dbErr);
      }
    }

    // Fallback URL-encoded token decoder
    const decoded = Buffer.from(shareId, "base64url").toString("utf-8");
    const project = JSON.parse(decoded);
    res.json({ success: true, project });
  } catch (e: any) {
    res.status(404).json({ error: "Project not found or invalid link" });
  }
});

// 4. Platform Stats Endpoint
app.get("/api/stats", async (_req: Request, res: Response) => {
  let projectCount = 0;
  if (sql) {
    try {
      const resCount = await sql`SELECT COUNT(*) as count FROM projects;`;
      projectCount = parseInt(resCount[0]?.count || "0", 10);
    } catch (e) {
      projectCount = 0;
    }
  }
  res.json({
    totalProjectsShared: projectCount,
    supportedCompilers: 102,
    platform: "CodePlayground Cloud IDE"
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 CodePlayground Production API running on port ${PORT}`);
});

export default app;
