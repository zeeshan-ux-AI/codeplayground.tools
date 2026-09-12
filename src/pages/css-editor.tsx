import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useSEO } from "@/hooks/use-seo";
import { AdSenseSlot } from "@/components/adsense-slot";
import { CompilerHeader } from "@/components/layout/compiler-header";
import { Palette, Play } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

const DEFAULT_CSS = `<!-- Live CSS & Tailwind Sandbox -->
<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 font-sans">
  <div className="max-w-md w-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6 hover:border-cyan-500/50 transition-all duration-500 group">
    
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
      <span className="text-2xl">✨</span>
    </div>

    <div className="space-y-2">
      <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
        Glassmorphism CSS
      </h2>
      <p className="text-sm text-slate-400 leading-relaxed">
        Edit HTML & CSS below to test custom animations, Tailwind utilities, dynamic gradients, and flex layout in real time.
      </p>
    </div>

    <div className="flex gap-2">
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
        Tailwind v3
      </span>
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
        Live CSS
      </span>
    </div>

    <button className="w-full py-3.5 px-6 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all">
      Interactive Button →
    </button>
  </div>
</div>

<style>
/* Custom CSS */
body {
  margin: 0;
}
</style>`;

export default function CssEditorPage() {
  useSEO({
    title: "Online CSS & Tailwind Playground | CodePlayground",
    description: "Live interactive CSS and Tailwind CSS editor with real-time browser preview, glassmorphism, and responsive testing.",
    keywords: "css sandbox, tailwind playground, live css editor, flexbox generator, tailwind css live"
  });

  const [code, setCode] = useState(DEFAULT_CSS);
  const [debouncedCode, setDebouncedCode] = useState(DEFAULT_CSS);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedCode(code), 100);
    return () => clearTimeout(handler);
  }, [code]);

  const generateIframeSrcDoc = () => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    ${debouncedCode}
  </body>
</html>`;

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <CompilerHeader
            title="CSS & Tailwind Studio"
            badge="Tailwind v3"
            badgeColor="bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
            code={code}
            onClear={() => setCode("")}
          />

          <AdSenseSlot type="banner" />

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40 overflow-hidden">
            <div className="flex flex-col h-full overflow-hidden bg-[#1e1e1e]">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" /> HTML & CSS Code
                </span>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  language="html"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  options={{ fontSize: 13, minimap: { enabled: false }, wordWrap: "on", automaticLayout: true }}
                />
              </div>
            </div>

            <div className="flex flex-col h-full overflow-hidden bg-black">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-cyan-400" /> Live CSS Render
                </span>
              </div>
              <iframe
                srcDoc={generateIframeSrcDoc()}
                className="w-full h-full border-none bg-slate-950"
                title="CSS Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
