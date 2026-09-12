import { useState, useEffect, useRef, Suspense } from "react";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";
import { ConsolePanel, type LogMessage } from "@/components/editor/console-panel";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import { Play, RotateCcw, Trash2, Download, Code2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorSkeleton } from "@/components/editor/editor-skeleton";
import { ShortcutsDialog } from "@/components/editor/shortcuts-dialog";
import { AdSenseSlot } from "@/components/adsense-slot";

const DEFAULT_TS_CODE = `// TypeScript Playground - CodePlayground
interface User {
  id: number;
  name: string;
  role: "admin" | "developer" | "designer";
  active: boolean;
}

class UserRegistry {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
    console.log(\`Added user: \${user.name} (\${user.role})\`);
  }

  getActiveUsers(): User[] {
    return this.users.filter(u => u.active);
  }
}

const registry = new UserRegistry();
registry.addUser({ id: 1, name: "Zeeshan", role: "developer", active: true });
registry.addUser({ id: 2, name: "Sarah", role: "designer", active: true });

console.log("Active users count:", registry.getActiveUsers().length);
`;

export default function TypeScriptEditor() {
  useSEO({
    title: "Online TypeScript Compiler & Playground - Run TS Online | CodePlayground",
    description: "Browser-based TypeScript editor with live type-checking, JavaScript compilation, and immediate execution.",
    keywords: "typescript playground online, ts compiler, run typescript online, typescript ide, typescript transpile"
  });

  const { toast } = useToast();
  const [code, setCode] = useState(DEFAULT_TS_CODE);
  const [compiledJs, setCompiledJs] = useState("");
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Transpile TS using Babel standalone or Monaco built-in
  useEffect(() => {
    try {
      if ((window as any).Babel) {
        const res = (window as any).Babel.transform(code, {
          presets: ["typescript", "env"],
          filename: "script.ts",
        });
        setCompiledJs(res.code || "");
      }
    } catch (e: any) {
      setCompiledJs(`// Transpilation error:\n// ${e.message}`);
    }
  }, [code]);

  const handleRun = () => {
    setLogs([]);
    try {
      const consoleLog = (...args: any[]) => {
        setLogs((prev) => [
          ...prev,
          {
            type: "log",
            content: args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" "),
            timestamp: new Date(),
          },
        ]);
      };

      const customEval = new Function("console", compiledJs);
      customEval({
        log: consoleLog,
        error: (...args: any[]) => setLogs((prev) => [...prev, { type: "error", content: args.join(" "), timestamp: new Date() }]),
        warn: (...args: any[]) => setLogs((prev) => [...prev, { type: "warn", content: args.join(" "), timestamp: new Date() }]),
        info: consoleLog,
      });

      toast({ title: "TypeScript executed successfully!" });
    } catch (err: any) {
      setLogs((prev) => [...prev, { type: "error", content: err.message || String(err), timestamp: new Date() }]);
    }
  };

  const handleClear = () => {
    if (confirm("Clear code?")) {
      setCode("");
      toast({ title: "Code cleared" });
    }
  };

  const handleReset = () => {
    setCode(DEFAULT_TS_CODE);
    toast({ title: "Reset TypeScript template" });
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.ts";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported index.ts" });
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <AppNavbar title="TypeScript Compiler" mode="web" onOpenShortcuts={() => setShowShortcuts(true)} />

          <main className="flex-1 overflow-hidden">
            <PanelGroup direction="horizontal">
              {/* TS Editor */}
              <Panel defaultSize={45} minSize={20} className="flex flex-col bg-[#1e1e1e]">
                <div className="flex items-center justify-between bg-[#252526] border-b border-white/5 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-foreground font-medium">index.ts</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs h-7 px-2 text-muted-foreground hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground">
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDownload} className="text-xs h-7 px-2 text-muted-foreground hover:text-blue-400">
                      <Download className="w-3.5 h-3.5 mr-1" /> Export .ts
                    </Button>
                    <Button size="sm" onClick={handleRun} className="text-xs h-7 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30">
                      <Play className="w-3.5 h-3.5 mr-1 fill-current" /> Run TS
                    </Button>
                  </div>
                </div>

                <div className="flex-1 relative">
                  <Suspense fallback={<EditorSkeleton />}>
                    <Editor
                      height="100%"
                      defaultLanguage="typescript"
                      theme="vs-dark"
                      value={code}
                      onChange={(v) => setCode(v || "")}
                      options={{ minimap: { enabled: false }, fontSize: 13, wordWrap: "on", padding: { top: 14 } }}
                    />
                  </Suspense>
                </div>
              </Panel>

              <PanelResizeHandle className="Resizer" />

              {/* JS Output + Terminal */}
              <Panel defaultSize={55} minSize={20} className="flex flex-col bg-[#121212]">
                <div className="p-2 border-b border-white/5 bg-[#181818]">
                  <AdSenseSlot label="Google AdSense Banner" className="h-[70px]" />
                </div>

                <PanelGroup direction="vertical">
                  {/* Compiled JS View */}
                  <Panel defaultSize={50} className="flex flex-col bg-[#1e1e1e]">
                    <div className="px-3 py-1.5 bg-[#252526] border-b border-white/5 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Compiled JavaScript Output
                    </div>
                    <div className="flex-1">
                      <Editor
                        height="100%"
                        language="javascript"
                        theme="vs-dark"
                        value={compiledJs}
                        options={{ readOnly: true, minimap: { enabled: false }, fontSize: 12, wordWrap: "on" }}
                      />
                    </div>
                  </Panel>

                  <PanelResizeHandle className="Resizer" />

                  {/* Console Panel */}
                  <Panel defaultSize={50} className="flex flex-col bg-[#121212]">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-[#1a1a1a] border-b border-white/5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <Terminal className="w-3.5 h-3.5 text-blue-400" /> Console Logs
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setLogs([])} className="text-xs h-6 px-2 text-muted-foreground">
                        Clear
                      </Button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <ConsolePanel logs={logs} onClear={() => setLogs([])} />
                    </div>
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </main>

          {/* Status Bar */}
          <div className="h-8 border-t border-border/40 bg-muted/30 flex items-center justify-between px-4 text-[11px] text-muted-foreground shrink-0">
            <span>TypeScript v5.0 Active</span>
            <span>UTF-8 | TS Transpiler</span>
          </div>
        </div>
      </div>

      <ShortcutsDialog open={showShortcuts} onOpenChange={setShowShortcuts} />
    </SidebarProvider>
  );
}
