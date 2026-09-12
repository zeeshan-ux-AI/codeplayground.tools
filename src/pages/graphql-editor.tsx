import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { useSEO } from "@/hooks/use-seo";
import { AdSenseSlot } from "@/components/adsense-slot";
import { CompilerHeader } from "@/components/layout/compiler-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

const DEFAULT_GRAPHQL_QUERY = `query GetDeveloperProfile($username: String!) {
  user(username: $username) {
    id
    name
    role
    compilersCount
    projects {
      id
      title
      language
      updatedAt
    }
  }
}`;

const DEFAULT_VARIABLES = `{
  "username": "Zeeshan"
}`;

export default function GraphqlEditorPage() {
  useSEO({
    title: "Online GraphQL Query Playground | CodePlayground",
    description: "Interactive GraphQL query editor and variable tester with live JSON response preview.",
    keywords: "graphql playground, online graphql editor, graphql query builder, graphql client"
  });

  const [query, setQuery] = useState(DEFAULT_GRAPHQL_QUERY);
  const [variables, setVariables] = useState(DEFAULT_VARIABLES);
  const [response, setResponse] = useState<string | null>(null);

  const handleExecute = () => {
    setTimeout(() => {
      let varObj = {};
      try {
        varObj = JSON.parse(variables);
      } catch (e) {}

      const mockResponse = {
        data: {
          user: {
            id: "usr_99812",
            name: (varObj as any).username || "Zeeshan",
            role: "Lead Full-Stack Developer",
            compilersCount: 21,
            projects: [
              { id: "proj_01", title: "CodePlayground Multi-Compiler Engine", language: "React / TypeScript", updatedAt: "2026-09-12" },
              { id: "proj_02", title: "WASM SQLite Query Engine", language: "C / C++ / WebAssembly", updatedAt: "2026-09-11" }
            ]
          }
        }
      };
      setResponse(JSON.stringify(mockResponse, null, 2));
    }, 200);
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <CompilerHeader
            title="GraphQL Query Studio"
            badge="GraphQL v16"
            badgeColor="bg-pink-500/10 text-pink-400 border-pink-500/30"
            code={query}
            onClear={() => { setQuery(""); setVariables(""); }}
            onRun={handleExecute}
          />

          <AdSenseSlot type="banner" />

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40 overflow-hidden">
            {/* Query & Variables Split */}
            <div className="flex flex-col h-full divide-y divide-border/40 bg-[#1e1e1e]">
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium">GraphQL Query</span>
                </div>
                <div className="flex-1">
                  <Editor
                    height="100%"
                    language="graphql"
                    theme="vs-dark"
                    value={query}
                    onChange={(val) => setQuery(val || "")}
                    options={{ fontSize: 13, minimap: { enabled: false }, automaticLayout: true }}
                  />
                </div>
              </div>

              <div className="h-44 flex flex-col overflow-hidden">
                <div className="h-8 bg-card/40 border-b border-border/30 px-3 flex items-center text-xs text-muted-foreground font-medium">
                  Query Variables (JSON)
                </div>
                <div className="flex-1">
                  <Editor
                    height="100%"
                    language="json"
                    theme="vs-dark"
                    value={variables}
                    onChange={(val) => setVariables(val || "")}
                    options={{ fontSize: 12, minimap: { enabled: false }, automaticLayout: true }}
                  />
                </div>
              </div>
            </div>

            {/* JSON Response Pane */}
            <div className="flex flex-col h-full bg-[#18181b]">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-pink-400">Response Payload (JSON)</span>
              </div>
              <div className="flex-1 p-4 font-mono text-xs text-pink-300/90 overflow-auto whitespace-pre">
                {response ? (
                  response
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                    Click "Execute Query" to trigger query execution.
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
