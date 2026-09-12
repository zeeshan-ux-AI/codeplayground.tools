import { useState, useEffect, Suspense } from "react";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";
import { ConsolePanel, type LogMessage } from "@/components/editor/console-panel";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSEO } from "@/hooks/use-seo";
import { Play, RotateCcw, Trash2, Code2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorSkeleton } from "@/components/editor/editor-skeleton";
import { ShortcutsDialog } from "@/components/editor/shortcuts-dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { AdSenseSlot } from "@/components/adsense-slot";

const DEFAULT_JS_CODE = `// JavaScript Node.js Live Playground
console.log("🚀 JavaScript Engine initialized!");

// Array methods example
const numbers = [10, 25, 40, 55, 70];
const doubled = numbers.map(n => n * 2);
console.log("Original Numbers:", numbers);
console.log("Doubled Numbers:", doubled);

// Async / Promise simulation
async function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Data fetched successfully!"), 500);
  });
}

fetchData().then(res => console.log("Async Result:", res));
`;

export default function JsEditor() {
  useSEO({
    title: "Online JavaScript Editor & Compiler - Run JS in Browser | CodePlayground",
    description: "The fastest free online JavaScript editor and compiler. Write, execute, and debug JavaScript code instantly in your browser with console output and real-time results. No Node.js installation needed.",
    keywords: "javascript editor online, online js compiler, run javascript in browser, js sandbox, javascript playground, es6 editor, node.js alternative, browser javascript ide, js code runner, javascript practice online",
    canonical: "/js-editor",
    ogType: "website"
  });

  const [code, setCode] = useState(DEFAULT_JS_CODE);
  const debouncedCode = useDebounce(code, 150);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Evaluate JS on typing
  useEffect(() => {
    setLogs([]);
    try {
      const customLog = (...args: any[]) => {
        setLogs((prev) => [
          ...prev,
          {
            type: "log",
            content: args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" "),
            timestamp: new Date(),
          },
        ]);
      };

      const fn = new Function("console", debouncedCode);
      fn({
        log: customLog,
        error: (...args: any[]) => setLogs((prev) => [...prev, { type: "error", content: args.join(" "), timestamp: new Date() }]),
        warn: (...args: any[]) => setLogs((prev) => [...prev, { type: "warn", content: args.join(" "), timestamp: new Date() }]),
        info: customLog,
      });
    } catch (err: any) {
      setLogs((prev) => [...prev, { type: "error", content: err.message || String(err), timestamp: new Date() }]);
    }
  }, [debouncedCode]);

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <AppNavbar title="JavaScript Playground" mode="web" onOpenShortcuts={() => setShowShortcuts(true)} />

          <main className="flex-1 overflow-hidden">
            <PanelGroup direction="horizontal">
              <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#1e1e1e]">
                <div className="flex items-center justify-between bg-[#252526] border-b border-white/5 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-foreground font-medium">main.js</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="sm" onClick={() => setCode("")} className="text-xs h-7 px-2 text-muted-foreground hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setCode(DEFAULT_JS_CODE)} className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground">
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
                    </Button>
                  </div>
                </div>

                <div className="flex-1 relative">
                  <Suspense fallback={<EditorSkeleton />}>
                    <Editor
                      height="100%"
                      defaultLanguage="javascript"
                      theme="vs-dark"
                      value={code}
                      onChange={(v) => setCode(v || "")}
                      options={{ minimap: { enabled: false }, fontSize: 13, wordWrap: "on", padding: { top: 14 } }}
                    />
                  </Suspense>
                </div>
              </Panel>

              <PanelResizeHandle className="Resizer" />

              <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#121212]">
                <div className="p-2 border-b border-white/5 bg-[#181818]">
                  <AdSenseSlot label="Google AdSense Banner" className="h-[70px]" />
                </div>
                <div className="flex items-center justify-between px-3 py-2 bg-[#1e1e1e] border-b border-white/5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Terminal className="w-4 h-4 text-yellow-400" /> Live Execution Terminal
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
          </main>
        </div>
      </div>

      <ShortcutsDialog open={showShortcuts} onOpenChange={setShowShortcuts} />
    </SidebarProvider>
  );
}
