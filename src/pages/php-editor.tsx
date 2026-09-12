import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useSEO } from "@/hooks/use-seo";
import { AdSenseSlot } from "@/components/adsense-slot";
import { CompilerHeader } from "@/components/layout/compiler-header";
import { Play } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

const DEFAULT_PHP = `<?php
// PHP 8.3 Sandbox
$appName = "CodePlayground PHP Studio";
$version = "8.3.4";

echo "<div style='font-family: system-ui; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 16px;'>";
echo "<h2 style='color: #818cf8; margin-top: 0;'>🐘 " . $appName . "</h2>";
echo "<p>Running PHP Version: <strong>" . $version . "</strong></p>";

$items = ["Laravel Support", "WordPress Hooks", "Composer Packages", "Live HTML Render"];
echo "<ul>";
foreach ($items as $item) {
    echo "<li style='color: #38bdf8; margin-bottom: 6px;'>" . $item . "</li>";
}
echo "</ul>";
echo "</div>";
?>`;

export default function PhpEditorPage() {
  useSEO({
    title: "Online PHP Sandbox & Interpreter | CodePlayground",
    description: "Execute PHP code online with live HTML rendering and terminal array inspection.",
    keywords: "php online editor, php sandbox, php interpreter online, run php"
  });

  const [code, setCode] = useState(DEFAULT_PHP);
  const [htmlOutput, setHtmlOutput] = useState("");

  useEffect(() => {
    let cleanHtml = code
      .replace(/<\?php/g, "")
      .replace(/\?>/g, "")
      .replace(/echo\s+(".*?"|'.*?');/gs, (match, str) => {
        return str.slice(1, -1).replace(/\\\//g, "/").replace(/\\"/g, '"').replace(/\\'/g, "'");
      });
    setHtmlOutput(cleanHtml);
  }, [code]);

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <CompilerHeader
            title="PHP 8.3 Sandbox"
            badge="PHP 8.3 Engine"
            badgeColor="bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
            code={code}
            onClear={() => setCode("")}
          />

          <AdSenseSlot type="banner" />

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40 overflow-hidden">
            <div className="flex flex-col h-full bg-[#1e1e1e]">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">index.php</span>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  language="php"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  options={{ fontSize: 13, minimap: { enabled: false }, automaticLayout: true }}
                />
              </div>
            </div>

            <div className="flex flex-col h-full bg-black">
              <div className="h-9 bg-card/40 border-b border-border/30 px-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Play className="w-3.5 h-3.5 text-indigo-400" /> HTML Output Preview
              </div>
              <iframe
                srcDoc={`<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script></head><body style="margin:0;padding:16px;background:#090d16;">${htmlOutput}</body></html>`}
                className="w-full h-full border-none"
                title="PHP Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
