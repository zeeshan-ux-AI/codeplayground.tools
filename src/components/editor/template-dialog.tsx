import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { WEB_TEMPLATES, REACT_TEMPLATES, type WebTemplate, type ReactTemplate } from "@/lib/templates";
import { Code2, Atom, Sparkles, Layout, CheckSquare, Gamepad2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "web" | "react";
  onSelectWebTemplate?: (template: WebTemplate) => void;
  onSelectReactTemplate?: (template: ReactTemplate) => void;
}

function getIcon(name: string) {
  switch (name) {
    case "Sparkles": return <Sparkles className="w-5 h-5 text-amber-400" />;
    case "Layout": return <Layout className="w-5 h-5 text-blue-400" />;
    case "CheckSquare": return <CheckSquare className="w-5 h-5 text-emerald-400" />;
    case "Gamepad2": return <Gamepad2 className="w-5 h-5 text-purple-400" />;
    default: return <Layers className="w-5 h-5 text-cyan-400" />;
  }
}

export function TemplateDialog({
  open,
  onOpenChange,
  mode,
  onSelectWebTemplate,
  onSelectReactTemplate,
}: TemplateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-xl border-border/60">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            {mode === "react" ? <Atom className="w-5 h-5 text-cyan-400" /> : <Code2 className="w-5 h-5 text-blue-400" />}
            Choose Starter Template
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Select a pre-built template to start editing immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 py-2">
          {mode === "web"
            ? WEB_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => {
                    onSelectWebTemplate?.(tmpl);
                    onOpenChange(false);
                  }}
                  className="group flex items-start gap-3.5 p-3.5 rounded-xl bg-muted/40 border border-border/50 hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all"
                >
                  <div className="p-2.5 rounded-lg bg-background border border-border/60 shrink-0 group-hover:scale-105 transition-transform">
                    {getIcon(tmpl.iconName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {tmpl.name}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {tmpl.description}
                    </p>
                  </div>
                </div>
              ))
            : REACT_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => {
                    onSelectReactTemplate?.(tmpl);
                    onOpenChange(false);
                  }}
                  className="group flex items-start gap-3.5 p-3.5 rounded-xl bg-muted/40 border border-border/50 hover:border-cyan-500/40 hover:bg-cyan-500/5 cursor-pointer transition-all"
                >
                  <div className="p-2.5 rounded-lg bg-background border border-border/60 shrink-0 group-hover:scale-105 transition-transform">
                    {getIcon(tmpl.iconName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground group-hover:text-cyan-400 transition-colors">
                      {tmpl.name}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {tmpl.description}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
