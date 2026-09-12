import { Loader2 } from "lucide-react";

export function EditorSkeleton() {
  return (
    <div className="h-full w-full bg-[#1e1e1e] flex flex-col animate-pulse">
      <div className="flex items-center gap-4 px-8 py-3 bg-[#252526] border-b border-white/5">
        <div className="w-24 h-2 bg-white/10 rounded" />
        <div className="w-16 h-2 bg-white/10 rounded" />
      </div>
      <div className="flex-1 p-6 space-y-4">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="h-3 bg-white/5 rounded" 
            style={{ width: `${Math.random() * 40 + 40}%`, marginLeft: `${Math.random() > 0.8 ? 20 : 0}px` }} 
          />
        ))}
      </div>
    </div>
  );
}
