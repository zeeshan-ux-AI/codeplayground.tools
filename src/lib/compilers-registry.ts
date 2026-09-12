export interface CompilerItem {
  id: string;
  title: string;
  name: string;
  href: string;
  category:
    | "Web Frameworks"
    | "Languages & WASM"
    | "Data & Parsers"
    | "CSS & Styling"
    | "APIs & Backend"
    | "Graphics & Canvas"
    | "DevOps & Config"
    | "Security & Crypto";
  icon: string;
  badge: string;
  desc: string;
  keywords: string;
  language: string;
  defaultCode: string;
}

export const COMPILERS_REGISTRY: CompilerItem[] = [
  // 🌐 Hub 1: Web Frameworks & UI Engines (15 Tools)
  {
    id: "web-editor",
    title: "HTML / CSS / JS Web Editor",
    name: "Web IDE (3 Tabs)",
    href: "/web-editor",
    category: "Web Frameworks",
    icon: "🌐",
    badge: "3-Tabs IDE",
    desc: "Multi-tab HTML, CSS, and JS live web IDE with index.html, styles.css & script.js",
    keywords: "online html editor, live css playground, javascript editor, web ide",
    language: "html",
    defaultCode: `<!DOCTYPE html><html><body><h1>🌐 Multi-tab Web Editor</h1></body></html>`
  },
  {
    id: "html-only-editor",
    title: "HTML5 Standalone Studio",
    name: "HTML5 Studio",
    href: "/html-only-editor",
    category: "Web Frameworks",
    icon: "🟧",
    badge: "HTML5",
    desc: "Pure HTML5 markup editor with real-time DOM rendering & tag autocomplete",
    keywords: "online html editor, html5 playground, pure html live preview, html markup editor",
    language: "html",
    defaultCode: `<!DOCTYPE html><html><body><h1>🟧 Pure HTML5 Studio</h1></body></html>`
  },
  {
    id: "react-editor",
    title: "React JSX Multi-file IDE",
    name: "React IDE",
    href: "/react-editor",
    category: "Web Frameworks",
    icon: "⚛️",
    badge: "Pro IDE",
    desc: "Multi-file React component IDE with folder upload, hooks & ZIP export",
    keywords: "online react editor, react jsx playground, react developer tools",
    language: "javascript",
    defaultCode: `import React, { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ padding: "32px", fontFamily: "system-ui", textAlign: "center", color: "#fff", background: "#0f172a", minHeight: "100vh" }}>
      <h1 style={{ color: "#38bdf8" }}>⚛️ React Live IDE</h1>
      <p>Count: <strong>{count}</strong></p>
      <button onClick={() => setCount(c => c + 1)} style={{ padding: "12px 24px", borderRadius: "12px", border: "none", background: "#0284c7", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
        Increment Counter
      </button>
    </div>
  );
}`
  },
  {
    id: "vue-editor",
    title: "Vue 3 SFC Playground",
    name: "Vue 3 SFC",
    href: "/vue-editor",
    category: "Web Frameworks",
    icon: "🟢",
    badge: "SFC",
    desc: "Vue 3 Single File Component (SFC) compiler & live template renderer",
    keywords: "vue 3 sfc online editor, vue playground, live vue 3 compiler",
    language: "html",
    defaultCode: `<template>
  <div class="vue-container">
    <h1>🟢 Vue 3 SFC Playground</h1>
    <button @click="count++">Clicked {{ count }} times</button>
  </div>
</template>

<script>
export default {
  data() { return { count: 0 } }
}
</script>`
  },
  {
    id: "svelte-editor",
    title: "Svelte 4 Reactive Compiler",
    name: "Svelte 4",
    href: "/svelte-editor",
    category: "Web Frameworks",
    icon: "🔥",
    badge: "Fast",
    desc: "Svelte 4 reactive component sandbox & standalone live preview",
    keywords: "svelte online compiler, svelte 4 playground, svelte reactive component",
    language: "html",
    defaultCode: `<script>
  let count = 0;
</script>
<button on:click={() => count++}>Count: {count}</button>`
  },
  {
    id: "angular-editor",
    title: "Angular Component Sandbox",
    name: "Angular",
    href: "/angular-editor",
    category: "Web Frameworks",
    icon: "🅰️",
    badge: "TS Framework",
    desc: "Angular TypeScript component compiler and template reactive preview",
    keywords: "online angular editor, angular playground, typescript component runner",
    language: "typescript",
    defaultCode: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<h2>🅰️ Angular Component Studio</h2>'
})
export class AppComponent {}`
  },
  {
    id: "solid-editor",
    title: "SolidJS Reactive Compiler",
    name: "SolidJS",
    href: "/solid-editor",
    category: "Web Frameworks",
    icon: "🔷",
    badge: "Fine-Grained",
    desc: "SolidJS fine-grained reactivity JSX playground & live DOM compiler",
    keywords: "solidjs online playground, solidjs jsx editor, reactive signals runner",
    language: "javascript",
    defaultCode: `import { createSignal } from "solid-js";
function App() {
  const [count, setCount] = createSignal(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count()}</button>;
}`
  },
  {
    id: "preact-editor",
    title: "Preact Lightweight IDE",
    name: "Preact",
    href: "/preact-editor",
    category: "Web Frameworks",
    icon: "⚛️",
    badge: "3kB React",
    desc: "3kB lightweight Preact JSX compiler with instant Virtual DOM output",
    keywords: "preact online editor, preact playground, lightweight react alternative",
    language: "javascript",
    defaultCode: `import { h } from 'preact';
export function App() { return <h1>⚛️ Preact Live!</h1>; }`
  },
  {
    id: "alpine-editor",
    title: "Alpine.js Interactive Sandbox",
    name: "Alpine.js",
    href: "/alpine-editor",
    category: "Web Frameworks",
    icon: "🏔️",
    badge: "Micro UI",
    desc: "Alpine.js declarative micro-framework playground with live x-data directives",
    keywords: "alpine.js online editor, alpinejs sandbox, live alpine directives tester",
    language: "html",
    defaultCode: `<div x-data="{ open: false }">
  <button @click="open = !open">Toggle Alpine Box</button>
  <div x-show="open">Alpine Directive Active</div>
</div>`
  },
  {
    id: "htmx-editor",
    title: "HTMX Live Playground",
    name: "HTMX",
    href: "/htmx-editor",
    category: "Web Frameworks",
    icon: "⚡",
    badge: "HTML-Driven",
    desc: "HTMX AJAX attribute live simulator with hx-get, hx-post, and swap targets",
    keywords: "htmx online playground, htmx live tester, hx-get attribute simulator",
    language: "html",
    defaultCode: `<button hx-get="/api/demo" hx-target="#output">Trigger HTMX</button>
