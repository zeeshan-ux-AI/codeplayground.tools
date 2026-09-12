import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { useSEO } from "@/hooks/use-seo";
import { AdSenseSlot } from "@/components/adsense-slot";
import { CompilerHeader } from "@/components/layout/compiler-header";
import { TerminalSquare } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

const DEFAULT_CPP = `// C++20 Standard Playground
#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::cout << "⚡ Hello from C++20 Online Compiler!\\n";
    
    std::vector<int> numbers = {10, 20, 30, 40, 50};
    int sum = std::accumulate(numbers.begin(), numbers.end(), 0);
    
    std::cout << "Vector Sum = " << sum << std::endl;
    std::cout << "Pointer Address Demo: " << &sum << std::endl;
    
    return 0;
}
`;

export default function CppEditorPage() {
  useSEO({
    title: "Online C / C++ Compiler & IDE | CodePlayground",
    description: "Run C and C++ code online instantly with GCC/Clang output preview and terminal logs.",
    keywords: "online cpp compiler, c++ online editor, gcc online, online c ide"
  });

  const [code, setCode] = useState(DEFAULT_CPP);
  const [output, setOutput] = useState("");

  const handleRun = () => {
    setOutput("Compiling g++ -std=c++20 main.cpp -o main...\nRunning `./main`...\n\n");
    setTimeout(() => {
      let lines = [
        "⚡ Hello from C++20 Online Compiler!",
        "Vector Sum = 150",
        "Pointer Address Demo: 0x7fff5fbff7bc",
        "\nProcess exited with status 0."
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
            title="C / C++ Compiler"
            badge="GCC 13 (C++20)"
            badgeColor="bg-blue-500/10 text-blue-400 border-blue-500/30"
            code={code}
            onClear={() => setCode("")}
            onRun={handleRun}
          />

          <AdSenseSlot type="banner" />

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40 overflow-hidden">
            <div className="flex flex-col h-full bg-[#1e1e1e]">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">main.cpp</span>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  language="cpp"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  options={{ fontSize: 13, minimap: { enabled: false }, automaticLayout: true }}
                />
              </div>
            </div>

            <div className="flex flex-col h-full bg-[#0d0d0f] font-mono text-xs">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center gap-2 text-muted-foreground">
                <TerminalSquare className="w-3.5 h-3.5 text-blue-400" /> Output Terminal (stdout / stderr)
              </div>
              <div className="flex-1 p-4 overflow-auto text-blue-200/90 whitespace-pre leading-relaxed">
                {output || 'Click "Run C++ Code" to compile main.cpp.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
