import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Command, ArrowRight, Sparkles } from "lucide-react";
import { COMPILERS_REGISTRY, CompilerItem } from "@/lib/compilers-registry";

interface CommandSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandSearch({ open, onOpenChange }: CommandSearchProps) {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  const filtered = COMPILERS_REGISTRY.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.keywords.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    setLocation(href);
    onOpenChange(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 border-border/50 bg-[#121215]/95 backdrop-blur-xl shadow-2xl font-sans overflow-hidden">
        {/* Input Bar */}
        <div className="flex items-center px-4 border-b border-border/40 bg-card/40">
          <Search className="w-4 h-4 text-primary mr-3 shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 100+ online compilers & tools... (e.g. python, react, regex, sql, tailwind, docker)"
            className="h-12 border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-foreground"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border/60 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-xs">
              No compilers found matching "{query}".
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.href)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all text-left group"
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="truncate">
                    <div className="font-bold text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                      {item.title}
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-primary/30 text-primary">
                        {item.badge}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{item.desc}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0" />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border/30 bg-card/20 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1 text-primary font-medium">
            <Sparkles className="w-3 h-3" /> 100+ Compilers Suite Available
          </div>
          <div>Use Arrow keys & Enter to open</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