<div id="output">Output ready...</div>`
  },
  {
    id: "webcomponents-editor",
    title: "Web Components Studio",
    name: "Web Components",
    href: "/webcomponents-editor",
    category: "Web Frameworks",
    icon: "🧩",
    badge: "Custom Element",
    desc: "Native Custom Elements, Shadow DOM, and HTML Template live studio",
    keywords: "web components online editor, custom elements playground",
    language: "javascript",
    defaultCode: `class CustomCard extends HTMLElement {
  connectedCallback() { this.innerHTML = '<h3>🧩 Custom Element Active</h3>'; }
}
customElements.define('custom-card', CustomCard);`
  },
  {
    id: "qwik-editor",
    title: "Qwik Framework Sandbox",
    name: "Qwik",
    href: "/qwik-editor",
    category: "Web Frameworks",
    icon: "⚡",
    badge: "Resumable",
    desc: "Qwik framework resumable JSX component playground & signal compiler",
    keywords: "qwik online playground, qwik js editor, resumable framework",
    language: "typescript",
    defaultCode: `import { component$, useSignal } from '@builder.io/qwik';
export default component$(() => {
  const count = useSignal(0);
  return <button onClick$={() => count.value++}>Count: {count.value}</button>;
});`
  },
  {
    id: "lit-editor",
    title: "Lit Element Web Component Studio",
    name: "Lit",
    href: "/lit-editor",
    category: "Web Frameworks",
    icon: "🔥",
    badge: "Lit 3",
    desc: "Lit 3 lightweight web component compiler with html template literals",
    keywords: "lit element online editor, lit html playground, web components lit",
    language: "typescript",
    defaultCode: `import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-element')
export class MyElement extends LitElement {
  render() { return html\`<p>🔥 Hello from Lit Component</p>\`; }
}`
  },
  {
    id: "marko-editor",
    title: "Marko.js Reactive Playground",
    name: "Marko.js",
    href: "/marko-editor",
    category: "Web Frameworks",
    icon: "🏷️",
    badge: "Marko 5",
    desc: "Marko 5 HTML-first reactive template compiler & server component runner",
    keywords: "marko js online compiler, marko playground, html first framework",
    language: "html",
    defaultCode: `class {
  onCreate() { this.state = { count: 0 }; }
  increment() { this.state.count++; }
}
<button on-click('increment')>Count: \${state.count}</button>`
  },
  {
    id: "stencil-editor",
    title: "Stencil.js Component Compiler",
    name: "Stencil.js",
    href: "/stencil-editor",
    category: "Web Frameworks",
    icon: "💎",
    badge: "Stencil",
    desc: "Stencil.js Web Component compiler with TypeScript JSX and Shadow DOM",
    keywords: "stenciljs online compiler, stencil web component playground",
    language: "typescript",
    defaultCode: `import { Component, h } from '@stencil/core';
@Component({ tag: 'my-component' })
export class MyComponent {
  render() { return <div>💎 Hello from Stencil</div>; }
}`
  },
  {
    id: "ember-editor",
    title: "Ember.js Glimmer Sandbox",
    name: "Ember.js",
    href: "/ember-editor",
    category: "Web Frameworks",
    icon: "🐹",
    badge: "Glimmer",
    desc: "Ember.js Glimmer template syntax compiler & tracked properties runner",
    keywords: "ember.js online editor, glimmer template playground",
    language: "html",
    defaultCode: `<div class="ember-card">
  <h2>🐹 Ember.js Glimmer Template</h2>
</div>`
  },

