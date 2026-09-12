import { useState, Suspense } from "react";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSEO } from "@/hooks/use-seo";
import { RotateCcw, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorSkeleton } from "@/components/editor/editor-skeleton";
import { ShortcutsDialog } from "@/components/editor/shortcuts-dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { AdSenseSlot } from "@/components/adsense-slot";

const DEFAULT_CANVAS_CODE = `// HTML5 Canvas 2D / 3D Graphics Lab
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let angle = 0;

function draw() {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(angle);

  for (let i = 0; i < 12; i++) {
    ctx.rotate((Math.PI * 2) / 12);
    ctx.beginPath();
    ctx.arc(100, 0, 20 + Math.sin(angle * 3) * 10, 0, Math.PI * 2);
    ctx.fillStyle = \`hsl(\${(i * 30 + angle * 50) % 360}, 85%, 65%)\`;
    ctx.fill();
  }

  ctx.restore();
  angle += 0.03;
  requestAnimationFrame(draw);
}

draw();
`;

export default function CanvasEditor() {
  useSEO({
    title: "Canvas 2D/3D Graphics Lab & Animation Playground | CodePlayground",
    description: "Write, test, and render HTML5 Canvas 2D and 3D graphics live with instant hot reloading.",
    keywords: "canvas playground online, html5 canvas ide, 2d graphics code runner, threejs playground"
  });

  const [code, setCode] = useState(DEFAULT_CANVAS_CODE);
  const debouncedCode = useDebounce(code, 150);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const getCanvasHtml = (cCode: string) => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { overflow: hidden; background: #0f172a; }
    canvas { display: block; width: 100vw; height: 100vh; }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script>
    try {
      ${cCode}
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
          <AppNavbar title="Canvas Graphics Lab" mode="web" onOpenShortcuts={() => setShowShortcuts(true)} />

          <main className="flex-1 overflow-hidden">
            <PanelGroup direction="horizontal">
              <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#1e1e1e]">
                <div className="flex items-center justify-between bg-[#252526] border-b border-white/5 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-foreground font-medium">graphics.js</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="sm" onClick={() => setCode("")} className="text-xs h-7 px-2 text-muted-foreground hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setCode(DEFAULT_CANVAS_CODE)} className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground">
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

              <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#0f172a]">
                <div className="p-2 border-b border-white/5 bg-[#141d2e]">
                  <AdSenseSlot label="Google AdSense Banner" className="h-[70px]" />
                </div>
                <iframe
                  title="canvas-preview"
                  sandbox="allow-scripts allow-same-origin"
                  srcDoc={getCanvasHtml(debouncedCode)}
                  className="w-full h-full border-none bg-[#0f172a]"
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
