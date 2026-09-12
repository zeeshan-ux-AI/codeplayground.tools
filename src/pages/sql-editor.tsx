import { useState, useEffect, Suspense } from "react";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSEO } from "@/hooks/use-seo";
import { Play, RotateCcw, Trash2, Database, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorSkeleton } from "@/components/editor/editor-skeleton";
import { ShortcutsDialog } from "@/components/editor/shortcuts-dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { AdSenseSlot } from "@/components/adsense-slot";

const DEFAULT_SQL = `-- SQL SQLite Database Compiler - CodePlayground
CREATE TABLE developers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  score INTEGER DEFAULT 100
);

INSERT INTO developers (name, role, score) VALUES 
('Zeeshan', 'Full Stack Developer', 980),
('Alex', 'Frontend Engineer', 850),
('Maria', 'Backend Specialist', 910);

-- Query all active developers
SELECT id, name, role, score FROM developers WHERE score > 800 ORDER BY score DESC;
`;

export default function SqlEditor() {
  useSEO({
    title: "Online SQL Compiler & SQLite Playground | CodePlayground",
    description: "Write, run, and test SQL queries live in your browser using SQLite engine.",
    keywords: "sql compiler online, sqlite playground, run sql queries online, database ide"
  });

  const [code, setCode] = useState(DEFAULT_SQL);
  const debouncedCode = useDebounce(code, 150);
  const [queryResults, setQueryResults] = useState<{ columns: string[]; rows: any[][] }>({
    columns: ["id", "name", "role", "score"],
    rows: [
      [1, "Zeeshan", "Full Stack Developer", 980],
      [3, "Maria", "Backend Specialist", 910],
      [2, "Alex", "Frontend Engineer", 850],
    ],
  });
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <AppNavbar title="SQL Compiler (SQLite)" mode="web" onOpenShortcuts={() => setShowShortcuts(true)} />

          <main className="flex-1 overflow-hidden">
            <PanelGroup direction="horizontal">
              <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#1e1e1e]">
                <div className="flex items-center justify-between bg-[#252526] border-b border-white/5 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-foreground font-medium">query.sql</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="sm" onClick={() => setCode("")} className="text-xs h-7 px-2 text-muted-foreground hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setCode(DEFAULT_SQL)} className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground">
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
                    </Button>
                  </div>
                </div>

                <div className="flex-1 relative">
                  <Suspense fallback={<EditorSkeleton />}>
                    <Editor
                      height="100%"
                      defaultLanguage="sql"
                      theme="vs-dark"
                      value={code}
                      onChange={(v) => setCode(v || "")}
                      options={{ minimap: { enabled: false }, fontSize: 13, wordWrap: "on", padding: { top: 14 } }}
                    />
                  </Suspense>
                </div>
              </Panel>

              <PanelResizeHandle className="Resizer" />

              <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#0f172a]">
                <div className="p-2 border-b border-white/5 bg-[#141d2e]">
                  <AdSenseSlot label="Google AdSense Banner" className="h-[70px]" />
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-[#1e293b] border-b border-white/5 text-xs font-semibold text-cyan-400">
                  <Table className="w-4 h-4" /> Query Result Grid
                </div>

                <div className="flex-1 overflow-auto p-4">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 bg-slate-800/60 text-slate-300">
                        {queryResults.columns.map((col, idx) => (
                          <th key={idx} className="p-2.5 font-bold uppercase tracking-wider">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResults.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="border-b border-slate-800/40 hover:bg-slate-800/30 text-slate-200">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2.5 font-mono">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </PanelGroup>
          </main>
        </div>
      </div>

      <ShortcutsDialog open={showShortcuts} onOpenChange={setShowShortcuts} />
    </SidebarProvider>
  );
}
