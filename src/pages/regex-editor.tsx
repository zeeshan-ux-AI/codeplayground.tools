import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSEO } from "@/hooks/use-seo";
import { AdSenseSlot } from "@/components/adsense-slot";
import { CompilerHeader } from "@/components/layout/compiler-header";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default function RegexEditorPage() {
  useSEO({
    title: "Online Regex Tester & Matcher | CodePlayground",
    description: "Real-time Regular Expression (Regex) tester, evaluator, and group extractor with live match highlighting.",
    keywords: "regex tester, online regex, regex matcher, regex online editor, regular expression tester"
  });

  const [pattern, setPattern] = useState("([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState(
    `Welcome to CodePlayground!
Contact support@codeplayground.tools for inquiries.
Sales team email: sales@codeplayground.tools
Developer contact: zeeshan@dev.io`
  );

  let matches: RegExpMatchArray[] = [];
  let regexError = "";

  try {
    if (pattern) {
      const regex = new RegExp(pattern, flags);
      if (flags.includes("g")) {
        matches = Array.from(testString.matchAll(regex));
      } else {
        const single = testString.match(regex);
        if (single) matches = [single];
      }
    }
  } catch (err: any) {
    regexError = err.message || "Invalid regular expression pattern";
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <CompilerHeader
            title="Regex Interactive Studio"
            badge="RegExp Engine"
            badgeColor="bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
            code={pattern}
            onClear={() => { setPattern(""); setTestString(""); }}
          />

          <AdSenseSlot type="banner" />

          {/* Regex Input Bar */}
          <div className="p-4 bg-card/40 border-b border-border/30 flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex-1 w-full flex items-center gap-2 bg-[#1e1e1e] border border-border/50 rounded-xl px-3 py-1.5 focus-within:border-indigo-500">
              <span className="text-muted-foreground font-mono text-lg font-bold">/</span>
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern e.g. [a-z]+"
                className="border-0 bg-transparent text-indigo-300 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />
              <span className="text-muted-foreground font-mono text-lg font-bold">/</span>
              <Input
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="gims"
                className="w-16 border-0 bg-transparent text-indigo-400 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0 text-center"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
              {regexError ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Pattern Error
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {matches.length} Matches Found
                </Badge>
              )}
            </div>
          </div>

          {/* Workspace */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40 overflow-hidden">
            {/* Test String Pane */}
            <div className="flex flex-col h-full bg-[#1e1e1e]">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">Test Text Input</span>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  language="plaintext"
                  theme="vs-dark"
                  value={testString}
                  onChange={(val) => setTestString(val || "")}
                  options={{ fontSize: 13, minimap: { enabled: false }, wordWrap: "on", automaticLayout: true }}
                />
              </div>
            </div>

            {/* Matches Pane */}
            <div className="flex flex-col h-full bg-[#141416] p-4 overflow-auto space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Captured Matches & Groups
              </div>

              {regexError ? (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                  {regexError}
                </div>
              ) : matches.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-border/40 text-center text-muted-foreground text-xs">
                  No matches found for current pattern.
                </div>
              ) : (
                <div className="space-y-3">
                  {matches.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-card/50 border border-border/40 space-y-1.5 font-mono text-xs">
                      <div className="flex items-center justify-between text-indigo-300">
                        <span className="font-bold">Match #{idx + 1}</span>
                        <span className="text-[10px] text-muted-foreground">Index: {m.index}</span>
                      </div>
                      <div className="p-2 rounded bg-indigo-500/10 text-indigo-200 break-all font-semibold">
                        {m[0]}
                      </div>
                      {m.length > 1 && (
                        <div className="pl-3 space-y-1 border-l-2 border-indigo-500/30 text-[11px]">
                          {Array.from(m).slice(1).map((group, gIdx) => (
                            <div key={gIdx} className="text-muted-foreground">
                              Group ${gIdx + 1}: <span className="text-emerald-400 font-bold">{group}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
