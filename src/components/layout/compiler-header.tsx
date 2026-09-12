import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Code2, ArrowLeft, ChevronDown, Sparkles, Copy, Trash2, Home, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { COMPILERS_REGISTRY } from "@/lib/compilers-registry";

export const COMPILERS_LIST = COMPILERS_REGISTRY;

interface CompilerHeaderProps {
  title: string;
  badge?: string;
  badgeColor?: string;
  icon?: React.ReactNode;
  code?: string;
  onClear?: () => void;
  onRun?: () => void;
  isLive?: boolean;
}

export function CompilerHeader({
  title,
  badge = "Live Compiler",
  badgeColor = "bg-primary/10 text-primary border-primary/20",
  icon = <Code2 className="w-4 h-4 text-primary" />,
  code = "",
  onClear,
  onRun,
  isLive = true,
}: CompilerHeaderProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: "Source code copied to clipboard." });
  };

  return (
    <header className="h-14 border-b border-border/40 bg-card/70 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between shrink-0 z-20 sticky top-0">
      {/* Left Navigation & Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Back to Home Button */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4 sm:mr-1.5 text-primary" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </Button>

        <div className="h-4 w-px bg-border/50 hidden sm:block" />

        {/* Switch Compilers Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs font-semibold border-border/60 hover:border-primary/50 bg-background/50 hover:bg-muted/40 transition-colors flex items-center gap-1.5"
            >
              <span className="text-sm">⚡</span>
              <span className="truncate max-w-[110px] sm:max-w-[160px] font-bold text-foreground">
                {title}
              </span>
              <ChevronDown className="w-3 h-3 text-muted-foreground ml-0.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 max-h-96 overflow-auto p-1 font-sans">
            <DropdownMenuLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1.5">
              Switch Online Compiler (21 Available)
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

        {/* Live Status Badge */}
        <Badge variant="outline" className={`hidden md:inline-flex items-center gap-1.5 text-[10px] py-0.5 ${badgeColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-primary"}`} />
          {badge}
        </Badge>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-1.5">
        {onRun && (
          <Button
            size="sm"
            onClick={onRun}
            className="h-8 text-xs font-semibold px-3 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-600 border-0 shadow-md shadow-primary/20 text-white"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Run Code
          </Button>
        )}

        {code && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCode}
            className="h-8 text-xs px-2.5 border-border/50 hover:bg-muted/50 hidden sm:flex items-center gap-1 text-muted-foreground hover:text-foreground"
            title="Copy Code to Clipboard"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Copy</span>
          </Button>
        )}

        {onClear && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="h-8 px-2.5 text-xs text-red-400/90 border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 flex items-center gap-1.5 font-medium transition-colors"
            title="Clear all code in editor"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Clear Code</span>
          </Button>
        )}
      </div>
    </header>
  );
}
