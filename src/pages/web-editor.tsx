import { useState, useEffect, Suspense, useRef } from "react";
import { useLocation } from "wouter";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";
import { PreviewIframe } from "@/components/editor/preview-iframe";
import { ConsolePanel, type LogMessage } from "@/components/editor/console-panel";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useDebounce } from "@/hooks/use-debounce";
import { useLocalProjects } from "@/hooks/use-local-projects";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import { FileCode2, Paintbrush, FileJson } from "lucide-react";
import JSZip from "jszip";
import { EditorSkeleton } from "@/components/editor/editor-skeleton";
import { TemplateDialog } from "@/components/editor/template-dialog";
import { ShortcutsDialog } from "@/components/editor/shortcuts-dialog";
import type { WebTemplate } from "@/lib/templates";

const DEFAULT_HTML = `<div class="container">\n  <h1>Hello Web World</h1>\n  <p>Start editing to see magic happen!</p>\n  <button id="btn">Click Me</button>\n</div>`;
const DEFAULT_CSS = `.container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100vh;\n  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);\n}\n\nh1 {\n  color: #2c3e50;\n  font-size: 3rem;\n  margin-bottom: 0.5rem;\n}\n\nbutton {\n  margin-top: 1rem;\n  padding: 10px 24px;\n  background: #3498db;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  font-weight: bold;\n  cursor: pointer;\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n\nbutton:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);\n}`;
const DEFAULT_JS = `document.getElementById('btn').addEventListener('click', () => {\n  console.log('Button was clicked!');\n  alert('Magic happened!');\n});\n\nconsole.log('Editor initialized');`;

