import "server-only";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/**
 * Admin-authored Markdown → safe HTML. Markdown is rendered, then the HTML is
 * passed through an allow-list sanitiser: no scripts, styles, iframes, event
 * handlers or javascript: URLs survive, whatever an account (compromised or
 * not) types into the editor.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h2", "h3", "h4", "p", "br", "hr", "strong", "em", "b", "i", "u", "s", "blockquote", "code", "pre",
    "ul", "ol", "li", "a", "img", "table", "thead", "tbody", "tr", "th", "td",
  ],
  allowedAttributes: {
    a: ["href", "title", "rel", "target"],
    img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
    th: ["align"], td: ["align"],
  },
  allowedSchemes: ["https", "http", "mailto", "tel"],
  allowedSchemesByTag: { img: ["https"] },
  allowProtocolRelative: false,
  transformTags: {
    // Demote any h1 — the page already has one.
    h1: "h2",
    a: (tagName, attribs) => {
      const external = /^https?:\/\//.test(attribs.href ?? "");
      return {
        tagName,
        attribs: external ? { ...attribs, target: "_blank", rel: "noopener noreferrer nofollow" } : attribs,
      };
    },
    img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy", decoding: "async" } }),
  },
};

export function renderMarkdown(md: string): string {
  const html = marked.parse(md ?? "", { async: false, gfm: true, breaks: false }) as string;
  return sanitizeHtml(html, {
    ...OPTIONS,
    // Our own uploads are relative /media/… paths.
    exclusiveFilter: (frame) => frame.tag === "img" && !/^(https:\/\/|\/media\/)/.test(frame.attribs.src ?? ""),
    allowedSchemesAppliedToAttributes: ["href", "src"],
  });
}

/** Plain text for meta descriptions and JSON-LD. */
export function toPlainText(md: string, max = 300): string {
  const text = sanitizeHtml(marked.parse(md ?? "", { async: false }) as string, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
