import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { useSEO } from "@/hooks/use-seo";
import { AdSenseSlot } from "@/components/adsense-slot";
import { CompilerHeader } from "@/components/layout/compiler-header";
import { TerminalSquare } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

const DEFAULT_WASM_JS = `// WebAssembly Native Execution in Browser
async function runWasmModule() {
  // WebAssembly binary bytecode for an add(a, b) function
  // WASM bytes: magic header (\\0asm) + version + exports + add function
  const wasmBytes = new Uint8Array([
    0,97,115,109, 1,0,0,0, 1,7,1,96,2,127,127,1,127,
    3,2,1,0, 7,7,1,3,97,100,100,0,0, 10,9,1,7,0,32,0,32,1,106,11
  ]);

  const { instance } = await WebAssembly.instantiate(wasmBytes);
  const { add } = instance.exports as { add: (a: number, b: number) => number };

  console.log("⚡ WebAssembly Module Loaded!");
  console.log("wasm.add(40, 2) =", add(40, 2));
  console.log("wasm.add(100, 250) =", add(100, 250));
}

runWasmModule();
`;

export default function WasmEditorPage() {
  useSEO({
    title: "Online WebAssembly Studio & WASM Runner | CodePlayground",
    description: "Execute native WebAssembly modules and WAT text bytecodes directly inside your browser.",
    keywords: "webassembly studio, wasm online runner, wat compiler, webassembly browser playground"
  });

  const [code, setCode] = useState(DEFAULT_WASM_JS);
  const [output, setOutput] = useState("");

  const handleRun = () => {
    setOutput("");
    const logs: string[] = [];

    const customConsole = {
      log: (...args: any[]) => logs.push(args.join(" ")),
      error: (...args: any[]) => logs.push("[Error] " + args.join(" ")),
      warn: (...args: any[]) => logs.push("[Warn] " + args.join(" "))
    };

    try {
      const runFn = new Function("console", code);
      runFn(customConsole);
      setTimeout(() => {
        setOutput(logs.join("\n") || "WebAssembly module instantiated.");
      }, 150);
    } catch (err: any) {
      setOutput("Runtime Error: " + err.message);
    }
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <CompilerHeader
            title="WebAssembly WAT Studio"
            badge="WASM Core"
            badgeColor="bg-violet-500/10 text-violet-400 border-violet-500/30"
            code={code}
            onClear={() => setCode("")}
            onRun={handleRun}
          />

          <AdSenseSlot type="banner" />

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40 overflow-hidden">
            <div className="flex flex-col h-full bg-[#1e1e1e]">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">wasm-runner.js</span>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  language="javascript"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  options={{ fontSize: 13, minimap: { enabled: false }, automaticLayout: true }}
                />
              </div>
            </div>

            <div className="flex flex-col h-full bg-[#0d0d0f] font-mono text-xs">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center gap-2 text-muted-foreground">
                <TerminalSquare className="w-3.5 h-3.5 text-violet-400" /> WASM Instance Terminal Output
              </div>
              <div className="flex-1 p-4 overflow-auto text-violet-200/90 whitespace-pre leading-relaxed">
                {output || 'Click "Execute WASM" to instantiate WebAssembly bytecode.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
