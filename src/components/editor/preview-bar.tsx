import { Monitor, Tablet, Smartphone, ExternalLink, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export type DeviceMode = "desktop" | "tablet" | "mobile";

interface PreviewBarProps {
  deviceMode: DeviceMode;
  onDeviceChange: (mode: DeviceMode) => void;
  onRefresh: () => void;
  onOpenNewTab: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function PreviewBar({
  deviceMode,
  onDeviceChange,
  onRefresh,
  onOpenNewTab,
  zoom,
  onZoomChange,
}: PreviewBarProps) {
  return (
    <div className="h-9 bg-[#1e1e1e] border-b border-white/5 flex items-center justify-between px-3 text-xs shrink-0 select-none">
      <div className="flex items-center gap-1">
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mr-2 hidden sm:inline">
          Preview
        </span>

        {/* Device Modes */}
        <div className="flex items-center bg-black/40 p-0.5 rounded-lg border border-white/5">
          <button
            onClick={() => onDeviceChange("desktop")}
            className={`p-1.5 rounded-md transition-colors ${
              deviceMode === "desktop"
                ? "bg-primary/20 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Desktop view (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeviceChange("tablet")}
            className={`p-1.5 rounded-md transition-colors ${
              deviceMode === "tablet"
                ? "bg-primary/20 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Tablet view (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeviceChange("mobile")}
            className={`p-1.5 rounded-md transition-colors ${
              deviceMode === "mobile"
                ? "bg-primary/20 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Mobile view (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="text-[10px] text-muted-foreground ml-1.5 font-mono hidden md:inline">
          {deviceMode === "desktop" ? "100%" : deviceMode === "tablet" ? "768px" : "375px"}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Zoom Controls */}
        <div className="hidden sm:flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded-lg border border-white/5 text-[11px] text-muted-foreground">
          <button
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
            className="hover:text-foreground p-0.5"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="w-8 text-center font-mono">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => onZoomChange(Math.min(1.5, zoom + 0.1))}
            className="hover:text-foreground p-0.5"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>

        {/* Refresh */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={onRefresh}
          title="Reload preview"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>

        {/* Open in New Tab */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={onOpenNewTab}
          title="Open preview in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
