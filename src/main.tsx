import { createRoot } from "react-dom/client";
import { loader } from "@monaco-editor/react";
import App from "./App";
import "./index.css";

// Pre-load Monaco to make editor "instant-on"
loader.init().then(() => {
  console.log("Monaco pre-loaded");
});

createRoot(document.getElementById("root")!).render(<App />);
