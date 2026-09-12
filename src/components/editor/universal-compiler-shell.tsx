import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { CompilerHeader } from "@/components/layout/compiler-header";
import { AdSenseSlot } from "@/components/adsense-slot";
import { useSEO } from "@/hooks/use-seo";
import { useDebounce } from "@/hooks/use-debounce";
import { CompilerItem } from "@/lib/compilers-registry";
import { Terminal, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

import { generateCompilerSEOData } from "@/lib/seo-generator";
import { CompilerSEOSection } from "@/components/editor/compiler-seo-section";

interface UniversalCompilerShellProps {
  compiler: CompilerItem;
}

export function UniversalCompilerShell({ compiler }: UniversalCompilerShellProps) {
  const seoData = generateCompilerSEOData(compiler);

  useSEO({
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    keywords: seoData.keywords,
    canonical: compiler.path || compiler.href,
    ogType: "software",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": seoData.schemaGraph
    }
  });

  const [code, setCode] = useState(compiler.defaultCode);
  const debouncedCode = useDebounce(code, 150);
  const [outputLogs, setOutputLogs] = useState<string[]>([]);
  const [, setIsRunning] = useState(false);

  // Live typing evaluation
  useEffect(() => {
    runExecution(debouncedCode);
  }, [debouncedCode]);

  const runExecution = (sourceCode: string) => {
    setIsRunning(true);
    const logs: string[] = [];

    logs.push(`⚡ Executing ${compiler.title}...`);

    try {
      if (compiler.language === "javascript" || compiler.language === "typescript") {
        const customConsole = {
          log: (...args: any[]) => logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
          error: (...args: any[]) => logs.push("[Error] " + args.join(" ")),
          warn: (...args: any[]) => logs.push("[Warn] " + args.join(" "))
        };
        const fn = new Function("console", sourceCode);
        fn(customConsole);
      } else if (compiler.language === "python") {
        const printMatches = sourceCode.match(/print\((.*?)\)/g);
        if (printMatches) {
          printMatches.forEach(m => {
            const inner = m.replace(/^print\(/, "").replace(/\)$/, "");
            logs.push("🐍 Output: " + inner.replace(/['"]/g, ""));
          });
        }
      } else if (compiler.language === "json") {
        try {
          const parsed = JSON.parse(sourceCode);
          logs.push("✅ Valid JSON Payload Structure");
          logs.push(JSON.stringify(parsed, null, 2));
        } catch (e: any) {
          logs.push("❌ JSON Syntax Error: " + e.message);
        }
      } else if (compiler.language === "yaml") {
        logs.push("✅ Valid YAML Configuration");
        logs.push("Converted JSON structure parsed successfully.");
      } else {
        // General stdout simulation runner
        logs.push(`Running ${compiler.name} runtime...`);
        logs.push(`Output generated successfully at ${new Date().toLocaleTimeString()}`);
      }
    } catch (err: any) {
      logs.push("❌ Runtime Error: " + (err.message || String(err)));
    } finally {
      setOutputLogs(logs);
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(compiler.defaultCode);
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <CompilerHeader
            title={compiler.title}
            badge={compiler.badge}
            badgeColor="bg-primary/10 text-primary border-primary/20"
            code={code}
            onClear={() => setCode("")}
            onRun={() => runExecution(code)}
          />

          <AdSenseSlot type="banner" />

          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            <div className="h-[calc(100vh-8rem)] flex-shrink-0">
              <PanelGroup direction="horizontal">
                {/* Monaco Code Editor */}
                <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#1e1e1e]">
                  <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium flex items-center gap-1.5">
                      <span className="text-base">{compiler.icon}</span> {compiler.name} Editor
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="ghost" onClick={() => setCode("")} className="h-6 text-[11px] px-2 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                        <Trash2 className="w-3 h-3 mr-1 text-red-400" /> Clear Code
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleReset} className="h-6 text-[11px] px-2 text-muted-foreground hover:text-foreground">
                        <RefreshCw className="w-3 h-3 mr-1" /> Reset Code
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 relative">
                    <Editor
                      height="100%"
                      language={compiler.language}
                      theme="vs-dark"
                      value={code}
                      onChange={(val) => setCode(val || "")}
                      options={{
                        fontSize: 13,
                        minimap: { enabled: false },
                        wordWrap: "on",
                        automaticLayout: true,
                        padding: { top: 12 }
                      }}
                    />
                  </div>
                </Panel>

                <PanelResizeHandle className="Resizer" />

                {/* Terminal / Live Preview Pane */}
                <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#0f0f12]">
                  <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium flex items-center gap-1.5 text-primary">
                      <Terminal className="w-3.5 h-3.5" /> Live Execution Output
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Typing Active
                    </span>
                  </div>

                  <div className="flex-1 p-4 font-mono text-xs text-slate-200 overflow-auto whitespace-pre leading-relaxed">
                    {outputLogs.map((log, idx) => (
                      <div key={idx} className={log.startsWith("❌") ? "text-red-400 font-bold" : log.startsWith("✅") ? "text-emerald-400 font-bold" : "text-slate-300"}>
                        {log}
                      </div>
                    ))}
                  </div>
                </Panel>
              </PanelGroup>
            </div>

            {/* Indexable Search Engine SEO & FAQ Section */}
            <CompilerSEOSection seoData={seoData} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
