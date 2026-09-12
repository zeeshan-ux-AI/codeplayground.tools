import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import type { LogMessage } from "./console-panel";
import { PreviewBar, type DeviceMode } from "./preview-bar";

export type VirtualFiles = Record<string, string>;

interface ReactFastPreviewProps {
  files: VirtualFiles;
  onLog: (log: LogMessage) => void;
}

function getBoilerplateDoc(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style id="__user_styles__"></style>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: transparent; }
    #__error_display__ {
      display: none;
      margin: 16px;
      padding: 16px;
      background: #ff000015;
      border: 1px solid #ff4444;
      border-radius: 8px;
      color: #ff4444;
      font-family: monospace;
      font-size: 13px;
      white-space: pre-wrap;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <div id="__error_display__"></div>

  <!-- Core Libraries -->
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Graphics & Chart Libraries -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>

  <script>
    (function() {
      function post(type, args) {
        var stringified = Array.from(args).map(function(a) {
          if (a === null) return 'null';
          if (a === undefined) return 'undefined';
          try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); }
          catch(e) { return String(a); }
        });
        window.parent.postMessage({ source: 'iframe-console', type: type, args: stringified }, '*');
      }
      var _log = console.log, _err = console.error, _warn = console.warn, _info = console.info;
      console.log   = function() { post('log',  arguments); _log.apply(console, arguments); };
      console.error = function() { post('error',arguments); _err.apply(console, arguments); };
      console.warn  = function() {
        var str = Array.from(arguments).map(String).join(' ');
        if (str.indexOf('cdn.tailwindcss.com should not be used in production') !== -1) return;
        post('warn', arguments);
        _warn.apply(console, arguments);
      };
      console.info  = function() { post('info', arguments); _info.apply(console,arguments); };
      window.onerror = function(msg, url, line, col, err) {
        post('error', [msg + (line ? ' (line ' + line + ')' : '')]);
        showError(msg + (line ? ' (line ' + line + ')' : ''));
      };
    })();

    function showError(msg) {
      var el = document.getElementById('__error_display__');
      if (el) {
        el.style.display = 'block';
        el.textContent = msg;
      }
    }
    function clearError() {
      var el = document.getElementById('__error_display__');
      if (el) {
        el.style.display = 'none';
        el.textContent = '';
      }
    }

    var _currentRoot = null;

    function updatePreview(files) {
      clearError();
      var cssFile = null;
      var jsFiles = {};
      Object.keys(files).forEach(function(k) {
        if (k.endsWith('.css')) cssFile = files[k];
        else jsFiles[k] = files[k];
      });

      document.getElementById('__user_styles__').textContent = cssFile || '';

      if (_currentRoot) {
        try { _currentRoot.unmount(); } catch(e) {}
        _currentRoot = null;
      }
      document.getElementById('root').innerHTML = '';

      window.__modules = {};
      var hasErrors = false;

      Object.keys(jsFiles).forEach(function(filePath) {
        var code = jsFiles[filePath];
        try {
          var transformed = Babel.transform(code, {
            presets: [
              ['env', { modules: 'commonjs' }],
              ['react', { runtime: 'classic' }],
              'typescript'
            ],
            filename: filePath
          }).code;

          window.__modules[filePath] = new Function("module", "exports", "require", transformed);
        } catch(e) {
          hasErrors = true;
          console.error("SyntaxError in " + filePath + ": " + (e.message || String(e)));
          showError("SyntaxError in " + filePath + ": " + (e.message || String(e)));
        }
      });

      if (hasErrors) return;

      function resolvePath(importPath, currentPath) {
        if (!importPath.startsWith(".")) return importPath;
        var currentDir = currentPath.split("/").slice(0, -1).join("/");
        var parts = (currentDir ? currentDir + "/" + importPath : importPath).split("/");
        var resolved = [];
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          if (part === "..") resolved.pop();
          else if (part !== "." && part !== "") resolved.push(part);
        }
        var resPath = resolved.join("/");
        var exts = ["", ".jsx", ".js", ".tsx", ".ts"];
        for (var i = 0; i < exts.length; i++) {
          var p = resPath + exts[i];
          if (window.__modules[p]) return p;
        }
        for (var i = 0; i < exts.length; i++) {
          var p = resPath + "/index" + exts[i];
          if (window.__modules[p]) return p;
        }
        return resPath;
      }

      var __cache = {};
      function require(id, currentPath) {
        var resolvedId = currentPath ? resolvePath(id, currentPath) : id;
        if (resolvedId === "react" || resolvedId === "react/jsx-runtime") return window.React;
        if (resolvedId === "react-dom" || resolvedId === "react-dom/client") return window.ReactDOM;
        if (resolvedId === "chart.js") return window.Chart;
        if (resolvedId === "three") return window.THREE;
        if (resolvedId === "p5") return window.p5;
        if (__cache[resolvedId]) return __cache[resolvedId].exports;
        if (!window.__modules[resolvedId]) {
          if (resolvedId.endsWith(".css")) return {};
          return window.React;
        }
        var module = { exports: {} };
        __cache[resolvedId] = module;
        window.__modules[resolvedId](module, module.exports, function(reqId) {
          return require(reqId, resolvedId);
        });
        return module.exports;
      }

      try {
        var entry = null;
        var candidates = ["src/index.jsx", "src/index.js", "src/index.tsx", "src/index.ts", "src/App.jsx", "src/App.tsx", "src/App.js"];
        for (var i = 0; i < candidates.length; i++) {
          if (window.__modules[candidates[i]]) { entry = candidates[i]; break; }
        }
        if (!entry) {
          var keys = Object.keys(window.__modules);
          for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            if (k.endsWith(".tsx") || k.endsWith(".ts") || k.endsWith(".jsx") || k.endsWith(".js")) { entry = k; break; }
          }
        }

        if (entry) {
          var exports = require(entry);
          if (document.getElementById("root").children.length === 0 && exports && (exports.default || typeof exports === "function")) {
            var Comp = exports.default || exports;
            _currentRoot = ReactDOM.createRoot(document.getElementById("root"));
            _currentRoot.render(React.createElement(Comp));
          }
        }
      } catch(e) {
        console.error("RuntimeError: " + (e.message || String(e)));
        showError("RuntimeError: " + (e.message || String(e)));
      }
    }

    window.addEventListener('message', function(evt) {
      if (!evt.data) return;
      if (evt.data.type === 'UPDATE') {
        updatePreview(evt.data.files);
      }
    });

    window.parent.postMessage({ source: 'iframe-ready' }, '*');
  </script>
