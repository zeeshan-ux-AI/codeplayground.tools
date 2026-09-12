import { useEffect } from "react";

export interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, any>;
  noindex?: boolean;
}

const BASE_URL = "https://www.codeplayground.tools";
const DEFAULT_OG_IMAGE = `${BASE_URL}/opengraph.jpg`;
const SITE_NAME = "CodePlayground";
const TWITTER_HANDLE = "@codeplayground";

function setMeta(selector: string, attrKey: string, attrVal: string, content: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrKey, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  return el;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  return el;
}

function setJsonLd(data: Record<string, any>, id: string) {
  let el = document.querySelector(`script[data-seo-id="${id}"]`);
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-seo-id", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  const el = document.querySelector(`script[data-seo-id="${id}"]`);
  if (el) el.remove();
}

export function useSEO({
  title,
  description = "CodePlayground — The ultimate suite of 100+ free online compilers, IDEs, and developer tools. Run code instantly in your browser.",
  keywords = "online compiler, code editor, ide online, programming, web development, codeplayground",
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  jsonLd,
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    const prevTitle = document.title;

    // ── 1. Title ──────────────────────────────────────────────
    document.title = title;

    // ── 2. Standard Meta ──────────────────────────────────────
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[name="keywords"]', "name", "keywords", keywords);
    setMeta('meta[name="author"]', "name", "author", "Zeeshan Khan");
    setMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
    );
    setMeta('meta[name="googlebot"]', "name", "googlebot",
      noindex ? "noindex" : "index, follow, max-snippet:-1, imageindex"
    );

    // ── 3. Canonical URL ──────────────────────────────────────
    const canonicalHref = canonical
      ? (canonical.startsWith("http") ? canonical : `${BASE_URL}${canonical}`)
      : BASE_URL;
    setLink("canonical", canonicalHref);

    // ── 4. Open Graph ─────────────────────────────────────────
    setMeta('meta[property="og:type"]', "property", "og:type", ogType);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME);
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalHref);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:image"]', "property", "og:image", ogImage);
    setMeta('meta[property="og:image:width"]', "property", "og:image:width", "1200");
    setMeta('meta[property="og:image:height"]', "property", "og:image:height", "630");
    setMeta('meta[property="og:image:alt"]', "property", "og:image:alt", `${SITE_NAME} - Online Compiler`);
    setMeta('meta[property="og:locale"]', "property", "og:locale", "en_US");

    // ── 5. Twitter Cards ──────────────────────────────────────
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:site"]', "name", "twitter:site", TWITTER_HANDLE);
    setMeta('meta[name="twitter:creator"]', "name", "twitter:creator", TWITTER_HANDLE);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", ogImage);

    // ── 6. JSON-LD Structured Data ─────────────────────────────
    const defaultJsonLd = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": SITE_NAME,
      "headline": title,
      "description": description,
      "url": canonicalHref,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "author": {
        "@type": "Person",
        "name": "Zeeshan Khan",
        "url": BASE_URL
      },
      "publisher": {
        "@type": "Organization",
        "name": SITE_NAME,
        "url": BASE_URL
      }
    };
    setJsonLd(jsonLd || defaultJsonLd, "page-jsonld");

    return () => {
      document.title = prevTitle;
      removeJsonLd("page-jsonld");
    };
  }, [title, description, keywords, canonical, ogImage, ogType, noindex, jsonLd]);
}
