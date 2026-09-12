import { useState, useEffect, Suspense } from "react";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSEO } from "@/hooks/use-seo";
import { Play, RotateCcw, Trash2, FileCode2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorSkeleton } from "@/components/editor/editor-skeleton";
import { ShortcutsDialog } from "@/components/editor/shortcuts-dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { AdSenseSlot } from "@/components/adsense-slot";

const DEFAULT_HTML_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Standalone HTML Studio</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 24px;
    }
    .card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 32px;
      max-width: 450px;
      text-align: center;
      backdrop-filter: blur(12px);
    }
    h1 { color: #f97316; margin-top: 0; }
    p { color: #94a3b8; line-height: 1.6; }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(249, 115, 22, 0.15);
      color: #fb923c;
      border-radius: 999px;
      font-size: 12px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>🟧 HTML5 Standalone Studio</h1>
    <p>Edit raw HTML markup live with instant real-time browser preview.</p>
    <div class="badge">Pure HTML5 Engine</div>
  </div>
</body>
</html>`;

export default function HtmlOnlyEditor() {
  useSEO({
    title: "Online HTML Editor - Live Preview & Instant HTML Compiler | CodePlayground",
    description: "Write and preview pure HTML code instantly in your browser. The best free online HTML editor with live rendering, syntax highlighting, and zero setup required. Perfect for beginners and professionals.",
    keywords: "html editor online, online html compiler, html live preview, html code editor, html5 editor, browser html editor, html sandbox, html playground, learn html online, html coding practice",
    canonical: "/html-editor",
    ogType: "website"
  });

  const [code, setCode] = useState(DEFAULT_HTML_CODE);
  const debouncedCode = useDebounce(code, 100);
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <AppNavbar title="HTML5 Standalone Studio" mode="web" onOpenShortcuts={() => setShowShortcuts(true)} />

          <main className="flex-1 overflow-hidden">
            <PanelGroup direction="horizontal">
              <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#1e1e1e]">
                <div className="flex items-center justify-between bg-[#252526] border-b border-white/5 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-orange-500" />
                    <span className="text-xs text-foreground font-medium">index.html</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="sm" onClick={() => setCode("")} className="text-xs h-7 px-2 text-muted-foreground hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setCode(DEFAULT_HTML_CODE)} className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground">
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
                    </Button>
                  </div>
                </div>

                <div className="flex-1 relative">
                  <Suspense fallback={<EditorSkeleton />}>
                    <Editor
                      height="100%"
                      defaultLanguage="html"
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
                    <Play className="w-4 h-4 text-orange-500" /> HTML Live Browser Render
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <iframe
                    srcDoc={debouncedCode}
                    className="w-full h-full border-none bg-slate-950"
                    title="HTML Preview"
                  />
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