  // 🔷 Hub 2: Programming Languages & WASM (20 Compilers)
  {
    id: "python-editor",
    title: "Python 3 WASM (Pyodide)",
    name: "Python 3",
    href: "/python-editor",
    category: "Languages & WASM",
    icon: "🐍",
    badge: "Pyodide WASM",
    desc: "Browser-native Python 3 compiler powered by Pyodide with stdlib & stdout logs",
    keywords: "online python compiler, pyodide wasm, python 3 playground",
    language: "python",
    defaultCode: `import math
print("🐍 Hello from Python 3 WASM!")
print("Sqrt(144) =", math.sqrt(144))`
  },
  {
    id: "typescript-editor",
    title: "TypeScript Studio & Transpiler",
    name: "TypeScript",
    href: "/typescript-editor",
    category: "Languages & WASM",
    icon: "🟦",
    badge: "Strict TS",
    desc: "Strict TypeScript compiler with live JavaScript output view & typechecking",
    keywords: "typescript online playground, typescript editor, ts to js transpiler",
    language: "typescript",
    defaultCode: `interface Dev { name: string; tools: number; }
const d: Dev = { name: "Zeeshan", tools: 100 };
console.log("🟦 TypeScript Developer:", d);`
  },
  {
    id: "js-editor",
    title: "JavaScript Node.js Playground",
    name: "JavaScript",
    href: "/js-editor",
    category: "Languages & WASM",
    icon: "🟨",
    badge: "Node.js ES6+",
    desc: "Modern ES6+ JavaScript sandbox with console logs & async execution",
    keywords: "javascript online editor, js runner, nodejs playground online",
    language: "javascript",
    defaultCode: `console.log("🚀 JavaScript Engine Active!");`
  },
  {
    id: "rust-editor",
    title: "Rust WASM Playground",
    name: "Rust 2021",
    href: "/rust-editor",
    category: "Languages & WASM",
    icon: "🦀",
    badge: "rustc 2021",
    desc: "Rust 2021 edition browser compiler with stdout console output",
    keywords: "rust online compiler, rust playground, rust wasm runner",
    language: "rust",
    defaultCode: `fn main() { println!("🦀 Hello from Rust 2021!"); }`
  },
  {
    id: "go-editor",
    title: "Go (Golang) Studio",
    name: "Go (Golang)",
    href: "/go-editor",
    category: "Languages & WASM",
    icon: "🐹",
    badge: "Go 1.22",
    desc: "Go language playground with goroutine channels & stdout terminal",
    keywords: "go online compiler, golang playground, run go code online",
    language: "go",
    defaultCode: `package main
import "fmt"
func main() { fmt.Println("🐹 Hello from Go 1.22!") }`
  },
  {
    id: "cpp-editor",
    title: "C / C++ GCC Compiler",
    name: "C / C++",
    href: "/cpp-editor",
    category: "Languages & WASM",
    icon: "⚡",
    badge: "GCC C++20",
    desc: "C++20 GCC standard compiler with pointer demo & stdout terminal",
    keywords: "c++ online compiler, gcc online, c online ide",
    language: "cpp",
    defaultCode: `#include <iostream>
int main() { std::cout << "⚡ Hello from C++20 Compiler!\\n"; return 0; }`
  },
  {
    id: "java-editor",
    title: "Java OpenJDK 21 Studio",
    name: "Java",
    href: "/java-editor",
    category: "Languages & WASM",
    icon: "☕",
    badge: "OpenJDK 21",
    desc: "Java class compilation & execution preview with standard output",
    keywords: "java online compiler, openjdk 21 playground, java runner",
    language: "java",
    defaultCode: `public class Main {
  public static void main(String[] args) {
    System.out.println("☕ Hello from Java OpenJDK 21!");
  }
}`
  },
  {
    id: "php-editor",
    title: "PHP 8.3 Live Sandbox",
    name: "PHP 8.3",
    href: "/php-editor",
    category: "Languages & WASM",
    icon: "🐘",
    badge: "PHP 8.3",
    desc: "PHP 8.3 interpreter with live HTML rendering & var_dump debugging",
    keywords: "php online editor, php sandbox, run php code online",
    language: "php",
    defaultCode: `<?php echo "🐘 Hello from PHP 8.3!"; ?>`
  },
  {
    id: "ruby-editor",
    title: "Ruby 3 WASM Playground",
    name: "Ruby 3",
    href: "/ruby-editor",
    category: "Languages & WASM",
    icon: "💎",
    badge: "Ruby 3.3",
    desc: "Browser-native Ruby 3 compiler with string interpolation & array methods",
    keywords: "ruby online compiler, ruby 3 playground, run ruby online",
    language: "ruby",
    defaultCode: `puts "💎 Hello from Ruby 3.3!"`
  },
  {
    id: "swift-editor",
    title: "Swift WASM Studio",
    name: "Swift",
    href: "/swift-editor",
    category: "Languages & WASM",
    icon: "🐦",
    badge: "Swift 5.9",
    desc: "Swift 5.9 language playground with struct modeling & print output",
    keywords: "swift online compiler, swift playground, run swift in browser",
    language: "swift",
    defaultCode: `print("🐦 Hello from Swift 5.9!")`
  },
  {
    id: "kotlin-editor",
    title: "Kotlin Browser Sandbox",
    name: "Kotlin",
    href: "/kotlin-editor",
    category: "Languages & WASM",
    icon: "🅺",
    badge: "Kotlin 1.9",
    desc: "Kotlin language sandbox with data classes & stdout output",
    keywords: "kotlin online compiler, kotlin playground, run kotlin code",
    language: "kotlin",
    defaultCode: `fun main() { println("🅺 Hello from Kotlin 1.9!") }`
  },
  {
    id: "csharp-editor",
    title: "C# .NET WASM Playground",
    name: "C# .NET",
    href: "/csharp-editor",
    category: "Languages & WASM",
    icon: "💜",
    badge: ".NET 8",
    desc: "C# .NET 8 Top-Level Statements compiler & stdout terminal",
    keywords: "csharp online compiler, dotnet 8 playground",
    language: "csharp",
    defaultCode: `using System; Console.WriteLine("💜 Hello from C# .NET 8!");`
  },
  {
    id: "elixir-editor",
    title: "Elixir / Erlang Playground",
    name: "Elixir",
    href: "/elixir-editor",
    category: "Languages & WASM",
    icon: "💧",
    badge: "BEAM WASM",
    desc: "Elixir functional programming language compiler & pipeline operator runner",
    keywords: "elixir online compiler, elixir playground",
    language: "elixir",
    defaultCode: `IO.puts "💧 Hello from Elixir BEAM Compiler!"`
  },
  {
    id: "zig-editor",
    title: "Zig Language WASM Runner",
    name: "Zig",
    href: "/zig-editor",
    category: "Languages & WASM",
    icon: "⚡",
    badge: "Zig 0.11",
    desc: "Zig systems programming language sandbox with compile-time evaluation",
    keywords: "zig online compiler, zig language playground",
    language: "zig",
    defaultCode: `const std = @import("std");
pub fn main() void { std.debug.print("⚡ Hello from Zig Compiler!\\n", .{}); }`
  },
  {
    id: "wasm-editor",
    title: "WebAssembly WAT Studio",
    name: "WebAssembly",
    href: "/wasm-editor",
    category: "Languages & WASM",
    icon: "⚙️",
    badge: "WASM Core",
    desc: "Instantiate & execute native WebAssembly bytecode in browser engine",
    keywords: "webassembly studio, wasm online runner, wat bytecode",
    language: "javascript",
    defaultCode: `console.log("⚙️ WebAssembly Engine Initialized!");`
  },
  {
    id: "dart-editor",
    title: "Dart / Flutter Code Sandbox",
    name: "Dart / Flutter",
    href: "/dart-editor",
    category: "Languages & WASM",
    icon: "🎯",
    badge: "Dart 3",
    desc: "Dart 3 object-oriented language compiler & Flutter widget simulation",
    keywords: "dart online compiler, flutter playground, run dart online",
    language: "dart",
    defaultCode: `void main() { print('🎯 Hello from Dart 3 Compiler!'); }`
  },
  {
    id: "scala-editor",
    title: "Scala WASM Playground",
    name: "Scala",
    href: "/scala-editor",
    category: "Languages & WASM",
    icon: "🔴",
    badge: "Scala 3",
    desc: "Scala 3 functional & object-oriented JVM language compiler",
    keywords: "scala online compiler, scala 3 playground, jvm functional compiler",
    language: "scala",
    defaultCode: `@main fn run(): Unit = println("🔴 Hello from Scala 3!")`
  },
  {
    id: "haskell-editor",
    title: "Haskell Functional Sandbox",
    name: "Haskell",
    href: "/haskell-editor",
    category: "Languages & WASM",
    icon: "λ",
    badge: "GHC 9.6",
    desc: "Purely functional Haskell language compiler with type inference",
    keywords: "haskell online compiler, ghc playground, functional programming",
    language: "haskell",
    defaultCode: `main :: IO ()
main = putStrLn "λ Hello from Haskell GHC Compiler!"`
  },
  {
    id: "r-editor",
    title: "R Language Data Compiler",
    name: "R Language",
    href: "/r-editor",
    category: "Languages & WASM",
    icon: "📈",
    badge: "R 4.3",
    desc: "R statistical computing language runner with vector math & dataframes",
    keywords: "r online compiler, r language playground, statistical computing r",
    language: "r",
    defaultCode: `cat("📈 Hello from R Statistical Language!\\n")
nums <- c(10, 20, 30, 40)
cat("Mean =", mean(nums), "\\n")`
  },
  {
    id: "julia-editor",
    title: "Julia Math & Scientific Compiler",
    name: "Julia",
    href: "/julia-editor",
    category: "Languages & WASM",
    icon: "🟣",
    badge: "Julia 1.10",
    desc: "High-performance Julia numerical & scientific computing compiler",
    keywords: "julia online compiler, julia language playground, scientific computing",
    language: "julia",
    defaultCode: `println("🟣 Hello from Julia Scientific Compiler!")`
  },

