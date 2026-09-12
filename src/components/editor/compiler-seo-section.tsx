import React, { useState } from "react";
import { CompilerSEOData } from "@/lib/seo-generator";
import { ChevronDown, ChevronUp, HelpCircle, BookOpen, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompilerSEOSectionProps {
  seoData: CompilerSEOData;
}

export function CompilerSEOSection({ seoData }: CompilerSEOSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="w-full bg-[#0d1117] border-t border-border/40 text-slate-300 transition-all duration-200">
      {/* Toggle SEO documentation drawer bar */}
      <div className="px-4 py-2.5 bg-card/60 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-semibold tracking-wide text-foreground uppercase">
            Documentation & FAQ - {seoData.h1Title}
          </h2>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="h-7 px-3 text-xs text-primary hover:text-primary hover:bg-primary/10 gap-1.5"
        >
          {isOpen ? (
            <>Hide Guide & FAQs <ChevronUp className="w-3.5 h-3.5" /></>
          ) : (
            <>Read SEO Guide & FAQs <ChevronDown className="w-3.5 h-3.5" /></>
          )}
        </Button>
      </div>

      {/* SEO Document Body */}
      {isOpen && (
        <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in-50 duration-200">
          {/* Main H1 & Description */}
          <div className="space-y-3">
            <h1 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              {seoData.h1Title}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {seoData.metaDescription}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seoData.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-lg bg-card/40 border border-border/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-200 font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* How-To Guide */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" /> How to Run Code Online
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {seoData.howToSteps.map((step, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-card/30 border border-border/20 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <h4 className="text-xs font-bold text-foreground">{step.name}</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-400" /> Frequently Asked Questions (FAQ)
            </h3>
            <div className="space-y-2">
              {seoData.faqs.map((faq, idx) => (
                <div key={idx} className="rounded-lg border border-border/30 bg-card/20 overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full px-4 py-3 text-left text-xs font-semibold text-foreground flex items-center justify-between hover:bg-card/40 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {openFaqIndex === idx ? <ChevronUp className="w-4 h-4 text-primary shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-4 pb-3 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/20 bg-background/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
