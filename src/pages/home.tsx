import { Link } from "wouter";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSEO } from "@/hooks/use-seo";
import { ArrowRight, Code2, Sparkles, Search, Terminal, Zap, ShieldCheck, Cpu, Smartphone, Layers, Flame } from "lucide-react";
import { COMPILERS_REGISTRY, CATEGORIES } from "@/lib/compilers-registry";
import { CommandSearch } from "@/components/layout/command-search";
import { AdSenseSlot } from "@/components/adsense-slot";

const QUICK_TAGS = [
  { name: "React", query: "react", icon: "⚛️" },
  { name: "Python", query: "python", icon: "🐍" },
  { name: "C++", query: "cpp", icon: "⚡" },
  { name: "Java", query: "java", icon: "☕" },
  { name: "SQL", query: "sql", icon: "🗄️" },
  { name: "Rust", query: "rust", icon: "🦀" },
  { name: "Go", query: "go", icon: "🐹" },
  { name: "Regex", query: "regex", icon: "🔍" },
  { name: "JSON", query: "json", icon: "📦" },
  { name: "Tailwind", query: "tailwind", icon: "🎨" },
  { name: "Docker", query: "docker", icon: "🐳" },
];

const FEATURED_IDS = [
  "react-editor",
  "python-editor",
  "cpp-editor",
  "java-editor",
  "js-editor",
  "sql-editor",
  "regex-editor",
  "web-editor",
];

