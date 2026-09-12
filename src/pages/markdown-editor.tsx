import { useState, Suspense } from "react";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSEO } from "@/hooks/use-seo";
import { RotateCcw, Trash2, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorSkeleton } from "@/components/editor/editor-skeleton";
import { ShortcutsDialog } from "@/components/editor/shortcuts-dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { AdSenseSlot } from "@/components/adsense-slot";

const DEFAULT_MARKDOWN = `# 📝 Markdown Live Previewer

Welcome to **CodePlayground Markdown Editor**. Edit your markdown on the left and see rich formatted HTML rendered on the right in real-time!

## Features

- **GitHub Flavored Markdown** support
- Code syntax highlighting:
\`\`\`javascript
function helloWorld() {
  console.log("Hello from Markdown!");
}
\`\`\`
- Custom Tables:

| Feature | Status | Speed |
| :--- | :--- | :--- |
| Live Typing Preview | ✅ Enabled | Instant |
| Export .md | ✅ Enabled | 1-Click |

---

> *"Markdown is a lightweight markup language for creating formatted text using a plain-text editor."*
`;

export default function MarkdownEditor() {
  useSEO({
    title: "Online Markdown Editor & Live Previewer | CodePlayground",
    description: "Real-time Markdown editor with live HTML preview and GFM formatting.",
    keywords: "markdown editor online, markdown previewer, gfm playground, online md viewer"
  });

  const [code, setCode] = useState(DEFAULT_MARKDOWN);
  const debouncedCode = useDebounce(code, 100);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const getMarkdownHtml = (md: string) => {
    // Simple fast GFM markdown renderer simulation
    let html = md
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold my-4 text-cyan-400 border-b border-slate-700 pb-2">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold my-3 text-slate-100">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium my-2 text-slate-200">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-300">$1</em>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-cyan-500 pl-4 py-1 italic my-3 text-slate-400">$1</blockquote>')
      .replace(/\`\`\`(.*?)\`\`\`/gs, '<pre class="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-sm overflow-x-auto text-cyan-300 my-4">$1</pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
      .replace(/\n/g, '<br/>');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, sans-serif; background: #0b0f17; color: #cbd5e1; padding: 2rem; }
  </style>
</head>
<body>
  <div className="max-w-3xl mx-auto">${html}</div>
</body>
</html>`;
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <AppNavbar title="Markdown Previewer" mode="web" onOpenShortcuts={() => setShowShortcuts(true)} />

          <main className="flex-1 overflow-hidden">
            <PanelGroup direction="horizontal">
              <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#1e1e1e]">
                <div className="flex items-center justify-between bg-[#252526] border-b border-white/5 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-foreground font-medium">document.md</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="sm" onClick={() => setCode("")} className="text-xs h-7 px-2 text-muted-foreground hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setCode(DEFAULT_MARKDOWN)} className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground">
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
                    </Button>
                  </div>
                </div>

                <div className="flex-1 relative">
                  <Suspense fallback={<EditorSkeleton />}>
                    <Editor
                      height="100%"
                      defaultLanguage="markdown"
                      theme="vs-dark"
                      value={code}
                      onChange={(v) => setCode(v || "")}
                      options={{ minimap: { enabled: false }, fontSize: 13, wordWrap: "on", padding: { top: 14 } }}
                    />
                  </Suspense>
                </div>
              </Panel>

              <PanelResizeHandle className="Resizer" />

              <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#0b0f17]">
                <div className="p-2 border-b border-white/5 bg-[#141a26]">
                  <AdSenseSlot label="Google AdSense Banner" className="h-[70px]" />
                </div>
                <iframe
                  title="markdown-preview"
                  sandbox="allow-scripts allow-same-origin"
                  srcDoc={getMarkdownHtml(debouncedCode)}
                  className="w-full h-full border-none bg-[#0b0f17]"
                />
              </Panel>
            </PanelGroup>
          </main>
        </div>
      </div>

      <ShortcutsDialog open={showShortcuts} onOpenChange={setShowShortcuts} />
    </SidebarProvider>
  );
}