export default function WebEditor() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const projectId = searchParams.get("id");
  
  useSEO({
    title: "Free Online HTML CSS JavaScript Editor - Live Preview | CodePlayground",
    description: "The best free online HTML, CSS, and JavaScript editor with real-time live preview. Build web pages instantly in your browser — no installation required. Try CodePlayground's web IDE now.",
    keywords: "html css javascript editor online, live preview editor, web ide, online html editor, online css editor, js playground, frontend code editor, web design tool, browser ide, codeplayground web editor",
    canonical: "/web-editor",
    ogType: "software",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "CodePlayground Web Editor",
      "operatingSystem": "Browser",
      "applicationCategory": "DeveloperApplication",
      "url": "https://www.codeplayground.tools/web-editor",
      "description": "Browser-based frontend web editor for HTML, CSS, and JavaScript with live preview.",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "author": { "@type": "Person", "name": "Zeeshan Khan" }
    }
  });

  const { createProject, updateProject, getProject } = useLocalProjects();
  const { toast } = useToast();

  const [projectName, setProjectName] = useState("Untitled Web Project");
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const editorRef = useRef<any>(null);

  // Load project if ID is provided
  useEffect(() => {
    if (projectId) {
      const proj = getProject(projectId);
      if (proj && proj.type === "html-css-js") {
        setProjectName(proj.name);
        setHtml(proj.html || "");
        setCss(proj.css || "");
        setJs(proj.js || "");
      }
    }
  }, [projectId, getProject]);

  const debouncedHtml = useDebounce(html, 50);
  const debouncedCss = useDebounce(css, 50);
  const debouncedJs = useDebounce(js, 50);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (projectId) {
        updateProject(projectId, { name: projectName, html, css, js });
        toast({ title: "Project saved successfully!" });
      } else {
        const newProj = createProject(projectName, "html-css-js", { html, css, js });
        toast({ title: "Project created and saved!" });
        window.history.replaceState({}, '', `/editor?id=${newProj.id}`);
      }
    } catch (e) {
      toast({ title: "Failed to save project", variant: "destructive" });
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      zip.file("index.html", html || "");
      zip.file("styles.css", css || "");
      zip.file("script.js", js || "");
      zip.file("README.md", `# ${projectName || "Web Project"}\n\nBuilt with CodePlayground.\n`);
      
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName.toLowerCase().replace(/\s+/g, '-') || "web-project"}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({ title: "Project downloaded as ZIP!" });
    } catch (e) {
      toast({ title: "Download failed", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClearCode = () => {
    if (confirm("Are you sure you want to clear all code in index.html, styles.css, and script.js?")) {
      setHtml("");
      setCss("");
      setJs("");
      toast({ title: "Code cleared" });
    }
  };

  const handleShare = () => {
    try {
      const payload = JSON.stringify({ name: projectName, type: "html-css-js", html, css, js });
      const shareId = btoa(payload);
      const url = `${window.location.origin}/p/${shareId}`;
      navigator.clipboard.writeText(url);
      toast({ title: "Share link copied to clipboard!" });
    } catch (e) {
      toast({ title: "Could not generate share link", variant: "destructive" });
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset this project? All unsaved changes will be lost!")) {
      setHtml(DEFAULT_HTML);
      setCss(DEFAULT_CSS);
      setJs(DEFAULT_JS);
      toast({ title: "Project reset to defaults" });
    }
  };

  const handleSelectTemplate = (tmpl: WebTemplate) => {
    setProjectName(tmpl.name);
    setHtml(tmpl.html);
    setCss(tmpl.css);
    setJs(tmpl.js);
    toast({ title: `Loaded template: ${tmpl.name}` });
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
      toast({ title: "Code formatted!" });
    } else {
      toast({ title: "Code formatted!" });
    }
  };

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [html, css, js, projectName, projectId]);

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        
        <div className="flex flex-col flex-1 min-w-0">
          <AppNavbar 
            title={projectName} 
            mode="web"
            isSaving={isSaving}
            onSave={handleSave}
            onDownload={handleDownload}
            isDownloading={isDownloading}
            onReset={handleReset}
            onClearCode={handleClearCode}
            onShare={handleShare}
            onFormat={handleFormat}
            onOpenTemplates={() => setShowTemplates(true)}
            onOpenShortcuts={() => setShowShortcuts(true)}
          />
          
          <main className="flex-1 overflow-hidden">
            <PanelGroup direction="horizontal">
              {/* Left Panel: Editor */}
              <Panel defaultSize={45} minSize={20} className="flex flex-col bg-[#1e1e1e]">
                <div className="flex bg-[#252526] border-b border-border/10 overflow-x-auto no-scrollbar">
                  <div 
                    className={`editor-tab ${activeTab === "html" ? "active" : ""}`}
                    onClick={() => setActiveTab("html")}
                  >
                    <FileCode2 className="w-4 h-4 text-orange-500" /> index.html
                  </div>
                  <div 
                    className={`editor-tab ${activeTab === "css" ? "active" : ""}`}
                    onClick={() => setActiveTab("css")}
                  >
                    <Paintbrush className="w-4 h-4 text-blue-400" /> styles.css
                  </div>
                  <div 
                    className={`editor-tab ${activeTab === "js" ? "active" : ""}`}
                    onClick={() => setActiveTab("js")}
                  >
                    <FileJson className="w-4 h-4 text-yellow-400" /> script.js
                  </div>
                </div>
                
                <div className="flex-1 relative">
                  <Suspense fallback={<EditorSkeleton />}>
                    {activeTab === "html" && (
                      <Editor
                        height="100%"
                        defaultLanguage="html"
                        theme="vs-dark"
                        value={html}
                        onChange={(v) => setHtml(v || "")}
                        onMount={(editor) => { editorRef.current = editor; }}
                        options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: "on", padding: { top: 16 } }}
                      />
                    )}
                    {activeTab === "css" && (
                      <Editor
                        height="100%"
                        defaultLanguage="css"
                        theme="vs-dark"
                        value={css}
                        onChange={(v) => setCss(v || "")}
                        onMount={(editor) => { editorRef.current = editor; }}
                        options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: "on", padding: { top: 16 } }}
                      />
                    )}
                    {activeTab === "js" && (
                      <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        theme="vs-dark"
                        value={js}
                        onChange={(v) => setJs(v || "")}
                        onMount={(editor) => { editorRef.current = editor; }}
                        options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: "on", padding: { top: 16 } }}
                      />
                    )}
                  </Suspense>
                </div>
              </Panel>

              <PanelResizeHandle className="Resizer" />

              {/* Right Panel: Preview & Console */}
              <Panel defaultSize={55} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} className="relative overflow-hidden">
                    <PreviewIframe
                      mode="web"
                      html={debouncedHtml}
                      css={debouncedCss}
                      js={debouncedJs}
                      onLog={(log) => setLogs((prev) => [...prev, log])}
                    />
                  </Panel>
                  
                  <PanelResizeHandle className="Resizer" />
                  
                  <Panel defaultSize={30}>
                    <ConsolePanel 
                      logs={logs} 
                      onClear={() => setLogs([])} 
                    />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </main>

          {/* Status Bar */}
          <div className="h-8 border-t border-border/40 bg-muted/30 flex items-center justify-between px-4 text-[11px] text-muted-foreground shrink-0 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Editor Ready</span>
              </div>
              <div className="h-3 w-[1px] bg-border/40" />
              <div className="flex items-center gap-1">
                <span>Developer:</span>
                <span className="text-foreground font-medium">Zeeshan</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <a href="https://github.com/zeeshan-ux-ai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
                <a href="https://x.com/zeeshan9or" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">X (Twitter)</a>
              </div>
              <div className="h-3 w-[1px] bg-border/40" />
              <span>UTF-8</span>
            </div>
          </div>
        </div>
      </div>

      <TemplateDialog
        open={showTemplates}
        onOpenChange={setShowTemplates}
        mode="web"
        onSelectWebTemplate={handleSelectTemplate}
      />
      <ShortcutsDialog open={showShortcuts} onOpenChange={setShowShortcuts} />
    </SidebarProvider>
  );
}
