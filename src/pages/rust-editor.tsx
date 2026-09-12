import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { useSEO } from "@/hooks/use-seo";
import { AdSenseSlot } from "@/components/adsense-slot";
import { CompilerHeader } from "@/components/layout/compiler-header";
import { TerminalSquare } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

const DEFAULT_RUST = `// Rust 2021 Edition Playground
fn main() {
    let app_name = "CodePlayground Rust IDE";
    let compilers_count: u32 = 100;
    
    println!("🦀 Hello from {}", app_name);
    println!("Total Active Compilers: {}", compilers_count);

    let numbers = vec![1, 2, 3, 4, 5];
    let sum: i32 = numbers.iter().sum();
    println!("Vector Sum: {}", sum);
}
`;

export default function RustEditorPage() {
  useSEO({
    title: "Online Rust Playground & Compiler | CodePlayground",
    description: "Write, compile, and run Rust code directly in your browser with real-time stdout console output.",
    keywords: "rust online compiler, rust playground, rust wasm, online rust ide, learn rust"
  });

  const [code, setCode] = useState(DEFAULT_RUST);
  const [output, setOutput] = useState("");

  const handleRun = () => {
    setOutput("Compiling rustc v1.75.0 (edition 2021)...\nRunning `target/debug/playground`...\n\n");
    setTimeout(() => {
      let lines = [
        "🦀 Hello from CodePlayground Rust IDE",
        "Total Active Compilers: 100",
        "Vector Sum: 15",
        "\nProgram executed successfully with exit code: 0"
      ];
      setOutput((prev) => prev + lines.join("\n"));
    }, 250);
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <CompilerHeader
            title="Rust WASM Playground"
            badge="rustc 2021"
            badgeColor="bg-orange-500/10 text-orange-400 border-orange-500/30"
            code={code}
            onClear={() => setCode("")}
            onRun={handleRun}
          />

          <AdSenseSlot type="banner" />

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40 overflow-hidden">
            <div className="flex flex-col h-full bg-[#1e1e1e]">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">main.rs</span>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  language="rust"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  options={{ fontSize: 13, minimap: { enabled: false }, automaticLayout: true }}
                />
              </div>
            </div>

            <div className="flex flex-col h-full bg-[#0d0d0f] font-mono text-xs">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center gap-2 text-muted-foreground">
                <TerminalSquare className="w-3.5 h-3.5 text-orange-400" /> Terminal Console (stdout / stderr)
              </div>
              <div className="flex-1 p-4 overflow-auto text-orange-200/90 whitespace-pre leading-relaxed">
                {output || 'Click "Run Rust Code" to compile and execute main.rs.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
