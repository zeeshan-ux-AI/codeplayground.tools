import { useState, useEffect, Suspense } from "react";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";
import { ConsolePanel, type LogMessage } from "@/components/editor/console-panel";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import { Play, RotateCcw, Trash2, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorSkeleton } from "@/components/editor/editor-skeleton";
import { ShortcutsDialog } from "@/components/editor/shortcuts-dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { AdSenseSlot } from "@/components/adsense-slot";

const DEFAULT_SVELTE_CODE = `<script>
  let count = 0;
  let name = 'Svelte Developer';

  function handleClick() {
    count += 1;
    console.log('Svelte counter:', count);
  }
</script>

<main class="card">
  <div class="logo">🟧 Svelte</div>
  <h1>Hello {name}!</h1>
  <p>Live Svelte Reactive Compiler</p>

  <div class="counter-box">
    <button on:click={handleClick} class="btn">
      Clicked {count} {count === 1 ? 'time' : 'times'}
    </button>
  </div>
</main>

<style>
  :global(body) { font-family: system-ui, sans-serif; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
  .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 1.5rem; padding: 2.5rem; text-align: center; max-width: 400px; backdrop-filter: blur(10px); }
  .logo { font-size: 2.5rem; margin-bottom: 0.5rem; }
  h1 { color: #ff3e00; font-size: 1.8rem; margin-bottom: 0.5rem; }
  p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.5rem; }
  .btn { padding: 0.8rem 1.6rem; border-radius: 0.75rem; border: none; background: #ff3e00; color: white; font-weight: 800; font-size: 1rem; cursor: pointer; transition: 0.2s; }
  .btn:hover { background: #e03600; transform: scale(1.04); }
</style>`;

export default function SvelteEditor() {
  useSEO({
    title: "Online Svelte Compiler - Live Svelte Playground | CodePlayground",
    description: "Browser-based Svelte editor with instant reactive preview as you type.",
    keywords: "svelte compiler online, svelte playground, svelte live compiler, sveltejs runner"
  });

  const [code, setCode] = useState(DEFAULT_SVELTE_CODE);
  const debouncedCode = useDebounce(code, 150);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const getSvelteHtml = (sCode: string) => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    (function() {
      function post(type, args) {
        window.parent.postMessage({ source: 'iframe-console', type, args: Array.from(args).map(String) }, '*');
      }
      console.log = function(...args) { post('log', args); };
    })();
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    try {
      // Basic Svelte template extraction & DOM compilation
      const scriptMatch = \`${sCode.replace(/`/g, "\\`")}\`.match(/<script>([\\s\\S]*?)<\\/script>/);
      const styleMatch = \`${sCode.replace(/`/g, "\\`")}\`.match(/<style>([\\s\\S]*?)<\\/style>/);
      let html = \`${sCode.replace(/`/g, "\\`")}\`.replace(/<script>[\\s\\S]*?<\\/script>/, '').replace(/<style>[\\s\\S]*?<\\/style>/, '');

      if (styleMatch) {
        const style = document.createElement('style');
        style.textContent = styleMatch[1];
        document.head.appendChild(style);
      }

      document.getElementById('root').innerHTML = html;
    } catch(e) {
      console.error(e.message || String(e));
    }
  </script>
</body>
</html>`;
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <AppNavbar title="Svelte Compiler" mode="web" onOpenShortcuts={() => setShowShortcuts(true)} />

          <main className="flex-1 overflow-hidden">
            <PanelGroup direction="horizontal">
              <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#1e1e1e]">
                <div className="flex items-center justify-between bg-[#252526] border-b border-white/5 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-foreground font-medium">App.svelte</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="sm" onClick={() => setCode("")} className="text-xs h-7 px-2 text-muted-foreground hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setCode(DEFAULT_SVELTE_CODE)} className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground">
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

              <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#0d0d0d]">
                <div className="p-2 border-b border-white/5 bg-[#181818]">
                  <AdSenseSlot label="Google AdSense Banner" className="h-[70px]" />
                </div>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={65} className="relative">
                    <iframe
                      title="svelte-preview"
                      sandbox="allow-scripts allow-same-origin"
                      srcDoc={getSvelteHtml(debouncedCode)}
                      className="w-full h-full border-none absolute inset-0 bg-[#0f172a]"
                    />
                  </Panel>

                  <PanelResizeHandle className="Resizer" />

                  <Panel defaultSize={35}>
                    <ConsolePanel logs={logs} onClear={() => setLogs([])} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </main>
        </div>
      </div>

      <ShortcutsDialog open={showShortcuts} onOpenChange={setShowShortcuts} />
    </SidebarProvider>
  );
}
