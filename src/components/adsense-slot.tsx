import { useEffect } from "react";

interface AdSenseSlotProps {
  client?: string;
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
  label?: string;
}

export function AdSenseSlot({
  client = "ca-pub-XXXXXXXXXXXXXXXX",
  slot,
  format = "auto",
  responsive = true,
  className = "",
  label = "Google AdSense Advertisement",
}: AdSenseSlotProps) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {
      console.log("AdSense initialization:", e);
    }
  }, []);

  return (
    <div className={`adsense-wrapper relative overflow-hidden flex flex-col items-center justify-center border border-dashed border-border/40 rounded-xl bg-card/30 p-2 text-center select-none ${className}`}>
      <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-bold mb-1">
        {label}
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
