import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Command, Keyboard } from "lucide-react";

interface ShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SHORTCUTS = [
  { key: "Ctrl + S / Cmd + S", description: "Save current project to local storage" },
  { key: "Ctrl + F / Cmd + F", description: "Find and replace text in active file" },
  { key: "Shift + Alt + F", description: "Format code using editor auto-formatter" },
  { key: "Ctrl + Space", description: "Trigger autocomplete suggestions" },
  { key: "Ctrl + /", description: "Toggle line comment" },
  { key: "Alt + Up / Down", description: "Move active line up or down" },
  { key: "Ctrl + Shift + K", description: "Delete current line" },
];

export function ShortcutsDialog({ open, onOpenChange }: ShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/60">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Keyboard className="w-5 h-5 text-primary" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Boost your productivity in CodePlayground with these keyboard shortcuts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          {SHORTCUTS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/40 text-xs"
            >
              <span className="text-muted-foreground font-medium">{item.description}</span>
              <kbd className="px-2 py-1 rounded bg-background border border-border text-[11px] font-mono font-semibold text-primary shadow-xs">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
