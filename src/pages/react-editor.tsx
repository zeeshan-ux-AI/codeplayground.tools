import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";
import { ReactFastPreview, type VirtualFiles } from "@/components/editor/react-fast-preview";
import { ConsolePanel, type LogMessage } from "@/components/editor/console-panel";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useDebounce } from "@/hooks/use-debounce";
import { useLocalProjects } from "@/hooks/use-local-projects";
import { useToast } from "@/hooks/use-toast";
import {
  FileText, Folder, FolderOpen, Plus, Trash2,
  ChevronRight, ChevronDown, Atom, FileCode2, Search, Upload
} from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import JSZip from "jszip";
import { EditorSkeleton } from "@/components/editor/editor-skeleton";
import { TemplateDialog } from "@/components/editor/template-dialog";
import { ShortcutsDialog } from "@/components/editor/shortcuts-dialog";
import type { ReactTemplate } from "@/lib/templates";
import { readFolderFiles, extractZipFiles } from "@/lib/folder-upload";
import { generateCompilerSEOData } from "@/lib/seo-generator";
import { CompilerSEOSection } from "@/components/editor/compiler-seo-section";

const DEFAULT_FILES: VirtualFiles = {
  "src/index.jsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,

  "src/App.jsx": `import React from 'react';
import Header from './components/Header';
import ProfileCard from './components/ProfileCard';
import Counter from './components/Counter';

export default function App() {
  return (
    <div className="app">
      <Header title="CodePlayground React Studio" />
      <main className="main-content">
        <div className="wrapper">
          <ProfileCard />
          <Counter />
        </div>
      </main>
    </div>
  );
}`,

  "src/components/Header.jsx": `import React from 'react';

export default function Header({ title }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo-group">
          <span className="logo">⚡</span>
          <h1>{title || "CodePlayground Studio"}</h1>
        </div>
        <span className="platform-tag">React 18</span>
      </div>
    </header>
  );
}`,

  "src/components/ProfileCard.jsx": `import React from 'react';
import useProfile from '../hooks/useProfile';

export default function ProfileCard() {
  const { profile } = useProfile();

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="avatar-wrapper">
          <div className="avatar-initial">Z</div>
        </div>
        <div className="profile-title">
          <div className="name-row">
            <h2>{profile.name}</h2>
            <span className="verified-icon" title="Verified Developer">✓</span>
          </div>
          <span className="role">{profile.title}</span>
        </div>
      </div>

      <p className="bio">{profile.bio}</p>
    </div>
  );
}`,

  "src/components/Counter.jsx": `import React from 'react';
import useCounter from '../hooks/useCounter';

export default function Counter() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div className="counter-card">
      <div className="author-badge">CodePlayground IDE</div>
      <h2 className="counter-title">Interactive React Counter</h2>
      <div className="counter-display">{count}</div>
      <div className="counter-buttons">
        <button className="btn btn-secondary" onClick={decrement}>−</button>
        <button className="btn btn-ghost" onClick={reset}>Reset</button>
        <button className="btn btn-primary" onClick={increment}>+</button>
      </div>
      <p className="counter-hint">Developed by Zeeshan — Powered by React 18 & Babel</p>
    </div>
  );
}`,

  "src/hooks/useProfile.js": `import React from 'react';

export default function useProfile() {
  const [profile] = React.useState({
    name: "Zeeshan",
    title: "Full-Stack Developer & Software Architect",
    bio: "Building high-performance web applications, online compilers, and developer tools on CodePlayground."
  });

  return { profile };
}`,

  "src/hooks/useCounter.js": `import React from 'react';

export default function useCounter(initialValue = 0) {
  const [count, setCount] = React.useState(initialValue);

  const increment = () => {
    console.log('Zeeshan King Counter +1:', count + 1);
    setCount(c => c + 1);
  };
  const decrement = () => setCount(c => c - 1);
  const reset = () => {
    console.log('Zeeshan King Counter Reset');
    setCount(initialValue);
  };

  return { count, increment, decrement, reset };
}`,

  "src/styles.css": `* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  min-height: 100vh;
  color: #f8fafc;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(245, 158, 11, 0.3);
  padding: 0.85rem 1.5rem;
}

.header-inner {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-group {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.logo { font-size: 1.6rem; }

.header h1 {
  font-size: 1.3rem;
  font-weight: 800;
  background: linear-gradient(to right, #fbbf24, #f59e0b, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.linkedin-badge {
  background: rgba(10, 102, 194, 0.2);
  color: #38bdf8;
  border: 1px solid rgba(10, 102, 194, 0.4);
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
}

.linkedin-badge:hover {
  background: #0a66c2;
  color: white;
  transform: translateY(-1px);
}

.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
  max-width: 440px;
}

.profile-card {
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(10, 102, 194, 0.35);
  border-radius: 1.25rem;
  padding: 1.5rem;
  width: 100%;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), 0 0 20px rgba(10, 102, 194, 0.15);
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  margin-bottom: 0.75rem;
}

.platform-tag {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-initial {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38bdf8, #0284c7);
  color: white;
  font-weight: 900;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(56, 189, 248, 0.3);
}

.name-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.verified-icon {
  background: #38bdf8;
  color: #0f172a;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 900;
}

.profile-title {
  text-align: left;
}

.profile-title h2 {
  font-size: 1.2rem;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.2;
}

.profile-title .role {
  font-size: 0.75rem;
  color: #38bdf8;
  font-weight: 600;
}

.bio {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 0.85rem;
  line-height: 1.4;
}

.url-box {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1rem;
  text-align: left;
}

.url-tag {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 0.15rem;
}

.live-url {
  font-size: 0.72rem;
  color: #38bdf8;
  word-break: break-all;
  font-family: monospace;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.15s;
}

.live-url:hover {
  color: #7dd3fc;
  text-decoration: underline;
}

.btn-linkedin {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.65rem 1rem;
  border-radius: 0.75rem;
  background: #0a66c2;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(10, 102, 194, 0.4);
}

.btn-linkedin:hover {
  background: #004182;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(10, 102, 194, 0.6);
}

.linkedin-icon {
  width: 16px;
  height: 16px;
}

.counter-card {
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 1.25rem;
  padding: 1.5rem;
  width: 100%;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}

.author-badge {
  font-size: 0.7rem;
  font-weight: 800;
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.35rem;
}

.counter-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.85rem;
  color: #f8fafc;
}

.counter-display {
  font-size: 3rem;
  font-weight: 900;
  color: #38bdf8;
  margin-bottom: 0.85rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.counter-buttons {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 0.85rem;
}

.btn {
  flex: 1;
  padding: 0.55rem 0.85rem;
  border-radius: 0.65rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.btn-secondary {
  background: #334155;
  color: #f8fafc;
}

.btn-secondary:hover {
  background: #475569;
  transform: translateY(-2px);
}

.btn-ghost {
  background: transparent;
  color: #94a3b8;
  font-size: 0.8rem;
  flex: 0.7;
}

.btn-ghost:hover {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.05);
}

.counter-hint {
  font-size: 0.7rem;
  color: #94a3b8;
}`
};

