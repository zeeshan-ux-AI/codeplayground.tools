import { Link, useLocation } from "wouter";
import { Code2, LayoutTemplate, FileJson, Plus, Trash2, Folder, Terminal, FileCode2, Sparkles, Database, FileText, Search } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useLocalProjects } from "@/hooks/use-local-projects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdSenseSlot } from "@/components/adsense-slot";
import { COMPILERS_REGISTRY } from "@/lib/compilers-registry";
import { useState } from "react";
import { CommandSearch } from "./command-search";

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const { projects, deleteProject } = useLocalProjects();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleCreateNew = (type: "html-css-js" | "react") => {
    setLocation(type === "react" ? "/react-editor" : "/editor");
  };

  return (
    <>
      <Sidebar variant="inset" className="border-r border-border bg-sidebar font-sans">
        <SidebarHeader className="border-b border-border/50 pb-4 mb-2 px-4 pt-4">
          <Link href="/" className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              CodePlayground
            </span>
          </Link>

          {/* Quick Search Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchOpen(true)}
            className="w-full h-8 text-xs text-muted-foreground border-border/50 justify-between mb-2 font-medium bg-background/50 hover:bg-background"
          >
            <span className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-primary" /> Search 100+ Tools...
            </span>
            <kbd className="text-[10px] bg-muted px-1.5 rounded border border-border/40 font-mono">⌘K</kbd>
          </Button>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              className="w-full flex-1 h-8 text-xs font-semibold shadow-md shadow-primary/10"
              onClick={() => handleCreateNew("html-css-js")}
            >
              <Plus className="w-3 h-3 mr-1" /> Web
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-full flex-1 h-8 text-xs font-semibold"
              onClick={() => handleCreateNew("react")}
            >
              <Plus className="w-3 h-3 mr-1" /> React
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>100+ Compilers Suite</span>
              <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-primary/30 text-primary">100 Active</Badge>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {COMPILERS_REGISTRY.map((c) => (
                  <SidebarMenuItem key={c.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={location === c.href}
                      tooltip={c.title}
                    >
                      <Link href={c.href} className="font-medium text-xs py-1.5 flex items-center gap-2">
                        <span className="text-base leading-none">{c.icon}</span>
                        <span className="truncate">{c.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Folder className="w-3.5 h-3.5" /> Saved Projects
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-xs text-muted-foreground">No saved projects yet.</p>
                  </div>
                ) : (
                  projects.map((project) => (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton
                        asChild
                        className="group flex items-center justify-between"
                      >
                        <div className="flex items-center w-full">
                          <Link
                            href={project.type === "react" ? `/react-editor?id=${project.id}` : `/editor?id=${project.id}`}
                            className="flex items-center gap-2 flex-1 truncate"
                          >
                            <span className="truncate text-sm font-medium">{project.name}</span>
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-muted-foreground/30 ml-auto">
                              {project.type === "react" ? "React" : "Web"}
                            </Badge>
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (confirm(`Delete project "${project.name}"?`)) {
                                deleteProject(project.id);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3">
          <AdSenseSlot label="Google AdSense Sidebar" className="w-full h-[200px]" />
        </SidebarFooter>
      </Sidebar>

      <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
