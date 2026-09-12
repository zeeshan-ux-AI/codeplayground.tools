import { useState, useEffect, useRef, Suspense } from "react";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";
import { ConsolePanel, type LogMessage } from "@/components/editor/console-panel";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import { Play, RotateCcw, Trash2, Download, Terminal, Code2, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditorSkeleton } from "@/components/editor/editor-skeleton";
import { ShortcutsDialog } from "@/components/editor/shortcuts-dialog";
import { AdSenseSlot } from "@/components/adsense-slot";

const PYTHON_TEMPLATES = [
  {
    id: "basic",
    name: "🐍 Basic Python 3",
    code: `# Python 3 Online Compiler - CodePlayground
import math
import sys

def main():
    print("🐍 Hello from Python 3 on CodePlayground!")
    
    # Calculate Fibonacci numbers
    fib = [0, 1]
    for i in range(2, 10):
        fib.append(fib[-1] + fib[-2])
        
    print(f"Fibonacci Sequence: {fib}")
    print(f"Square root of 144 is: {math.sqrt(144)}")
    print(f"Python Version: {sys.version.split()[0]}")

if __name__ == "__main__":
    main()
`
  },
  {
    id: "datascience",
    name: "📊 Data Science & Stats",
    code: `# Python Data Analysis & Matrix Operations
import random

def generate_matrix(rows, cols):
    return [[random.randint(1, 100) for _ in range(cols)] for _ in range(rows)]

def mean(arr):
    return sum(arr) / len(arr)

def std_dev(arr):
    avg = mean(arr)
    variance = sum((x - avg) ** 2 for x in arr) / len(arr)
    return variance ** 0.5

data = [random.randint(10, 99) for _ in range(20)]
print(f"Dataset (20 samples): {data}")
print(f"Mean Average: {mean(data):.2f}")
print(f"Standard Deviation: {std_dev(data):.2f}")
print(f"Min: {min(data)}, Max: {max(data)}")

matrix = generate_matrix(3, 3)
print("\\n3x3 Generated Matrix:")
for row in matrix:
    print(row)
`
  },
  {
    id: "algorithms",
    name: "⚡ Algorithms & OOP",
    code: `# Object Oriented Programming & Sorting Algorithms
class Developer:
    def __init__(self, name, role, languages):
        self.name = name
        self.role = role
        self.languages = languages

    def intro(self):
        return f"⚡ {self.name} - {self.role} (Tech Stack: {', '.join(self.languages)})"

def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + right

dev = Developer("Zeeshan", "Full-Stack Software Engineer", ["Python", "TypeScript", "React", "Rust"])
print(dev.intro())

numbers = [64, 34, 25, 12, 22, 11, 90, 5]
print("\\nUnsorted Array:", numbers)
print("Sorted Array (QuickSort):", quicksort(numbers))
`
  },
  {
    id: "ascii",
    name: "🎨 ASCII Graphics & Art",
    code: `# Python Terminal Graphics Generator
def render_header():
    banner = """
      ⚡ CODEPLAYGROUND PYTHON STUDIO ⚡
         /\\\\      /\\\\      /\\\\
        /  \\\\    /  \\\\    /  \\\\
       /____\\\\__/____\\\\__/____\\\\
      |   (o)   (o)   (o)     |
       \\\\                    /
        \\\\__________________/
    """
    print(banner)

def render_sine_wave():
    import math
    print("Sine Wave Animation Output:\\n")
    for i in range(0, 30):
        val = int(15 + 12 * math.sin(i * 0.3))
        print(" " * val + "🐍")

render_header()
render_sine_wave()
`
  }
];

import { generateCompilerSEOData } from "@/lib/seo-generator";
import { CompilerSEOSection } from "@/components/editor/compiler-seo-section";

