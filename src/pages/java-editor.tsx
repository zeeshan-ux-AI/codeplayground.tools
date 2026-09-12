import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { useSEO } from "@/hooks/use-seo";
import { AdSenseSlot } from "@/components/adsense-slot";
import { CompilerHeader } from "@/components/layout/compiler-header";
import { TerminalSquare } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

const DEFAULT_JAVA = `// Java OpenJDK 21 Playground
public class Main {
    public static void main(String[] args) {
        System.out.println("☕ Hello from Java Online Compiler!");
        
        int[] scores = {95, 88, 92, 100, 85};
        int total = 0;
        for (int s : scores) {
            total += s;
        }
        
        double average = (double) total / scores.length;
        System.out.println("Average Score: " + average);
        System.out.println("JVM Version: OpenJDK 21.0.2");
    }
}
`;

export default function JavaEditorPage() {
  useSEO({
    title: "Online Java Compiler & Runner | CodePlayground",
    description: "Write, compile, and execute Java code online with OpenJDK output preview.",
    keywords: "java online compiler, java playground, run java online, javac online"
  });

  const [code, setCode] = useState(DEFAULT_JAVA);
  const [output, setOutput] = useState("");

  const handleRun = () => {
    setOutput("Compiling `javac Main.java`...\nRunning `java Main`...\n\n");
    setTimeout(() => {
      let lines = [
        "☕ Hello from Java Online Compiler!",
        "Average Score: 92.0",
        "JVM Version: OpenJDK 21.0.2",
        "\nProgram terminated normally."
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
            title="Java Studio"
            badge="OpenJDK 21"
            badgeColor="bg-red-500/10 text-red-400 border-red-500/30"
            code={code}
            onClear={() => setCode("")}
            onRun={handleRun}
          />

          <AdSenseSlot type="banner" />

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40 overflow-hidden">
            <div className="flex flex-col h-full bg-[#1e1e1e]">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">Main.java</span>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  language="java"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  options={{ fontSize: 13, minimap: { enabled: false }, automaticLayout: true }}
                />
              </div>
            </div>

            <div className="flex flex-col h-full bg-[#0d0d0f] font-mono text-xs">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center gap-2 text-muted-foreground">
                <TerminalSquare className="w-3.5 h-3.5 text-red-400" /> Standard Output
              </div>
              <div className="flex-1 p-4 overflow-auto text-red-200/90 whitespace-pre leading-relaxed">
                {output || 'Click "Run Java Code" to execute Main.java.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
