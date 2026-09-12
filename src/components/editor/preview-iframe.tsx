import { useEffect, useRef, useState, useCallback } from "react";
import type { LogMessage } from "./console-panel";
import { PreviewBar, type DeviceMode } from "./preview-bar";

interface PreviewIframeProps {
  html: string;
  css: string;
  js: string;
  mode: "web" | "react";
  onLog: (log: LogMessage) => void;
}

export function PreviewIframe({ html, css, js, mode, onLog }: PreviewIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [zoom, setZoom] = useState<number>(1);
  const [reloadKey, setReloadKey] = useState<number>(0);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.source === "iframe-console") {
        onLog({
          type: event.data.type as any,
          content: event.data.args.join(" "),
          timestamp: new Date(),
        });
      } else if (event.data?.source === "iframe-error") {
        onLog({
          type: "error",
          content: `${event.data.error} (Line ${event.data.line})`,
          timestamp: new Date(),
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onLog]);

  const getSrcDoc = useCallback(() => {
    const consoleInterceptor = `
      <script>
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalInfo = console.info;

        function post(type, args) {
           window.parent.postMessage({ source: 'iframe-console', type, args: Array.from(args).map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)) }, '*');
        }

        console.log = function(...args) { post('log', args); originalLog.apply(console, args); };
        console.error = function(...args) { post('error', args); originalError.apply(console, args); };
        console.warn = function(...args) {
          const msg = args.map(a => String(a)).join(' ');
          if (msg.includes('cdn.tailwindcss.com should not be used in production')) return;
          post('warn', args);
          originalWarn.apply(console, args);
        };
        console.info = function(...args) { post('info', args); originalInfo.apply(console, args); };

        window.onerror = function(msg, url, line, col, error) {
           window.parent.postMessage({ source: 'iframe-error', error: msg, line, col }, '*');
        };
      </script>
    `;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${consoleInterceptor}
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; background-color: transparent; }
          * { box-sizing: border-box; }
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          try {
            ${js}
          } catch(e) {
            console.error(e.message || String(e));
          }
        </script>
      </body>
      </html>
    `;
  }, [html, css, js]);

  const handleOpenNewTab = () => {
    const doc = getSrcDoc();
    const blob = new Blob([doc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const getContainerWidth = () => {
    if (deviceMode === "mobile") return "375px";
    if (deviceMode === "tablet") return "768px";
    return "100%";
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#121212] overflow-hidden">
      <PreviewBar
        deviceMode={deviceMode}
        onDeviceChange={setDeviceMode}
        onRefresh={() => setReloadKey((prev) => prev + 1)}
        onOpenNewTab={handleOpenNewTab}
        zoom={zoom}
        onZoomChange={setZoom}
      />

      <div className="flex-1 w-full bg-[#0d0d0d] flex items-center justify-center overflow-auto p-2">
        <div
          className="h-full bg-white shadow-2xl transition-all duration-300 relative overflow-hidden"
          style={{
            width: getContainerWidth(),
            maxWidth: "100%",
            transform: `scale(${zoom})`,
            transformOrigin: "center top",
            borderRadius: deviceMode !== "desktop" ? "1rem" : "0",
            border: deviceMode !== "desktop" ? "8px solid #262626" : "none",
          }}
        >
          <iframe
            key={reloadKey}
            ref={iframeRef}
            title="web-preview"
            sandbox="allow-scripts allow-same-origin"
            srcDoc={getSrcDoc()}
            className="w-full h-full border-none absolute inset-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