export default function Home() {
  useSEO({
    title: "CodePlayground | 100+ Free Online Compilers & Web IDE Suite",
    description: "The ultimate free developer IDE suite. 100+ online compilers for React, Python, C++, Java, Rust, Go, SQL, Regex, JSON, Vue, Svelte, Tailwind, Docker, and WebAssembly with instant live preview.",
    keywords: "100 online compilers, online code editor, react ide, python compiler, cpp compiler, sql playground, regex tester, web ide, docker compose linter, wasm IDE, stackblitz alternative, codesandbox alternative, codeplayground tools",
    canonical: "/",
    ogType: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "name": "CodePlayground",
          "operatingSystem": "Browser-based",
          "applicationCategory": "DeveloperApplication",
          "url": "https://www.codeplayground.tools",
          "description": "Professional browser-based IDE for React, Python, HTML, CSS, JS and 100+ programming languages.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "author": { "@type": "Person", "name": "Zeeshan Khan" }
        },
        {
          "@type": "WebSite",
          "url": "https://www.codeplayground.tools/",
          "name": "CodePlayground",
          "publisher": { "@type": "Person", "name": "Zeeshan Khan" }
        }
      ]
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>("All Compilers");
  const [searchQuery, setSearchQuery] = useState("");
  const [commandSearchOpen, setCommandSearchOpen] = useState(false);

  // Category Counts map
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { "All Compilers": COMPILERS_REGISTRY.length };
    COMPILERS_REGISTRY.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, []);

  const featuredCompilers = useMemo(() => {
    return COMPILERS_REGISTRY.filter((c) => FEATURED_IDS.includes(c.id));
  }, []);

  const filteredCompilers = useMemo(() => {
    return COMPILERS_REGISTRY.filter((c) => {
      const matchesCat = activeCategory === "All Compilers" || c.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.keywords.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />
      </div>

      {/* Top Navbar */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/30">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-lg tracking-tight leading-tight">CodePlayground</span>
              <span className="text-[10px] font-bold text-primary tracking-wider uppercase">100+ Compilers Suite</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCommandSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 text-xs border-border/60 text-muted-foreground hover:text-foreground bg-background/60"
            >
              <Search className="w-3.5 h-3.5 text-primary" /> Search 100+ Compilers... <kbd className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono border border-border/40">⌘K</kbd>
            </Button>

            <Button
              className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5 bg-gradient-to-r from-primary to-blue-500 border-0 font-semibold"
              asChild
            >
              <Link href="/react-editor">Launch IDE →</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold mb-6 text-primary shadow-sm shadow-primary/20">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            100+ Online Compilers & Developer Tools Suite
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[4.2rem] font-black tracking-tight mb-6 max-w-5xl mx-auto leading-[1.08]">
            Code. Preview.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-cyan-400">
              Execute 100+ Stacks Online.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            The all-in-one web IDE suite for React, Python, C++, Java, Rust, Go, SQL, Regex, Vue, Docker, Svelte, Tailwind & WASM — with zero setup and instant live execution.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl mb-10 text-left">
            <div className="bg-card/50 border border-border/40 p-3.5 rounded-2xl flex items-center gap-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-lg font-black text-foreground">100 Tools</div>
                <div className="text-xs text-muted-foreground">Compilers & IDEs</div>
              </div>
            </div>

            <div className="bg-card/50 border border-border/40 p-3.5 rounded-2xl flex items-center gap-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-lg font-black text-foreground">~100ms</div>
                <div className="text-xs text-muted-foreground">Live Debounced Output</div>
              </div>
            </div>

            <div className="bg-card/50 border border-border/40 p-3.5 rounded-2xl flex items-center gap-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-lg font-black text-foreground">WASM Native</div>
                <div className="text-xs text-muted-foreground">Zero Install Runtimes</div>
              </div>
            </div>

            <div className="bg-card/50 border border-border/40 p-3.5 rounded-2xl flex items-center gap-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-lg font-black text-foreground">100% Mobile</div>
                <div className="text-xs text-muted-foreground">Touch Responsive UI</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 🔥 Top Developer Essentials (Featured Spotlight) */}
      <section className="py-8 bg-card/20 border-y border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
              <h2 className="text-xl font-black tracking-tight">Top Developer Essentials</h2>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">Daily Developer Tools</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {featuredCompilers.map((c) => (
              <Link
                key={c.id}
                href={c.href}
                className="group flex flex-col items-center justify-center p-3.5 rounded-2xl bg-card/60 hover:bg-card border border-border/50 hover:border-primary/60 transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-lg text-center"
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{c.icon}</span>
                <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors truncate w-full">
                  {c.name}
                </span>
                <span className="text-[10px] text-muted-foreground truncate w-full mt-0.5">
                  {c.badge}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 100 Online Compilers Main Matrix */}
      <section className="py-14 relative" id="compilers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2 block">Developer Workstation Catalog</span>
            <h2 className="text-3xl sm:text-4xl font-black mb-3">Explore All 100 Compilers & Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
              Use the live search or click category tabs below. Every editor includes instant debounced output, code formatting, and AdSense integration.
            </p>
          </div>

          {/* Search Bar & Quick Suggest Tags */}
          <div className="space-y-4 mb-8">
            <div className="max-w-2xl mx-auto relative">
              <Search className="w-4 h-4 text-primary absolute left-4 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter 100 compilers... (e.g. python, react, sql, c++, tailwind, docker, regex)"
                className="pl-11 pr-10 h-12 rounded-2xl bg-card/70 border-border/60 focus:border-primary text-sm shadow-xl font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground bg-muted px-2 py-0.5 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Clickable Tag Pills */}
            <div className="flex items-center justify-center flex-wrap gap-1.5 max-w-4xl mx-auto">
              <span className="text-xs font-bold text-muted-foreground mr-1">Popular:</span>
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => setSearchQuery(tag.query)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    searchQuery.toLowerCase() === tag.query
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-card/40 text-muted-foreground border-border/40 hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span className="mr-1">{tag.icon}</span> {tag.name}
                </button>
              ))}
            </div>

            {/* Category Filter Tabs with Counts */}
            <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
              {CATEGORIES.map((cat) => {
                const count = categoryCounts[cat] || 0;
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105"
                        : "bg-card/40 text-muted-foreground border border-border/40 hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Count Banner */}
          <div className="flex items-center justify-between mb-4 px-1 text-xs text-muted-foreground font-semibold">
            <span>Showing {filteredCompilers.length} of 100 Compilers</span>
            <span>Click any card to open compiler IDE</span>
          </div>

          {/* Compiler Cards Grid Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCompilers.map((compiler, i) => (
              <motion.div
                key={compiler.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.015, 0.25) }}
              >
                <Link
                  href={compiler.href}
                  className="group flex flex-col justify-between h-full bg-card/40 hover:bg-card/90 border border-border/40 hover:border-primary/60 p-5 rounded-2xl transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-primary/10"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{compiler.icon}</span>
                      <Badge variant="outline" className="text-[10px] font-bold px-2 py-0.5 border-primary/30 text-primary bg-primary/5">
                        {compiler.badge}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors mb-1.5 leading-snug">
                      {compiler.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {compiler.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/20 flex items-center justify-between text-xs font-semibold text-primary opacity-90 group-hover:opacity-100">
                    <span>Launch IDE</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Google AdSense Banner */}
      <div className="py-6 bg-background border-t border-border/30 flex justify-center">
        <AdSenseSlot label="Google AdSense Bottom Banner" className="w-[728px] max-w-[calc(100%-2rem)] h-[90px]" />
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-border/30 bg-card/30 relative overflow-hidden font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/20">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">CodePlayground</span>
            </div>
            <p className="text-muted-foreground text-xs max-w-xs text-center md:text-left">
              The professional 100+ online compilers & developer tools suite.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
              <span>Lead Developer:</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 font-bold">Zeeshan</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          <p>© {new Date().getFullYear()} CodePlayground — Fast, Lightweight, Professional.</p>
          <p>Powered by Monaco Editor & WebAssembly Runtimes</p>
        </div>
      </footer>

      <CommandSearch open={commandSearchOpen} onOpenChange={setCommandSearchOpen} />
    </div>
  );
}
