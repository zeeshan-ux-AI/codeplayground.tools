import { CompilerItem } from "./compilers-registry";

export interface CompilerSEOData {
  h1Title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  faqs: { question: string; answer: string }[];
  howToSteps: { name: string; text: string }[];
  features: string[];
  schemaGraph: any[];
}

export function generateCompilerSEOData(compiler: CompilerItem): CompilerSEOData {
  const name = compiler.name || compiler.title;
  const langName = compiler.language ? compiler.language.toUpperCase() : name;
  const path = compiler.path || compiler.href;
  const canonicalUrl = `https://www.codeplayground.tools${path}`;

  const h1Title = `Free Online ${compiler.title} - Run ${langName} in Browser`;
  const metaTitle = `Online ${compiler.title} - Run & Debug ${langName} Code | CodePlayground`;
  const metaDescription = `Free online ${name} compiler & editor with live execution. Write, run, and test ${langName} code instantly in your browser with zero setup, real-time feedback, and instant output.`;
  const keywords = `${compiler.keywords || ""}, online ${name.toLowerCase()} compiler, run ${name.toLowerCase()} online, ${name.toLowerCase()} browser ide, ${langName.toLowerCase()} sandbox, online code execution`;

  const faqs = [
    {
      question: `What is the Online ${name} Compiler on CodePlayground?`,
      answer: `CodePlayground's ${name} compiler is a free, web-based development environment that allows you to write, edit, run, and debug ${langName} code directly in your web browser without installing any software or local compilers.`
    },
    {
      question: `How do I run ${name} code online?`,
      answer: `Simply type or paste your ${langName} source code into the Monaco editor above. CodePlayground instantly evaluates and executes your script, showing stdout, logs, and errors in the output panel.`
    },
    {
      question: `Is CodePlayground's ${name} IDE completely free?`,
      answer: `Yes! CodePlayground is 100% free with unlimited code executions, instant debounced preview, customizable themes, and zero login or subscription requirements.`
    },
    {
      question: `Can I export or clear my ${name} code?`,
      answer: `Yes, you can easily clear your current code session using the Clear Code button or reset to default starter templates anytime with a single click.`
    }
  ];

  const howToSteps = [
    {
      name: "Open the Editor",
      text: `Navigate to the CodePlayground ${name} compiler page in any web browser.`
    },
    {
      name: "Write your Code",
      text: `Enter your ${langName} source code into the full-featured Monaco editor window.`
    },
    {
      name: "Execute and Preview",
      text: "CodePlayground runs your code in real-time or upon pressing Run Code, outputting results immediately to the terminal panel."
    }
  ];

  const features = [
    `Lightning-fast browser execution with zero server latency`,
    `Powered by VS Code Monaco Editor with full syntax highlighting`,
    `Real-time console output, error tracebacks, and live typing preview`,
    `100% free with no registration or setup required`
  ];

  const schemaGraph = [
    {
      "@type": "SoftwareApplication",
      "name": `CodePlayground ${compiler.title}`,
      "operatingSystem": "Browser",
      "applicationCategory": "DeveloperApplication",
      "url": canonicalUrl,
      "description": metaDescription,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "author": { "@type": "Person", "name": "Zeeshan Khan" }
    },
    {
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.codeplayground.tools/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": compiler.category,
          "item": `https://www.codeplayground.tools/#${encodeURIComponent(compiler.category)}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": compiler.title,
          "item": canonicalUrl
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": `How to Run ${name} Code Online`,
      "description": `Step-by-step guide to writing and running ${langName} code in browser using CodePlayground.`,
      "step": howToSteps.map((step, idx) => ({
        "@type": "HowToStep",
        "position": idx + 1,
        "name": step.name,
        "text": step.text
      }))
    }
  ];

  return {
    h1Title,
    metaTitle,
    metaDescription,
    keywords,
    canonicalUrl,
    faqs,
    howToSteps,
    features,
    schemaGraph
  };
}