  // 📦 Hub 3: Data & Parsers (15 Utilities)
  {
    id: "json-editor",
    title: "JSON Studio & Validator",
    name: "JSON Studio",
    href: "/json-editor",
    category: "Data & Parsers",
    icon: "📦",
    badge: "Validator",
    desc: "Prettify, minify, validate syntax, and filter JSON payload with JSONPath",
    keywords: "online json editor, json validator, json prettifier",
    language: "json",
    defaultCode: `{ "appName": "CodePlayground", "totalCompilers": 100 }`
  },
  {
    id: "yaml-editor",
    title: "YAML & Config Studio",
    name: "YAML Config",
    href: "/yaml-editor",
    category: "Data & Parsers",
    icon: "📜",
    badge: "YAML 1.2",
    desc: "YAML syntax linter, Kubernetes config validator & YAML ↔ JSON converter",
    keywords: "yaml online editor, yaml validator, yaml to json",
    language: "yaml",
    defaultCode: `apiVersion: v1
kind: ConfigMap`
  },
  {
    id: "xml-editor",
    title: "XML & SVG Format Studio",
    name: "XML / SVG",
    href: "/xml-editor",
    category: "Data & Parsers",
    icon: "📑",
    badge: "XML Parser",
    desc: "XML formatting, XSLT validation, and SVG raw source renderer",
    keywords: "xml online editor, xml formatter, svg source viewer",
    language: "xml",
    defaultCode: `<?xml version="1.0"?><root><item>CodePlayground 100 Suite</item></root>`
  },
  {
    id: "toml-editor",
    title: "TOML Config Parser",
    name: "TOML Parser",
    href: "/toml-editor",
    category: "Data & Parsers",
    icon: "⚙️",
    badge: "TOML v1.0",
    desc: "TOML configuration parser, Cargo.toml validator & JSON converter",
    keywords: "toml online editor, toml parser, cargo toml validator",
    language: "ini",
    defaultCode: `[app]
name = "codeplayground"`
  },
  {
    id: "csv-editor",
    title: "CSV / TSV Table Studio",
    name: "CSV Table",
    href: "/csv-editor",
    category: "Data & Parsers",
    icon: "📊",
    badge: "CSV / JSON",
    desc: "Parse, edit, and convert CSV/TSV data into JSON or interactive tables",
    keywords: "csv online editor, csv to json, csv viewer",
    language: "plaintext",
    defaultCode: `id,name,role
1,Zeeshan,Developer`
  },
  {
    id: "markdown-editor",
    title: "Markdown Live GFM Editor",
    name: "Markdown",
    href: "/markdown-editor",
    category: "Data & Parsers",
    icon: "📝",
    badge: "GFM Live",
    desc: "Instant GitHub Flavored Markdown preview with tables & code snippets",
    keywords: "markdown online previewer, gfm markdown editor",
    language: "markdown",
    defaultCode: `# 📝 Markdown Studio 100 Compilers`
  },
  {
    id: "latex-editor",
    title: "LaTeX Math Formula Studio",
    name: "LaTeX Math",
    href: "/latex-editor",
    category: "Data & Parsers",
    icon: "🧮",
    badge: "KaTeX Render",
    desc: "Render mathematical equations and LaTeX formulas live with KaTeX",
    keywords: "latex online editor, katex live editor, math equation",
    language: "latex",
    defaultCode: `E = mc^2`
  },
  {
    id: "mermaid-editor",
    title: "Mermaid.js Diagram Studio",
    name: "Mermaid.js",
    href: "/mermaid-editor",
    category: "Data & Parsers",
    icon: "🧬",
    badge: "Diagrams",
    desc: "Render flowcharts, sequence diagrams, and architecture maps from code",
    keywords: "mermaidjs online editor, flowchart generator",
    language: "markdown",
    defaultCode: `graph LR; A[Request] --> B[100 Compilers Suite]`
  },
  {
    id: "protobuf-editor",
    title: "Protobuf Schema Studio",
    name: "Protobuf",
    href: "/protobuf-editor",
    category: "Data & Parsers",
    icon: "📡",
    badge: "Proto3",
    desc: "Protocol Buffers proto3 schema editor, validator, and JSON mapping",
    keywords: "protobuf online editor, proto3 validator",
    language: "protobuf",
    defaultCode: `syntax = "proto3"; message App { string name = 1; }`
  },
  {
    id: "base64-editor",
    title: "Base64 Encoder / Decoder",
    name: "Base64",
    href: "/base64-editor",
    category: "Data & Parsers",
    icon: "🔐",
    badge: "Encoding",
    desc: "Encode text/binary into Base64 or decode Base64 strings instantly",
    keywords: "base64 encoder online, base64 decoder",
    language: "plaintext",
    defaultCode: `CodePlayground 100 Online Compilers`
  },
  {
    id: "ini-editor",
    title: "INI Config File Studio",
    name: "INI Config",
    href: "/ini-editor",
    category: "Data & Parsers",
    icon: "📄",
    badge: "INI Parser",
    desc: "INI configuration file parser, section validator, and JSON converter",
    keywords: "ini file online editor, ini configuration parser",
    language: "ini",
    defaultCode: `[database]
host = 127.0.0.1
port = 5432`
  },
  {
    id: "graphql-schema-editor",
    title: "GraphQL Schema SDL Studio",
    name: "GraphQL SDL",
    href: "/graphql-schema-editor",
    category: "Data & Parsers",
    icon: "📐",
    badge: "Schema SDL",
    desc: "GraphQL Schema Definition Language (SDL) type builder & validator",
    keywords: "graphql sdl editor, graphql schema validator",
    language: "graphql",
    defaultCode: `type User { id: ID! name: String! }`
  },
  {
    id: "json-schema-editor",
    title: "JSON Schema Validator Studio",
    name: "JSON Schema",
    href: "/json-schema-editor",
    category: "Data & Parsers",
    icon: "🛡️",
    badge: "Draft 2020-12",
    desc: "Validate JSON payloads against JSON Schema specifications",
    keywords: "json schema validator online, json schema editor",
    language: "json",
    defaultCode: `{ "$schema": "https://json-schema.org/draft/2020-12/schema", "type": "object" }`
  },
  {
    id: "html-entity-editor",
    title: "HTML Entity Encoder / Decoder",
    name: "HTML Entity",
    href: "/html-entity-editor",
    category: "Data & Parsers",
    icon: "🔣",
    badge: "Entities",
    desc: "Encode special characters into HTML entities (&lt;, &gt;, &amp;)",
    keywords: "html entity encoder, html entity decoder online",
    language: "plaintext",
    defaultCode: `<h1>Hello & Welcome to CodePlayground</h1>`
  },
  {
    id: "diff-editor",
    title: "Diff & Text Comparison Tool",
    name: "Text Diff",
    href: "/diff-editor",
    category: "Data & Parsers",
    icon: "🔀",
    badge: "Git Diff",
    desc: "Side-by-side text diff comparison & git line modification highlighter",
    keywords: "online diff tool, compare text online, git diff viewer",
    language: "plaintext",
    defaultCode: `Original Text Line 1\nOriginal Text Line 2`
  },

