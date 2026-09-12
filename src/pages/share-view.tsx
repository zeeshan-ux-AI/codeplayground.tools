import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Code2, ArrowLeft, Download, ExternalLink, Sparkles } from "lucide-react";
import { PreviewIframe } from "@/components/editor/preview-iframe";
import { ReactFastPreview } from "@/components/editor/react-fast-preview";
import { useLocalProjects } from "@/hooks/use-local-projects";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import { AdSenseSlot } from "@/components/adsense-slot";

export default function ShareView() {
  const [, params] = useRoute("/p/:shareId");
  const { toast } = useToast();
  const { createProject } = useLocalProjects();

  const [projectData, setProjectData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: projectData ? `${projectData.name} - CodePlayground` : "Shared Project - CodePlayground",
    description: "View and edit shared code projects on CodePlayground online IDE.",
  });

  useEffect(() => {
    if (params?.shareId) {
      try {
        // Decode project from base64 hash or fetch API
        const decoded = atob(params.shareId);
        const parsed = JSON.parse(decoded);
        setProjectData(parsed);
      } catch (e) {
        // Fallback default shared sample
        setProjectData({
          name: "Shared Web Project",
          type: "html-css-js",
          html: `<div class="p-8 text-center"><h1 class="text-3xl font-bold text-cyan-400">Shared Project View</h1><p className="mt-2 text-slate-400">Created with CodePlayground</p></div>`,
          css: "body { background: #0f172a; color: white; }",
          js: "console.log('Shared project loaded!');",
        });
      } finally {
        setLoading(false);
      }
    }
  }, [params?.shareId]);

  const handleForkProject = () => {
    if (!projectData) return;
    if (projectData.type === "react") {
      const files = typeof projectData.files === "string" ? JSON.parse(projectData.files) : projectData.files;
      const proj = createProject(`${projectData.name} (Fork)`, "react", { js: JSON.stringify(files) });
      toast({ title: "Project cloned to your workspace!" });
      window.location.href = `/react-editor?id=${proj.id}`;
    } else {
      const proj = createProject(`${projectData.name} (Fork)`, "html-css-js", {
        html: projectData.html,
        css: projectData.css,
        js: projectData.js,
      });
      toast({ title: "Project cloned to your workspace!" });
      window.location.href = `/editor?id=${proj.id}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-sm">
        Loading shared project...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="h-14 border-b border-border/50 bg-card/90 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-1" /> Home
            </Link>
          </Button>
          <div className="h-4 w-px bg-border/40" />
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <span className="font-bold text-base">{projectData?.name || "Shared Project"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleForkProject} className="bg-primary hover:bg-primary/90 font-semibold shadow-md shadow-primary/20">
            <Sparkles className="w-4 h-4 mr-1" /> Fork & Edit
          </Button>
        </div>
      </header>

      {/* Top Banner */}
      <div className="p-2 border-b border-border/30 bg-muted/20 flex justify-center">
        <AdSenseSlot label="Google AdSense Banner" className="w-[728px] max-w-full h-[80px]" />
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 w-full relative bg-slate-950">
        {projectData?.type === "react" ? (
          <ReactFastPreview
            files={typeof projectData.files === "string" ? JSON.parse(projectData.files) : projectData.files || {}}
            onLog={() => {}}
          />
        ) : (
          <PreviewIframe
            mode="web"
            html={projectData?.html || ""}
            css={projectData?.css || ""}
            js={projectData?.js || ""}
            onLog={() => {}}
          />
        )}
      </div>
    </div>
  );
}
