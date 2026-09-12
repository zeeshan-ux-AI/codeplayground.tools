import { AlertCircle, Info, Terminal, XCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export type LogMessage = {
  type: "log" | "error" | "warn" | "info" | "system";
  content: string;
  timestamp: Date;
};

interface ConsolePanelProps {
  logs: LogMessage[];
  onClear: () => void;
}

export function ConsolePanel({ logs, onClear }: ConsolePanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getIcon = (type: LogMessage["type"]) => {
    switch (type) {
      case "error": return <XCircle className="w-3.5 h-3.5 text-destructive" />;
      case "warn": return <AlertCircle className="w-3.5 h-3.5 text-yellow-500" />;
      case "info": return <Info className="w-3.5 h-3.5 text-blue-400" />;
      case "system": return <Terminal className="w-3.5 h-3.5 text-muted-foreground" />;
      default: return null;
    }
  };

  const getColorClass = (type: LogMessage["type"]) => {
    switch (type) {
      case "error": return "text-destructive bg-destructive/5 border-l-destructive";
      case "warn": return "text-yellow-500 bg-yellow-500/5 border-l-yellow-500";
      case "info": return "text-blue-400 bg-blue-400/5 border-l-blue-400";
      case "system": return "text-muted-foreground italic";
      default: return "text-foreground border-l-transparent";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-t border-border">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/50 bg-[#252526]">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5" /> Console
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-6 text-[10px] px-2 text-muted-foreground hover:text-foreground"
        >
          Clear
        </Button>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-auto p-2 font-mono text-xs whitespace-pre-wrap"
      >
        {logs.length === 0 ? (
          <div className="text-muted-foreground/50 h-full flex items-center justify-center italic">
            Console output will appear here...
          </div>
        ) : (
          logs.map((log, i) => (
            <div 
              key={i} 
              className={`py-1 px-2 mb-0.5 flex gap-2 border-l-2 ${getColorClass(log.type)}`}
            >
              <span className="opacity-40 text-[10px] select-none mt-0.5 min-w-[50px]">
                {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="mt-0.5">{getIcon(log.type)}</span>
              <span className="break-all font-mono leading-relaxed">{log.content}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