  // 🎨 Hub 4: CSS & Styling (12 Tools)
  {
    id: "css-editor",
    title: "CSS & Tailwind Studio",
    name: "CSS / Tailwind",
    href: "/css-editor",
    category: "CSS & Styling",
    icon: "🎨",
    badge: "Tailwind v3",
    desc: "Live CSS styling, glassmorphism, flex layout & Tailwind utility builder",
    keywords: "css sandbox, tailwind playground",
    language: "html",
    defaultCode: `<div class="p-6 bg-slate-900 text-cyan-400 font-bold">✨ CSS & Tailwind</div>`
  },
  {
    id: "sass-editor",
    title: "SASS / SCSS Live Compiler",
    name: "SASS / SCSS",
    href: "/sass-editor",
    category: "CSS & Styling",
    icon: "💅",
    badge: "SCSS",
    desc: "SCSS nested styles & mixins live compiler with raw CSS output view",
    keywords: "sass online compiler, scss editor",
    language: "scss",
    defaultCode: `$c: #38bdf8; .card { color: $c; }`
  },
  {
    id: "less-editor",
    title: "LESS CSS Live Studio",
    name: "LESS CSS",
    href: "/less-editor",
    category: "CSS & Styling",
    icon: "🎨",
    badge: "LESS",
    desc: "LESS stylesheet compiler with dynamic variables and nesting",
    keywords: "less css online editor, less compiler",
    language: "less",
    defaultCode: `@c: #818cf8; .box { color: @c; }`
  },
  {
    id: "css-grid-editor",
    title: "CSS Grid & Flexbox Studio",
    name: "CSS Layout",
    href: "/css-grid-editor",
    category: "CSS & Styling",
    icon: "📐",
    badge: "Layout",
    desc: "Visual CSS Grid & Flexbox layout playground with interactive controls",
    keywords: "css grid builder, flexbox playground",
    language: "html",
    defaultCode: `<div style="display: grid; grid-template-columns: repeat(2, 1fr);"><div>1</div><div>2</div></div>`
  },
  {
    id: "glassmorphism-editor",
    title: "Glassmorphism UI Generator",
    name: "Glass UI",
    href: "/glassmorphism-editor",
    category: "CSS & Styling",
    icon: "🔮",
    badge: "Glassmorphism",
    desc: "Backdrop blur, border opacity, and modern translucent UI generator",
    keywords: "glassmorphism generator, css glass effect",
    language: "html",
    defaultCode: `<div class="p-8 bg-white/10 backdrop-blur-xl">🔮 Glass Active</div>`
  },
  {
    id: "gradient-editor",
    title: "CSS Gradient & Animation",
    name: "CSS Gradient",
    href: "/gradient-editor",
    category: "CSS & Styling",
    icon: "🌈",
    badge: "Gradients",
    desc: "Linear, radial, and mesh CSS gradient generator with keyframe animations",
    keywords: "css gradient generator, linear gradient editor",
    language: "css",
    defaultCode: `body { background: linear-gradient(135deg, #6366f1, #38bdf8); }`
  },
  {
    id: "shadow-editor",
    title: "Box Shadow Studio",
    name: "Shadow Studio",
    href: "/shadow-editor",
    category: "CSS & Styling",
    icon: "🔳",
    badge: "Box Shadow",
    desc: "Multi-layered CSS box-shadow generator & glow effects designer",
    keywords: "css box shadow generator, glow effect css",
    language: "css",
    defaultCode: `.card { box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4); }`
  },
  {
    id: "svg-editor",
    title: "SVG Path Vector Studio",
    name: "SVG Vector",
    href: "/svg-editor",
    category: "CSS & Styling",
    icon: "🖊️",
    badge: "Vector SVG",
    desc: "SVG vector path editor, viewBox inspector & live vector rendering",
    keywords: "svg path editor, svg online viewer",
    language: "xml",
    defaultCode: `<svg width="80" height="80"><circle cx="40" cy="40" r="30" fill="#38bdf8"/></svg>`
  },
  {
    id: "neumorphism-editor",
    title: "Neumorphism UI Generator",
    name: "Neumorphism",
    href: "/neumorphism-editor",
    category: "CSS & Styling",
    icon: "🔲",
    badge: "Soft UI",
    desc: "Soft shadow extrusion & inset neumorphic CSS element generator",
    keywords: "neumorphism generator, soft ui css generator",
    language: "css",
    defaultCode: `.soft-card { background: #e0e0e0; box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff; }`
  },
  {
    id: "fluid-type-editor",
    title: "CSS Clamp() Fluid Typography Generator",
    name: "Fluid Type",
    href: "/fluid-type-editor",
    category: "CSS & Styling",
    icon: "🔤",
    badge: "Clamp()",
    desc: "Responsive CSS clamp(min, val, max) font-size & viewport calculator",
    keywords: "css clamp generator, fluid typography calculator",
    language: "css",
    defaultCode: `h1 { font-size: clamp(1.5rem, 5vw, 3.5rem); }`
  },
  {
    id: "scrollbar-editor",
    title: "CSS Custom Scrollbar Designer",
    name: "CSS Scrollbar",
    href: "/scrollbar-editor",
    category: "CSS & Styling",
    icon: "📜",
    badge: "::webkit-scrollbar",
    desc: "Custom scrollbar thumb, track, and hover states CSS generator",
    keywords: "css scrollbar generator, custom scrollbar designer",
    language: "css",
    defaultCode: `::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-thumb { background: #6366f1; }`
  },
  {
    id: "border-editor",
    title: "CSS Glass Border & Radius Studio",
    name: "Border Studio",
    href: "/border-editor",
    category: "CSS & Styling",
    icon: "🖼️",
    badge: "Border Radius",
    desc: "Fancy irregular border-radius & gradient border CSS generator",
    keywords: "css border radius generator, fancy border generator",
    language: "css",
    defaultCode: `.fancy-card { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }`
  },