type FileNode = {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
};

function buildFileTree(files: VirtualFiles, searchFilter: string = ""): FileNode[] {
  const tree: FileNode[] = [];
  const folders: Record<string, FileNode> = {};

  const paths = Object.keys(files)
    .filter((p) => !searchFilter || p.toLowerCase().includes(searchFilter.toLowerCase()))
    .sort();

  paths.forEach((filePath) => {
    const parts = filePath.split("/");
    let currentPath = "";
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      if (!folders[currentPath]) {
        const node: FileNode = { name: part, path: currentPath, type: "folder", children: [] };
        folders[currentPath] = node;
        if (parentPath && folders[parentPath]) {
          folders[parentPath].children!.push(node);
        } else {
          tree.push(node);
        }
      }
    }
    const fileName = parts[parts.length - 1];
    const parentPath = parts.slice(0, -1).join("/");
    const fileNode: FileNode = { name: fileName, path: filePath, type: "file" };
    if (parentPath && folders[parentPath]) {
      folders[parentPath].children!.push(fileNode);
    } else {
      tree.push(fileNode);
    }
  });

  return tree;
}

function getFileIcon(name: string) {
  if (name.endsWith(".jsx") || name.endsWith(".tsx")) return <Atom className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
  if (name.endsWith(".js") || name.endsWith(".ts")) return <FileCode2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />;
  if (name.endsWith(".css")) return <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
  return <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;
}

function getLanguage(path: string) {
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".html")) return "html";
  return "javascript";
}

