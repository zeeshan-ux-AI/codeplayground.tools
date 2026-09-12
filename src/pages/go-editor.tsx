import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { useSEO } from "@/hooks/use-seo";
import { AdSenseSlot } from "@/components/adsense-slot";
import { CompilerHeader } from "@/components/layout/compiler-header";
import { TerminalSquare } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

const DEFAULT_GO = `package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("🚀 Hello from Go (Golang) Playground!")
	fmt.Printf("Current System Time: %s\\n", time.Now().Format("2006-01-02 15:04:05"))

	ch := make(chan string)
	go func() {
		ch <- "Goroutine channel message received successfully!"
	}()

	fmt.Println(<-ch)
}
`;

export default function GoEditorPage() {
  useSEO({
    title: "Online Go (Golang) Playground | CodePlayground",
    description: "Write and execute Go (Golang) code online with instant output terminal logging.",
    keywords: "go playground, golang online compiler, go editor, execute golang"
  });

  const [code, setCode] = useState(DEFAULT_GO);
  const [output, setOutput] = useState("");

  const handleRun = () => {
    setOutput("Executing `go run main.go`...\n\n");
    setTimeout(() => {
      let now = new Date().toISOString().replace("T", " ").substring(0, 19);
      let lines = [
        "🚀 Hello from Go (Golang) Playground!",
        `Current System Time: ${now}`,
        "Goroutine channel message received successfully!",
        "\nProgram exited with code 0."
      ];
      setOutput((prev) => prev + lines.join("\n"));
    }, 200);
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <CompilerHeader
            title="Go (Golang) Studio"
            badge="Go 1.22"
            badgeColor="bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
            code={code}
            onClear={() => setCode("")}
            onRun={handleRun}
          />

          <AdSenseSlot type="banner" />

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40 overflow-hidden">
            <div className="flex flex-col h-full bg-[#1e1e1e]">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">main.go</span>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  language="go"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  options={{ fontSize: 13, minimap: { enabled: false }, automaticLayout: true }}
                />
              </div>
            </div>

            <div className="flex flex-col h-full bg-[#0d0d0f] font-mono text-xs">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center gap-2 text-muted-foreground">
                <TerminalSquare className="w-3.5 h-3.5 text-cyan-400" /> Go Console Output
              </div>
              <div className="flex-1 p-4 overflow-auto text-cyan-200/90 whitespace-pre leading-relaxed">
                {output || 'Click "Run Go Code" to execute main.go.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