export default function PythonEditor() {
  const seoData = generateCompilerSEOData({
    id: "python-editor",
    title: "Python 3 WASM Compiler & IDE",
    name: "Python 3 IDE",
    href: "/python-editor",
    category: "Languages & WASM",
    icon: "🐍",
    badge: "WASM",
    desc: "The fastest free online Python 3 compiler and IDE powered by Pyodide (WebAssembly). Execute Python scripts, data science code, and algorithms instantly in your browser with zero installation.",
    keywords: "python compiler online, online python ide, run python in browser, python 3 playground, python code runner, python sandbox, pyodide online, python web ide, learn python online, python practice, jupyter alternative browser",
    language: "python",
    defaultCode: ""
  });

  useSEO({
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    keywords: seoData.keywords,
    canonical: "/python-editor",
    ogType: "software",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": seoData.schemaGraph
    }
  });

  const { toast } = useToast();
  const [code, setCode] = useState(PYTHON_TEMPLATES[0].code);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const pyodideRef = useRef<any>(null);
  const [pyodideReady, setPyodideReady] = useState(false);

  // Load Pyodide script dynamically for WebAssembly Python execution
  useEffect(() => {
    if ((window as any).loadPyodide) {
      initPyodide();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
    script.async = true;
    script.onload = () => initPyodide();
    document.head.appendChild(script);
  }, []);

  const initPyodide = async () => {
    try {
      if (!pyodideRef.current && (window as any).loadPyodide) {
        pyodideRef.current = await (window as any).loadPyodide();
        setPyodideReady(true);
      }
    } catch (e) {
      console.warn("Pyodide fallback ready");
      setPyodideReady(true);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setLogs([]);
    const startTime = performance.now();

    try {
      if (pyodideRef.current) {
        pyodideRef.current.setStdout({
          batched: (str: string) => {
            setLogs((prev) => [...prev, { type: "log", content: str, timestamp: new Date() }]);
          },
        });
        pyodideRef.current.setStderr({
          batched: (str: string) => {
            setLogs((prev) => [...prev, { type: "error", content: str, timestamp: new Date() }]);
          },
        });

        await pyodideRef.current.runPythonAsync(code);
      } else {
        // Fallback JS simulation runner if offline
        const capturedLogs: string[] = [];
        capturedLogs.push("🐍 Python execution initialized (Simulated mode)");
        capturedLogs.push("Output:");
        
        const printMatches = code.match(/print\((.*?)\)/g);
        if (printMatches) {
          printMatches.forEach((m) => {
            const inner = m.replace(/^print\(/, "").replace(/\)$/, "");
            capturedLogs.push(inner.replace(/['"]/g, ""));
          });
        }

        capturedLogs.forEach((msg) => {
          setLogs((prev) => [...prev, { type: "log", content: msg, timestamp: new Date() }]);
        });
      }

      const duration = (performance.now() - startTime).toFixed(2);
      setLogs((prev) => [
        ...prev,
        { type: "info", content: `\n[Process completed in ${duration}ms]`, timestamp: new Date() },
      ]);
    } catch (err: any) {
      setLogs((prev) => [
        ...prev,
        { type: "error", content: err.message || String(err), timestamp: new Date() },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearCode = () => {
    setCode("");
    toast({ title: "Code cleared", description: "Editor content has been erased." });
  };

  const handleReset = () => {
    setCode(PYTHON_TEMPLATES[0].code);
    toast({ title: "Reset to Python default template" });
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "script.py";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded script.py" });
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <AppNavbar
            title="Python 3 Compiler & Studio"
            mode="web"
            onOpenShortcuts={() => setShowShortcuts(true)}
          />

          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            <main className="h-[calc(100vh-8rem)] flex-shrink-0">
              <PanelGroup direction="horizontal">
                {/* Editor */}
                <Panel defaultSize={55} minSize={20} className="flex flex-col bg-[#1e1e1e]">
                  <div className="flex items-center justify-between bg-[#252526] border-b border-white/5 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-foreground font-semibold">script.py</span>
                      <span className="text-[10px] text-muted-foreground bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                        {pyodideReady ? "Pyodide WASM Ready" : "Loading Python Engine..."}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Template Switcher Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs border-border/50 bg-background/40 hover:bg-muted/50 flex items-center gap-1 px-2.5 text-foreground"
                          >
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>Templates</span>
                            <ChevronDown className="w-3 h-3 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 font-sans">
                          <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
                            Python Starter Code
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {PYTHON_TEMPLATES.map((t) => (
                            <DropdownMenuItem
                              key={t.id}
                              onClick={() => {
                                setCode(t.code);
                                toast({ title: `Loaded ${t.name}` });
                              }}
                              className="text-xs font-medium cursor-pointer py-2"
                            >
                              {t.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Clear Code Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearCode}
                        className="text-xs h-7 px-2.5 text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-300 font-medium flex items-center gap-1.5 transition-colors"
                        title="Clear code editor"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        <span>Clear Code</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                        title="Reset default script"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDownload}
                        className="text-xs h-7 px-2 text-muted-foreground hover:text-emerald-400"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" /> Export .py
                      </Button>

                      <Button
                        size="sm"
                        onClick={handleRun}
                        disabled={isRunning}
                        className="text-xs h-7 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 mr-1 fill-current" />
                        {isRunning ? "Running..." : "Run Code"}
                      </Button>
                    </div>

                    <div className="flex-1 relative">
                      <Suspense fallback={<EditorSkeleton />}>
                        <Editor
                          height="100%"
                          defaultLanguage="python"
                          theme="vs-dark"
                          value={code}
                          onChange={(v) => setCode(v || "")}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            wordWrap: "on",
                            padding: { top: 16 },
                            lineNumbers: "on",
                            tabSize: 4,
                          }}
                        />
                      </Suspense>
                    </div>
                  </div>
                </Panel>

                <PanelResizeHandle className="Resizer" />

                {/* Output Console & AdSense */}
                <Panel defaultSize={45} minSize={20} className="flex flex-col bg-[#121212]">
                  <div className="p-2 border-b border-white/5 bg-[#181818]">
                    <AdSenseSlot label="Google AdSense Top Leaderboard" className="h-[75px]" />
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 bg-[#1e1e1e] border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Python Standard Output
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLogs([])}
                      className="text-xs h-6 px-2 text-muted-foreground hover:text-foreground"
                    >
                      Clear Console
                    </Button>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <ConsolePanel logs={logs} onClear={() => setLogs([])} />
                  </div>
                </Panel>
              </PanelGroup>
            </main>

            {/* Indexable Search Engine SEO & FAQ Section */}
            <CompilerSEOSection seoData={seoData} />
          </div>

          {/* Status Bar */}
          <div className="h-8 border-t border-border/40 bg-muted/30 flex items-center justify-between px-4 text-[11px] text-muted-foreground shrink-0 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Python 3.11 WASM Engine Active</span>
            </div>
            <div>UTF-8 | Python WASM Studio</div>
          </div>
        </div>
      </div>

      <ShortcutsDialog open={showShortcuts} onOpenChange={setShowShortcuts} />
    </SidebarProvider>
  );
}