  // 🛠️ Hub 5: APIs & Backend (15 Tools)
  {
    id: "regex-editor",
    title: "Regex Interactive Studio",
    name: "Regex Tester",
    href: "/regex-editor",
    category: "APIs & Backend",
    icon: "🔍",
    badge: "RegExp",
    desc: "Real-time Regular Expression evaluator, flags & group match extraction",
    keywords: "regex tester online, regular expression matcher",
    language: "plaintext",
    defaultCode: `([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})`
  },
  {
    id: "graphql-editor",
    title: "GraphQL Query Studio",
    name: "GraphQL Query",
    href: "/graphql-editor",
    category: "APIs & Backend",
    icon: "📐",
    badge: "GraphQL v16",
    desc: "Build & test GraphQL queries with variables & mock response preview",
    keywords: "graphql playground online, graphql query builder",
    language: "graphql",
    defaultCode: `query { user { id name } }`
  },
  {
    id: "sql-editor",
    title: "SQL (SQLite WASM) Lab",
    name: "SQL SQLite",
    href: "/sql-editor",
    category: "APIs & Backend",
    icon: "🗄️",
    badge: "SQLite WASM",
    desc: "In-memory relational SQLite database compiler with live query results table",
    keywords: "sqlite online compiler, sql playground",
    language: "sql",
    defaultCode: `CREATE TABLE test (id INT, name TEXT); INSERT INTO test VALUES (1, '100 Compilers Suite'); SELECT * FROM test;`
  },
  {
    id: "rest-editor",
    title: "REST API Mock Studio",
    name: "REST Mock",
    href: "/rest-editor",
    category: "APIs & Backend",
    icon: "🚀",
    badge: "Mock API",
    desc: "Mock REST API endpoints, JSON responses, and HTTP headers",
    keywords: "rest api mock online, mock api response generator",
    language: "json",
    defaultCode: `{ "status": 200, "message": "OK" }`
  },
  {
    id: "jwt-editor",
    title: "JWT Debugger & Decoder",
    name: "JWT Decoder",
    href: "/jwt-editor",
    category: "APIs & Backend",
    icon: "🔑",
    badge: "JWT",
    desc: "Decode, inspect, and verify JSON Web Token header and payload claims",
    keywords: "jwt decoder online, inspect jwt token",
    language: "plaintext",
    defaultCode: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlplZXNoYW4iLCJpYXQiOjE1MTYyMzkwMjJ9`
  },
  {
    id: "cron-editor",
    title: "Cron Expression Parser",
    name: "Cron Parser",
    href: "/cron-editor",
    category: "APIs & Backend",
    icon: "⏰",
    badge: "Cron Schedule",
    desc: "Parse 5-part cron expressions into human-readable schedule explanations",
    keywords: "cron expression generator, cron parser online",
    language: "plaintext",
    defaultCode: `*/5 * * * *`
  },
  {
    id: "uuid-editor",
    title: "UUID & NanoID Generator",
    name: "UUID / NanoID",
    href: "/uuid-editor",
    category: "APIs & Backend",
    icon: "🆔",
    badge: "v4 / NanoID",
    desc: "Generate cryptographically secure UUID v4, v7, and NanoIDs",
    keywords: "uuid generator online, nanoid generator",
    language: "plaintext",
    defaultCode: `f47ac10b-58cc-4372-a567-0e02b2c3d479`
  },
  {
    id: "crypto-editor",
    title: "Hash & Crypto Studio",
    name: "Hash & Crypto",
    href: "/crypto-editor",
    category: "APIs & Backend",
    icon: "🔒",
    badge: "SHA256 / MD5",
    desc: "Compute MD5, SHA-1, SHA-256, SHA-512, and HMAC cryptographic hashes",
    keywords: "sha256 hash generator, md5 online generator",
    language: "plaintext",
    defaultCode: `Hello CodePlayground 100`
  },
  {
    id: "url-editor",
    title: "URL Encoder / Query Parser",
    name: "URL Encoder",
    href: "/url-editor",
    category: "APIs & Backend",
    icon: "🔗",
    badge: "URL Parser",
    desc: "Encode / decode URLs and parse query string parameters into JSON",
    keywords: "url encoder online, decode url",
    language: "plaintext",
    defaultCode: `https://codeplayground.tools/search?q=100+compilers`
  },
  {
    id: "http-status-editor",
    title: "HTTP Status Code Reference Studio",
    name: "HTTP Status",
    href: "/http-status-editor",
    category: "APIs & Backend",
    icon: "🌐",
    badge: "HTTP Codes",
    desc: "Interactive reference guide for 1xx, 2xx, 3xx, 4xx, 5xx HTTP response codes",
    keywords: "http status code cheat sheet, 404 error explanation",
    language: "json",
    defaultCode: `{ "code": 200, "phrase": "OK", "description": "Standard response for successful HTTP requests." }`
  },
  {
    id: "user-agent-editor",
    title: "User Agent Parser & Inspector",
    name: "User Agent",
    href: "/user-agent-editor",
    category: "APIs & Backend",
    icon: "📱",
    badge: "UA Parser",
    desc: "Parse browser User-Agent strings to extract OS, browser engine & device info",
    keywords: "user agent parser online, parse browser ua string",
    language: "plaintext",
    defaultCode: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`
  },
  {
    id: "cidr-editor",
    title: "IP & CIDR Subnet Calculator",
    name: "CIDR Calculator",
    href: "/cidr-editor",
    category: "APIs & Backend",
    icon: "🌐",
    badge: "IPv4 / IPv6",
    desc: "Calculate IPv4/IPv6 subnet masks, broadcast IPs, and host address ranges",
    keywords: "cidr calculator online, ip subnet calculator",
    language: "plaintext",
    defaultCode: `192.168.1.0/24`
  },
  {
    id: "chmod-editor",
    title: "Chmod Unix Permissions Calculator",
    name: "Chmod Studio",
    href: "/chmod-editor",
    category: "APIs & Backend",
    icon: "🔑",
    badge: "Unix Perms",
    desc: "Visual Unix permissions calculator (rwx / 755 / 644 / 777 generator)",
    keywords: "chmod calculator online, unix permissions generator",
    language: "plaintext",
    defaultCode: `chmod 755 script.sh`
  },
  {
    id: "semver-editor",
    title: "SemVer Calculator & Range Tester",
    name: "SemVer",
    href: "/semver-editor",
    category: "APIs & Backend",
    icon: "🏷️",
    badge: "SemVer 2.0",
    desc: "Validate semantic version strings and evaluate npm caret/tilde ranges (^1.2.0)",
    keywords: "semver calculator online, npm version range tester",
    language: "json",
    defaultCode: `{ "version": "2.0.0-beta.1", "range": "^2.0.0" }`
  },
  {
    id: "htpasswd-editor",
    title: "HTPASSWD Password Hash Generator",
    name: "HTPASSWD",
    href: "/htpasswd-editor",
    category: "APIs & Backend",
    icon: "🔐",
    badge: "Bcrypt / MD5",
    desc: "Generate Apache / Nginx .htpasswd basic auth credential hashes",
    keywords: "htpasswd generator online, apache basic auth hash",
    language: "plaintext",
    defaultCode: `admin:$apr1$q810...$X/5sK81...`
  },

  // 🎮 Hub 6: Graphics & Canvas (12 Labs)
  {
    id: "canvas-editor",
    title: "Canvas 2D/3D Graphics Lab",
    name: "Canvas 2D/3D",
    href: "/canvas-editor",
    category: "Graphics & Canvas",
    icon: "✨",
    badge: "Three.js / p5",
    desc: "HTML5 2D Canvas, Three.js WebGL 3D & p5.js generative art playground",
    keywords: "three.js online playground, html5 canvas editor",
    language: "javascript",
    defaultCode: `const canvas = document.getElementById('c');`
  },
  {
    id: "shader-editor",
    title: "GLSL Fragment Shader Lab",
    name: "GLSL Shader",
    href: "/shader-editor",
    category: "Graphics & Canvas",
    icon: "🌌",
    badge: "WebGL GLSL",
    desc: "Live WebGL GLSL fragment shader editor with uniforms (u_time, u_resolution)",
    keywords: "glsl shader editor, webgl fragment shader live",
    language: "cpp",
    defaultCode: `precision mediump float; void main() { gl_FragColor = vec4(1.0, 0.5, 0.2, 1.0); }`
  },
  {
    id: "svg-animation-editor",
    title: "SVG Morphing Animation Lab",
    name: "SVG Animation",
    href: "/svg-animation-editor",
    category: "Graphics & Canvas",
    icon: "🎬",
    badge: "SMIL / CSS",
    desc: "Animate SVG vector paths using CSS Keyframes and SMIL morphing",
    keywords: "svg animation editor, path morphing online",
    language: "html",
    defaultCode: `<svg width="100" height="100"><circle cx="50" cy="50" r="30" fill="#6366f1"/></svg>`
  },
  {
    id: "pixi-editor",
    title: "Pixi.js 2D Game Engine Lab",
    name: "Pixi.js 2D",
    href: "/pixi-editor",
    category: "Graphics & Canvas",
    icon: "👾",
    badge: "Pixi.js v7",
    desc: "Fast WebGL 2D render engine & sprite animation playground",
    keywords: "pixijs online playground, 2d webgl game engine",
    language: "javascript",
    defaultCode: `console.log("👾 Pixi.js Engine Active!");`
  },
  {
    id: "chart-editor",
    title: "Chart.js & D3 Data Viz Studio",
    name: "Chart.js / D3",
    href: "/chart-editor",
    category: "Graphics & Canvas",
    icon: "📈",
    badge: "Data Viz",
    desc: "Render interactive charts, bar graphs & D3 visualizations live",
    keywords: "chart.js online playground, d3.js live editor",
    language: "javascript",
    defaultCode: `console.log("📈 Chart.js Active!");`
  },
  {
    id: "babylon-editor",
    title: "Babylon.js 3D Engine Studio",
    name: "Babylon.js 3D",
    href: "/babylon-editor",
    category: "Graphics & Canvas",
    icon: "🪐",
    badge: "3D Engine",
    desc: "Full 3D WebGL game engine playground with lights, cameras & meshes",
    keywords: "babylonjs online playground, 3d webgl engine",
    language: "javascript",
    defaultCode: `console.log("🪐 Babylon.js 3D Engine Loaded!");`
  },
  {
    id: "ascii-editor",
    title: "ASCII Art & ANSI Studio",
    name: "ASCII Art",
    href: "/ascii-editor",
    category: "Graphics & Canvas",
    icon: "👾",
    badge: "ANSI Text",
    desc: "Convert text & images to terminal ASCII art and ANSI colored outputs",
    keywords: "ascii art generator, ansi text editor",
    language: "plaintext",
    defaultCode: `CodePlayground 100 Suite`
  },
  {
    id: "webgpu-editor",
    title: "WebGPU & WebGL Canvas Studio",
    name: "WebGPU Studio",
    href: "/webgpu-editor",
    category: "Graphics & Canvas",
    icon: "⚡",
    badge: "WebGPU Next",
    desc: "Next-generation GPU compute & WebGPU graphics API live playground",
    keywords: "webgpu online playground, webgpu compute shader",
    language: "javascript",
    defaultCode: `console.log("⚡ WebGPU API Active!");`
  },
  {
    id: "phaser-editor",
    title: "Phaser.js 2D Game Sandbox",
    name: "Phaser 2D",
    href: "/phaser-editor",
    category: "Graphics & Canvas",
    icon: "🎮",
    badge: "Phaser 3",
    desc: "HTML5 2D game engine playground with arcade physics & sprite sheets",
    keywords: "phaserjs online editor, html5 game playground",
    language: "javascript",
    defaultCode: `console.log("🎮 Phaser 3 Game Engine Ready!");`
  },
  {
    id: "paper-editor",
    title: "Paper.js Vector Graphics Lab",
    name: "Paper.js",
    href: "/paper-editor",
    category: "Graphics & Canvas",
    icon: "📄",
    badge: "PaperScript",
    desc: "Scriptable vector graphics framework sandbox using Paper.js",
    keywords: "paperjs online playground, vector graphics script",
    language: "javascript",
    defaultCode: `console.log("📄 Paper.js Canvas Initialized!");`
  },
  {
    id: "fabric-editor",
    title: "Fabric.js Interactive Canvas Studio",
    name: "Fabric.js",
    href: "/fabric-editor",
    category: "Graphics & Canvas",
    icon: "🖌️",
    badge: "Fabric.js",
    desc: "Object-oriented interactive HTML5 canvas library playground",
    keywords: "fabricjs online editor, interactive canvas library",
    language: "javascript",
    defaultCode: `console.log("🖌️ Fabric.js Interactive Studio!");`
  },
  {
    id: "anime-editor",
    title: "Anime.js Motion Graphics Sandbox",
    name: "Anime.js",
    href: "/anime-editor",
    category: "Graphics & Canvas",
    icon: "✨",
    badge: "Motion",
    desc: "Lightweight JavaScript animation engine playground for CSS & SVG properties",
    keywords: "animejs online playground, javascript animation engine",
    language: "javascript",
    defaultCode: `console.log("✨ Anime.js Motion Engine Loaded!");`
  },

  // 🚀 Hub 7: DevOps & Config (6 Tools)
  {
    id: "dockerfile-editor",
    title: "Dockerfile Linter & Studio",
    name: "Dockerfile",
    href: "/dockerfile-editor",
    category: "DevOps & Config",
    icon: "🐳",
    badge: "Docker",
    desc: "Dockerfile syntax linter, multi-stage build validator & layer size optimization",
    keywords: "dockerfile online editor, dockerfile linter, container syntax validator",
    language: "dockerfile",
    defaultCode: `FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nCMD ["npm", "start"]`
  },
  {
    id: "docker-compose-editor",
    title: "Docker Compose Validator Studio",
    name: "Docker Compose",
    href: "/docker-compose-editor",
    category: "DevOps & Config",
    icon: "🐙",
    badge: "Compose v2",
    desc: "Validate docker-compose.yml services, volume mounts, and network configurations",
    keywords: "docker compose online validator, docker-compose.yml editor",
    language: "yaml",
    defaultCode: `version: '3.8'\nservices:\n  web:\n    image: codeplayground/server\n    ports:\n      - "5000:5000"`
  },
  {
    id: "nginx-editor",
    title: "Nginx Config Generator & Linter",
    name: "Nginx Config",
    href: "/nginx-editor",
    category: "DevOps & Config",
    icon: "🟩",
    badge: "Nginx",
    desc: "Nginx reverse proxy, SSL, gzip, and location block configuration generator",
    keywords: "nginx config generator, nginx online linter, reverse proxy builder",
    language: "plaintext",
    defaultCode: `server {\n    listen 80;\n    server_name codeplayground.tools;\n    location / {\n        proxy_pass http://localhost:5000;\n    }\n}`
  },
  {
    id: "git-editor",
    title: "Git Command Generator & Cheatsheet",
    name: "Git Studio",
    href: "/git-editor",
    category: "DevOps & Config",
    icon: "🌱",
    badge: "Git CLI",
    desc: "Generate git rebase, cherry-pick, reset, and branch workflow CLI commands",
    keywords: "git command generator, git cheat sheet, git rebase helper",
    language: "bash",
    defaultCode: `git checkout -b feature/100-compilers-suite\ngit commit -m "feat: add 100 online compilers"\ngit push origin feature/100-compilers-suite`
  },
  {
    id: "terraform-editor",
    title: "Terraform HCL Schema Studio",
    name: "Terraform HCL",
    href: "/terraform-editor",
    category: "DevOps & Config",
    icon: "🟣",
    badge: "HCL2",
    desc: "Terraform HCL infrastructure-as-code syntax validator & provider studio",
    keywords: "terraform online editor, hcl validator, infrastructure as code",
    language: "hcl",
    defaultCode: `resource "aws_s3_bucket" "codeplayground" {\n  bucket = "codeplayground-assets"\n}`
  },
  {
    id: "github-actions-editor",
    title: "GitHub Actions CI/CD Workflow Builder",
    name: "GitHub Actions",
    href: "/github-actions-editor",
    category: "DevOps & Config",
    icon: "⚙️",
    badge: "YAML CI/CD",
    desc: "Validate GitHub Actions .github/workflows/*.yml CI/CD deployment pipelines",
    keywords: "github actions workflow editor, ci cd pipeline builder",
    language: "yaml",
    defaultCode: `name: CI Pipeline\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3`
  },

  // 🧠 Hub 8: Security & Crypto (5 Tools)
  {
    id: "rsa-editor",
    title: "RSA Key Inspector & Inspector",
    name: "RSA Key",
    href: "/rsa-editor",
    category: "Security & Crypto",
    icon: "🔑",
    badge: "PEM / RSA",
    desc: "Inspect RSA public/private PEM key modulus, exponent, and key bit lengths",
    keywords: "rsa key inspector online, pem public key reader",
    language: "plaintext",
    defaultCode: `-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAK6... \n-----END PUBLIC KEY-----`
  },
  {
    id: "hmac-editor",
    title: "HMAC Signature Generator",
    name: "HMAC Signer",
    href: "/hmac-editor",
    category: "Security & Crypto",
    icon: "🔐",
    badge: "HMAC-SHA256",
    desc: "Calculate keyed-hash message authentication codes (HMAC-SHA256 / SHA512)",
    keywords: "hmac generator online, hmac sha256 calculator",
    language: "plaintext",
    defaultCode: `SecretKey: super_secret_key_123\nMessage: CodePlayground_Auth_Token`
  },
  {
    id: "password-editor",
    title: "Password Strength & Entropy Studio",
    name: "Password Entropy",
    href: "/password-editor",
    category: "Security & Crypto",
    icon: "🛡️",
    badge: "zxcvbn",
    desc: "Calculate password bits of entropy, crack time estimations, and dictionary strength",
    keywords: "password entropy calculator, password strength checker online",
    language: "plaintext",
    defaultCode: `Tr0ub4do&3!P@ssw0rd2026`
  },
  {
    id: "aes-editor",
    title: "AES Encryption & Decryption Studio",
    name: "AES Encrypt",
    href: "/aes-editor",
    category: "Security & Crypto",
    icon: "🔒",
    badge: "AES-256-GCM",
    desc: "Encrypt and decrypt plain text using AES-256-GCM or AES-CBC with secret passphrases",
    keywords: "aes encryption online, decrypt aes 256 text",
    language: "plaintext",
    defaultCode: `Secret Message: CodePlayground 100 Compilers Suite`
  },
  {
    id: "bip39-editor",
    title: "BIP39 Mnemonic Seed Generator",
    name: "BIP39 Seed",
    href: "/bip39-editor",
    category: "Security & Crypto",
    icon: "🪙",
    badge: "12 / 24 Words",
    desc: "Generate 12-word / 24-word BIP39 mnemonic passphrases and HD wallet seeds",
    keywords: "bip39 generator online, crypto seed phrase generator",
    language: "plaintext",
    defaultCode: `abandon amount cascade code dish island position script target vital zone zulu`
  }
];

export const CATEGORIES = [
  "All Compilers",
  "Web Frameworks",
  "Languages & WASM",
  "Data & Parsers",
  "CSS & Styling",
  "APIs & Backend",
  "Graphics & Canvas",
  "DevOps & Config",
  "Security & Crypto"
] as const;
