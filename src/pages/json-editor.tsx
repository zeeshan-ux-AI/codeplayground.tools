import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useSEO } from "@/hooks/use-seo";
import { AdSenseSlot } from "@/components/adsense-slot";
import { CompilerHeader } from "@/components/layout/compiler-header";
import { CheckCircle2, AlertCircle, FileJson, Play } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

const DEFAULT_JSON = `{
  "appName": "CodePlayground",
  "version": "2.0.0",
  "features": [
    "100 Online Compilers",
    "Instant Live Preview",
    "WASM Runtimes",
    "Folder Export"
  ],
  "monetization": {
    "adSense": true,
    "tier": "Free Developer Tools"
  },
  "stats": {
    "compilersCount": 100,
    "activeUsers": 50000
  }
}`;

export default function JsonEditorPage() {
  useSEO({
    title: "Online JSON Editor, Validator & Prettifier | CodePlayground",
    description: "Free online JSON editor, formatter, minifier, and validator with live syntax checking and formatted output.",
    keywords: "online json editor, json validator, json formatter, json prettifier, json path finder, developer tools"
  });

  const [code, setCode] = useState(DEFAULT_JSON);
  const [isValid, setIsValid] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [formatted, setFormatted] = useState("");

  const validateAndFormat = (input: string) => {
    try {
      const parsed = JSON.parse(input);
      setIsValid(true);
      setErrorMsg("");
      setFormatted(JSON.stringify(parsed, null, 2));
    } catch (err: any) {
      setIsValid(false);
      setErrorMsg(err.message || "Invalid JSON syntax");
    }
  };

  useEffect(() => {
    validateAndFormat(code);
  }, [code]);

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <CompilerHeader
            title="JSON Studio & Validator"
            badge="JSON Standard"
            badgeColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            code={code}
            onClear={() => setCode("")}
          />

          <AdSenseSlot type="banner" />

          {/* Main Workspace */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40 overflow-hidden">
            {/* Editor Pane */}
            <div className="flex flex-col h-full overflow-hidden bg-[#1e1e1e]">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium flex items-center gap-1.5">
                  <FileJson className="w-3.5 h-3.5 text-emerald-400" /> Input JSON
                </span>
                <div className="flex items-center gap-2">
                  {isValid ? (
                    <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Valid JSON
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center gap-1 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" /> Syntax Error
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <Editor
                  height="100%"
                  language="json"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    wordWrap: "on",
                    automaticLayout: true,
                    tabSize: 2
                  }}
                />
              </div>
            </div>

            {/* Formatted Output Pane */}
            <div className="flex flex-col h-full overflow-hidden bg-[#18181b]">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-emerald-400" /> Formatted Tree & Output
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Size: {new Blob([code]).size} bytes
                </span>
              </div>

              <div className="flex-1 p-4 overflow-auto font-mono text-xs text-emerald-300/90 whitespace-pre">
                {isValid ? (
                  formatted
                ) : (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 space-y-2">
                    <div className="font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> JSON Syntax Error
                    </div>
                    <div className="text-xs font-mono">{errorMsg}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