function FileTreeNode({
  node,
  activeFile,
  onSelect,
  onDelete,
  depth = 0,
}: {
  node: FileNode;
  activeFile: string;
  onSelect: (path: string) => void;
  onDelete: (path: string) => void;
  depth?: number;
}) {
  const [open, setOpen] = useState(true);

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 px-2 py-0.5 w-full text-left text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 rounded transition-colors group"
          style={{ paddingLeft: `${8 + depth * 12}px` }}
        >
          {open ? <ChevronDown className="w-3 h-3 shrink-0" /> : <ChevronRight className="w-3 h-3 shrink-0" />}
          {open ? <FolderOpen className="w-3.5 h-3.5 text-yellow-400/80 shrink-0" /> : <Folder className="w-3.5 h-3.5 text-yellow-400/80 shrink-0" />}
          <span className="truncate font-medium">{node.name}</span>
        </button>
        {open && node.children?.map((child) => (
          <FileTreeNode key={child.path} node={child} activeFile={activeFile} onSelect={onSelect} onDelete={onDelete} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-0.5 cursor-pointer text-xs rounded group transition-colors ${
        activeFile === node.path
          ? "bg-primary/20 text-primary border-l-2 border-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      }`}
      style={{ paddingLeft: `${8 + depth * 12}px` }}
      onClick={() => onSelect(node.path)}
    >
      {getFileIcon(node.name)}
      <span className="truncate flex-1">{node.name}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(node.path); }}
        className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-destructive transition-all"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

async function downloadProjectZip(files: VirtualFiles, projectName: string) {
  const zip = new JSZip();

  zip.file("package.json", JSON.stringify({
    name: projectName.toLowerCase().replace(/\s+/g, "-") || "my-react-app",
    version: "1.0.0",
    private: true,
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-scripts": "5.0.1"
    },
    scripts: {
      "start": "react-scripts start",
      "build": "react-scripts build",
      "test": "react-scripts test"
    },
    browserslist: {
      "production": [">0.2%", "not dead", "not op_mini all"],
      "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
    }
  }, null, 2));

  zip.file("public/index.html", `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${projectName || "React App"}</title>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>`);

  zip.file("README.md", `# ${projectName || "My React App"}

Built with CodePlayground — https://codeplayground.app

## Getting Started

\`\`\`bash
npm install
npm start
\`\`\`

## Build for Production

\`\`\`bash
npm run build
\`\`\`
`);

  zip.file(".gitignore", `node_modules/\n.env\nbuild/\n`);

  Object.entries(files).forEach(([path, content]) => {
    let finalContent = content;
    if (path === "src/index.jsx") {
      finalContent = `import React from 'react';\nimport ReactDOM from 'react-dom/client';\n` + content;
    } else if (path.endsWith(".jsx") || path.endsWith(".js")) {
      if (content.includes("<") && !content.startsWith("import React")) {
        finalContent = `import React from 'react';\n` + content;
      }
    }
    zip.file(path, finalContent);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectName || "react-project"}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ReactEditor() {
  const searchParams = new URLSearchParams(window.location.search);
  const projectId = searchParams.get("id");

  const seoData = generateCompilerSEOData({
    id: "react-editor",
    title: "React JSX Multi-file IDE",
    name: "React IDE",
    href: "/react-editor",
    category: "Web Frameworks",
    icon: "⚛️",
    badge: "Pro IDE",
    desc: "The best free online React IDE with multi-file support, real-time preview, JSX transpilation, and zero setup. Build and test React components instantly in your browser. React 18 supported.",
    keywords: "online react js editor, react playground, react sandbox, react live preview, browser react ide, react zip export, codesandbox alternative, stackblitz alternative, react code runner, code playground",
    language: "javascript",
    defaultCode: ""
  });

  useSEO({
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    keywords: seoData.keywords,
    canonical: "/react-editor",
    ogType: "software",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": seoData.schemaGraph
    }
  });

  const { createProject, updateProject, getProject } = useLocalProjects();
  const { toast } = useToast();

  const [projectName, setProjectName] = useState("Untitled React App");
  const [files, setFiles] = useState<VirtualFiles>(DEFAULT_FILES);
  const [activeFile, setActiveFile] = useState("src/App.jsx");
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [showNewFile, setShowNewFile] = useState(false);
  const [fileFilter, setFileFilter] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const editorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (projectId) {
      const proj = getProject(projectId);
      if (proj && proj.type === "react") {
        setProjectName(proj.name);
        try {
          const parsed = JSON.parse(proj.js || "{}");
          if (typeof parsed === "object" && Object.keys(parsed).length > 0) {
            setFiles(parsed);
            setActiveFile(Object.keys(parsed)[0]);
          }
        } catch {
          setFiles({ "src/App.jsx": proj.js || "", "src/styles.css": proj.css || "" });
        }
      }
    }
  }, [projectId]);

  const debouncedFiles = useDebounce(files, 50);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const serialized = JSON.stringify(files);
      if (projectId) {
        updateProject(projectId, { name: projectName, js: serialized });
        toast({ title: "Project saved!" });
      } else {
        const newProj = createProject(projectName, "react", { js: serialized });
        toast({ title: "Project created!" });
        window.history.replaceState({}, "", `/react-editor?id=${newProj.id}`);
      }
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    } finally {
      setTimeout(() => setIsSaving(false), 400);
    }
  }, [files, projectName, projectId, createProject, updateProject, toast]);

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    try {
      await downloadProjectZip(files, projectName);
      toast({ title: "Project downloaded as ZIP!" });
    } catch (e) {
      toast({ title: "Download failed", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  }, [files, projectName, toast]);

  const handleClearCode = () => {
    if (confirm("Clear all files in current workspace?")) {
      setFiles({ "src/App.jsx": "export default function App() {\n  return <div>Clean Canvas</div>;\n}" });
      setActiveFile("src/App.jsx");
      toast({ title: "Workspace cleared" });
    }
  };

  const handleShare = () => {
    try {
      const payload = JSON.stringify({ name: projectName, type: "react", files });
      const shareId = btoa(payload);
      const url = `${window.location.origin}/p/${shareId}`;
      navigator.clipboard.writeText(url);
      toast({ title: "React project share link copied to clipboard!" });
    } catch (e) {
      toast({ title: "Could not generate share link", variant: "destructive" });
    }
  };

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      const firstFile = e.target.files[0];
      let extracted: Record<string, string> = {};
      if (firstFile.name.endsWith(".zip")) {
        extracted = await extractZipFiles(firstFile);
      } else {
        extracted = await readFolderFiles(e.target.files);
      }

      if (Object.keys(extracted).length > 0) {
        setFiles(extracted);
        setActiveFile(Object.keys(extracted)[0]);
        toast({ title: `Imported ${Object.keys(extracted).length} files into workspace!` });
      }
    } catch (err) {
      toast({ title: "Failed to read folder", variant: "destructive" });
    }
  };

  const handleSelectTemplate = (tmpl: ReactTemplate) => {
    setProjectName(tmpl.name);
    setFiles(tmpl.files);
    setActiveFile(Object.keys(tmpl.files)[0]);
    toast({ title: `Loaded React template: ${tmpl.name}` });
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
      toast({ title: "Code formatted!" });
    } else {
      toast({ title: "Code formatted!" });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    const path = newFileName.startsWith("src/") ? newFileName : `src/${newFileName}`;
    setFiles((prev) => ({ ...prev, [path]: "" }));
    setActiveFile(path);
    setNewFileName("");
    setShowNewFile(false);
  };

  const handleDeleteFile = (path: string) => {
    if (Object.keys(files).length <= 1) {
      toast({ title: "Cannot delete the last file", variant: "destructive" });
      return;
    }
    if (!confirm(`Delete ${path}?`)) return;
    setFiles((prev) => {
      const next = { ...prev };
      delete next[path];
      return next;
    });
    if (activeFile === path) {
      setActiveFile(Object.keys(files).find((f) => f !== path) || "");
    }
  };

  const fileTree = buildFileTree(files, fileFilter);

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background overflow-hidden font-sans text-foreground">
        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <AppNavbar
            title={projectName}
            mode="react"
            isSaving={isSaving}
            onSave={handleSave}
            onDownload={handleDownload}
            isDownloading={isDownloading}
            onFormat={handleFormat}
            onClearCode={handleClearCode}
            onShare={handleShare}
            onOpenTemplates={() => setShowTemplates(true)}
            onOpenShortcuts={() => setShowShortcuts(true)}
          />

          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            <main className="h-[calc(100vh-8rem)] flex-shrink-0">
              <PanelGroup direction="horizontal">
                {/* File Tree Panel */}
                <Panel defaultSize={15} minSize={10} className="flex flex-col bg-[#161b22] border-r border-white/5">
                  <div className="flex items-center justify-between px-2 py-2 border-b border-white/5">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold pl-1">Explorer</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1 rounded text-muted-foreground hover:text-cyan-400 hover:bg-white/10 transition-colors"
                        title="Upload Folder / ZIP"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFolderUpload}
                      />
                      <button
                        onClick={() => setShowNewFile(!showNewFile)}
                        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                        title="New file"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="px-2 py-1 border-b border-white/5 flex items-center gap-1.5 text-muted-foreground">
                    <Search className="w-3 h-3 shrink-0" />
                    <input
                      className="w-full text-[11px] bg-transparent border-0 text-foreground focus:outline-none placeholder:text-muted-foreground/40"
                      placeholder="Search files..."
                      value={fileFilter}
                      onChange={(e) => setFileFilter(e.target.value)}
                    />
                  </div>

                  {showNewFile && (
                    <div className="px-2 py-1.5 border-b border-white/5">
                      <input
                        autoFocus
                        className="w-full text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-foreground focus:outline-none focus:border-primary/50"
                        placeholder="components/MyComp.jsx"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddFile();
                          if (e.key === "Escape") setShowNewFile(false);
                        }}
                      />
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto py-1 text-xs">
                    <div className="px-2 py-0.5 text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">
                      {projectName}
                    </div>
                    {fileTree.map((node) => (
                      <FileTreeNode
                        key={node.path}
                        node={node}
                        activeFile={activeFile}
                        onSelect={setActiveFile}
                        onDelete={handleDeleteFile}
                      />
                    ))}
                  </div>
                </Panel>

                <PanelResizeHandle className="Resizer" />

                {/* Monaco Editor Panel */}
                <Panel defaultSize={35} minSize={15} className="flex flex-col bg-[#1e1e1e]">
                  <div className="flex items-center justify-between bg-[#252526] border-b border-white/5 px-3 py-2 min-h-[36px]">
                    {activeFile && (
                      <div className="flex items-center gap-2">
                        {getFileIcon(activeFile.split("/").pop() || "")}
                        <span className="text-xs text-foreground font-medium">{activeFile.split("/").pop()}</span>
                        <span className="text-[10px] text-muted-foreground/50">{activeFile}</span>
                      </div>
                    )}
                    <button
                      onClick={handleClearCode}
                      className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1 hover:bg-red-500/10 px-2 py-1 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" /> Clear Code
                    </button>
                  </div>
                  <div className="flex-1">
                    {activeFile && (
                      <Suspense fallback={<EditorSkeleton />}>
                        <Editor
                          height="100%"
                          language={getLanguage(activeFile)}
                          theme="vs-dark"
                          value={files[activeFile] || ""}
                          onChange={(v) => setFiles((prev) => ({ ...prev, [activeFile]: v || "" }))}
                          onMount={(editor) => { editorRef.current = editor; }}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            wordWrap: "on",
                            padding: { top: 12 },
                            lineNumbers: "on",
                            scrollBeyondLastLine: false,
                            smoothScrolling: true,
                            cursorSmoothCaretAnimation: "on",
                            bracketPairColorization: { enabled: true },
                            autoClosingBrackets: "always",
                            autoClosingQuotes: "always",
                            suggest: { preview: true },
                            tabSize: 2,
                          }}
                        />
                      </Suspense>
                    )}
                  </div>
                </Panel>

                <PanelResizeHandle className="Resizer" />

                {/* Preview + Console Panel */}
                <Panel defaultSize={50} minSize={20}>
                  <PanelGroup direction="vertical">
                    <Panel defaultSize={62} className="relative overflow-hidden">
                      <ReactFastPreview
                        files={debouncedFiles}
                        onLog={(log) => setLogs((prev) => [...prev.slice(-199), log])}
                      />
                    </Panel>

                    <PanelResizeHandle className="Resizer" />

                    <Panel defaultSize={38}>
                      <ConsolePanel logs={logs} onClear={() => setLogs([])} />
                    </Panel>
                  </PanelGroup>
                </Panel>
              </PanelGroup>
            </main>

            {/* Indexable Search Engine SEO & FAQ Section */}
            <CompilerSEOSection seoData={seoData} />
          </div>

          {/* Status Bar */}
          <div className="h-8 border-t border-border/40 bg-muted/30 flex items-center justify-between px-4 text-[11px] text-muted-foreground shrink-0 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>React System Online</span>
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
              <span>Project: CodePlayground</span>
            </div>
          </div>
        </div>
      </div>

      <TemplateDialog
        open={showTemplates}
        onOpenChange={setShowTemplates}
        mode="react"
        onSelectReactTemplate={handleSelectTemplate}
      />
      <ShortcutsDialog open={showShortcuts} onOpenChange={setShowShortcuts} />
    </SidebarProvider>
  );
}
