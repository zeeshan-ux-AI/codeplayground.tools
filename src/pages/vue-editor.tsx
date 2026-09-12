import { useState, useEffect, Suspense } from "react";
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
import { useDebounce } from "@/hooks/use-debounce";
import { AdSenseSlot } from "@/components/adsense-slot";

const DEFAULT_VUE_CODE = `<template>
  <div class="vue-card">
    <div class="logo">🟢 Vue 3</div>
    <h1>{{ title }}</h1>
    <p>Live Typing Vue Playground with Reactive State!</p>
    
    <div class="counter-box">
      <span class="count">{{ count }}</span>
      <button @click="increment" class="btn">+ Increment</button>
      <button @click="reset" class="btn btn-reset">Reset</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Vue 3 Live Playground",
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++;
      console.log('Vue count incremented:', this.count);
    },
    reset() {
      this.count = 0;
      console.log('Vue count reset');
    }
  }
}
</script>

<style>
body { font-family: system-ui, sans-serif; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
.vue-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 1.5rem; padding: 2.5rem; text-align: center; max-width: 400px; backdrop-filter: blur(10px); }
.logo { font-size: 2.5rem; margin-bottom: 0.5rem; }
h1 { font-size: 1.8rem; margin-bottom: 0.5rem; color: #42b883; }
p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.5rem; }
.counter-box { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.count { font-size: 4rem; font-weight: 800; color: #42b883; }
.btn { padding: 0.75rem 1.5rem; border-radius: 0.75rem; border: none; background: #42b883; color: #0f172a; font-weight: 800; cursor: pointer; transition: 0.2s; }
.btn:hover { background: #33a06f; }
.btn-reset { background: rgba(255,255,255,0.1); color: white; }
</style>`;

export default function VueEditor() {
  useSEO({
    title: "Online Vue 3 Compiler - Live Vue SFC Playground | CodePlayground",
    description: "Write and preview Vue 3 single-file components live in your browser with real-time reactive compilation.",
    keywords: "vue 3 compiler online, vue playground, live vue sfc editor, vuejs runner online"
  });

  const { toast } = useToast();
  const [code, setCode] = useState(DEFAULT_VUE_CODE);
  const debouncedCode = useDebounce(code, 150);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const getVueHtml = (vueCode: string) => {
    // Separate template, script, style
    const templateMatch = vueCode.match(/<template>([\s\S]*?)<\/template>/);
    const scriptMatch = vueCode.match(/<script>([\s\S]*?)<\/script>/);
    const styleMatch = vueCode.match(/<style>([\s\S]*?)<\/style>/);

    const template = templateMatch ? templateMatch[1] : `<div>Vue App</div>`;
    const scriptStr = scriptMatch ? scriptMatch[1].replace(/export default/, "const componentOptions =") : "const componentOptions = {};";
    const style = styleMatch ? styleMatch[1] : "";

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${style}</style>
  <script>
    (function() {
      function post(type, args) {
        window.parent.postMessage({ source: 'iframe-console', type, args: Array.from(args).map(String) }, '*');
      }
      console.log = function(...args) { post('log', args); };
      console.error = function(...args) { post('error', args); };
    })();
  </script>
</head>
<body>
  <div id="app">${template}</div>
  <script>
    try {
      ${scriptStr}
      const app = Vue.createApp(componentOptions);
      app.mount('#app');
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
          <AppNavbar title="Vue 3 SFC Compiler" mode="web" onOpenShortcuts={() => setShowShortcuts(true)} />

          <main className="flex-1 overflow-hidden">
            <PanelGroup direction="horizontal">
              {/* Vue Code Editor */}
              <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#1e1e1e]">
                <div className="flex items-center justify-between bg-[#252526] border-b border-white/5 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-foreground font-medium">App.vue</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="sm" onClick={() => setCode("")} className="text-xs h-7 px-2 text-muted-foreground hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setCode(DEFAULT_VUE_CODE)} className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground">
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

              {/* Vue Live Preview */}
              <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#0d0d0d]">
                <div className="p-2 border-b border-white/5 bg-[#181818]">
                  <AdSenseSlot label="Google AdSense Banner" className="h-[70px]" />
                </div>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={65} className="relative">
                    <iframe
                      title="vue-preview"
                      sandbox="allow-scripts allow-same-origin"
                      srcDoc={getVueHtml(debouncedCode)}
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
