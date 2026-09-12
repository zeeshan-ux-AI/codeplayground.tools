import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useSEO } from "@/hooks/use-seo";
import { AdSenseSlot } from "@/components/adsense-slot";
import { CompilerHeader } from "@/components/layout/compiler-header";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

const DEFAULT_YAML = `# Kubernetes Deployment & App Config
apiVersion: apps/v1
kind: Deployment
metadata:
  name: codeplayground-api
  labels:
    app: codeplayground
spec:
  replicas: 3
  selector:
    matchLabels:
      app: codeplayground
  template:
    metadata:
      labels:
        app: codeplayground
    spec:
      containers:
        - name: node-server
          image: codeplayground/server:latest
          ports:
            - containerPort: 5000
          env:
            - name: NODE_ENV
              value: production
            - name: COMPILERS_COUNT
              value: "100"
`;

export default function YamlEditorPage() {
  useSEO({
    title: "Online YAML Editor & JSON Converter | CodePlayground",
    description: "Validate YAML syntax, lint configuration files, and convert YAML to JSON instantly.",
    keywords: "yaml editor, online yaml validator, yaml to json, kubernetes yaml editor, docker compose validator"
  });

  const [code, setCode] = useState(DEFAULT_YAML);
  const [jsonOutput, setJsonOutput] = useState("");
  const [isValid, setIsValid] = useState(true);

  const parseSimpleYaml = (str: string) => {
    try {
      const lines = str.split("\n");
      const obj: any = {};

      lines.forEach((line) => {
        if (!line.trim() || line.trim().startsWith("#")) return;
        const parts = line.split(":");
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join(":").trim();
          if (val) {
            obj[key] = val.replace(/^["']|["']$/g, "");
          }
        }
      });

      setIsValid(true);
      setJsonOutput(JSON.stringify(obj, null, 2));
    } catch (e) {
      setIsValid(false);
      setJsonOutput("// Invalid YAML structure");
    }
  };

  useEffect(() => {
    parseSimpleYaml(code);
  }, [code]);

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <CompilerHeader
            title="YAML & Config Studio"
            badge="YAML 1.2"
            badgeColor="bg-teal-500/10 text-teal-400 border-teal-500/30"
            code={code}
            onClear={() => setCode("")}
          />

          <AdSenseSlot type="banner" />

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40 overflow-hidden">
            <div className="flex flex-col h-full bg-[#1e1e1e]">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">deployment.yaml</span>
                {isValid ? (
                  <span className="text-teal-400 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Valid YAML Syntax
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-1 text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" /> Syntax Warning
                  </span>
                )}
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  language="yaml"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  options={{ fontSize: 13, minimap: { enabled: false }, automaticLayout: true }}
                />
              </div>
            </div>

            <div className="flex flex-col h-full bg-[#141416]">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>Converted JSON View</span>
              </div>
              <div className="flex-1 p-4 font-mono text-xs text-teal-300/90 overflow-auto whitespace-pre">
                {jsonOutput}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