</body>
</html>`;
}

export function ReactFastPreview({ files, onLog }: ReactFastPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isReadyRef = useRef(false);
  const pendingUpdateRef = useRef<VirtualFiles | null>(null);

  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [zoom, setZoom] = useState<number>(1);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const boilerplate = useMemo(() => getBoilerplateDoc(), []);

  const sendUpdate = useCallback((filesToSend: VirtualFiles) => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage({ type: "UPDATE", files: filesToSend }, "*");
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      if (event.data.source === "iframe-ready") {
        isReadyRef.current = true;
        if (pendingUpdateRef.current) {
          sendUpdate(pendingUpdateRef.current);
          pendingUpdateRef.current = null;
        }
      } else if (event.data.source === "iframe-console") {
        onLog({
          type: event.data.type as any,
          content: event.data.args.join(" "),
          timestamp: new Date(),
        });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onLog, sendUpdate]);

  useEffect(() => {
    if (isReadyRef.current) {
      sendUpdate(files);
    } else {
      pendingUpdateRef.current = files;
    }
  }, [files, sendUpdate]);

  const handleOpenNewTab = () => {
    const blob = new Blob([boilerplate], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const getContainerWidth = () => {
    if (deviceMode === "mobile") return "375px";
    if (deviceMode === "tablet") return "768px";
    return "100%";
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#121212] overflow-hidden relative">
      <PreviewBar
        deviceMode={deviceMode}
        onDeviceChange={setDeviceMode}
        onRefresh={() => {
          setReloadKey((prev) => prev + 1);
          isReadyRef.current = false;
        }}
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
            title="react-preview"
            sandbox="allow-scripts allow-same-origin"
            srcDoc={boilerplate}
            className="w-full h-full border-none absolute inset-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
