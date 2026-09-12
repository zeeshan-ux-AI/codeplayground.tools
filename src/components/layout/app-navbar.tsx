import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Save, Settings2, Moon, Sun, Download, Loader2, Code2, Atom, RotateCcw, LayoutTemplate, Keyboard, Share2, Trash2, ArrowLeft, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COMPILERS_LIST } from "./compiler-header";

interface AppNavbarProps {
  title: string;
  isSaving?: boolean;
  onSave?: () => void;
  onFormat?: () => void;
  onDownload?: () => void;
  isDownloading?: boolean;
  onReset?: () => void;
  onClearCode?: () => void;
  onShare?: () => void;
  onOpenTemplates?: () => void;
  onOpenShortcuts?: () => void;
  mode?: "web" | "react";
}

export function AppNavbar({
  title,
  isSaving,
  onSave,
  onFormat,
  onDownload,
  isDownloading,
  onReset,
  onClearCode,
  onShare,
  onOpenTemplates,
  onOpenShortcuts,
  mode = "web",
}: AppNavbarProps) {
  const [isDark, setIsDark] = useState(true);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <header className="flex h-12 items-center justify-between px-3 border-b border-border/50 bg-card/90 backdrop-blur-md sticky top-0 z-10 font-sans">
      <div className="flex items-center gap-2 sm:gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground h-7 w-7" />
        <div className="h-4 w-px bg-border/50" />
        
        {/* Back to Home Button */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground font-medium"
        >
          <Link href="/">
            <ArrowLeft className="w-3.5 h-3.5 sm:mr-1 text-primary" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </Button>

        <div className="h-4 w-px bg-border/50 hidden sm:block" />

        {/* Switch Compiler Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs font-semibold border-border/60 hover:border-primary/50 bg-background/50 flex items-center gap-1.5"
            >
              {mode === "react" ? (
                <Atom className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span className="font-bold truncate max-w-[110px] sm:max-w-[160px]">{title}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground ml-0.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 max-h-96 overflow-auto p-1 font-sans z-50">
            <DropdownMenuLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1.5">
              Switch Compiler (21 Available)
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {COMPILERS_LIST.map((c) => (
              <DropdownMenuItem
                key={c.href}
                onClick={() => setLocation(c.href)}
                className={`flex items-center justify-between text-xs py-2 px-2.5 rounded-lg cursor-pointer ${
                  location === c.href ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted/60"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base">{c.icon}</span>
                  <span className="truncate">{c.name}</span>
                </div>
                {location === c.href && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mode badge */}
        <span className={`hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wider border ${
          mode === "react"
            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
        }`}>
          {mode === "react" ? "REACT" : "LIVE IDE"}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {onOpenTemplates && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenTemplates}
            className="text-xs h-7 px-2.5 text-primary border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10 flex gap-1.5 transition-colors font-medium"
            title="Browse starter templates"
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Templates</span>
          </Button>
        )}

        {onShare && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="text-xs h-7 px-2.5 text-cyan-400 hover:bg-cyan-500/10 hidden sm:flex gap-1.5 font-medium"
            title="Generate share link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Share</span>
          </Button>
        )}

        {onClearCode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCode}
            className="text-xs h-7 px-2 text-muted-foreground hover:text-red-400 hidden lg:flex gap-1"
            title="Clear active workspace code"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </Button>
        )}

        {onReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs h-7 px-2.5 text-muted-foreground hover:text-red-400 hidden md:flex gap-1.5 transition-colors"
            title="Reset to default template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset</span>
          </Button>
        )}

        {onFormat && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onFormat}
            className="text-xs h-7 px-2.5 text-muted-foreground hover:text-foreground hidden md:flex gap-1.5"
            title="Format code (Shift+Alt+F)"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Format</span>
          </Button>
        )}

        {onOpenShortcuts && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenShortcuts}
            className="h-7 w-7 text-muted-foreground hover:text-foreground hidden sm:flex"
            title="Keyboard shortcuts"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </Button>
        )}

        {onDownload && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownload}
            disabled={isDownloading}
            className="text-xs h-7 px-2.5 text-muted-foreground hover:text-emerald-400 hidden sm:flex gap-1.5 transition-colors"
            title="Download project as ZIP"
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span className="hidden md:inline">Download ZIP</span>
          </Button>
        )}

        {onSave && (
          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="text-xs h-7 px-3 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all active:scale-95 gap-1.5"
          >
            {isSaving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            {isSaving ? "Saving…" : "Save"}
          </Button>
        )}

        <div className="h-4 w-px bg-border/50 mx-0.5" />

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={() => setIsDark(!isDark)}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </Button>
      </div>
    </header>
  );
}
