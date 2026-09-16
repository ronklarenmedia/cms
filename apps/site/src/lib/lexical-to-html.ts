// Minimale, dependency-vrije Lexical-JSON → HTML-serializer, alleen voor
// het richText-block (zie apps/cms/src/blocks/richText.ts). Dekt de
// node-types die Payload's standaard lexicalEditor() toolbar aanbiedt:
// paragraph/heading/list(item)/quote/link + tekst-formatting-bitmask.
// Geen @payloadcms/richtext-lexical-dependency nodig voor dit ene block.

type LexicalNode = {
  type: string;
  tag?: string;
  format?: number | string;
  text?: string;
  url?: string;
  fields?: { url?: string; newTab?: boolean };
  children?: LexicalNode[];
};

const TEXT_FORMAT = { bold: 1, italic: 2, strikethrough: 4, underline: 8, code: 16 };

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderText(node: LexicalNode): string {
  let html = escapeHtml(node.text || "");
  const fmt = typeof node.format === "number" ? node.format : 0;
  if (fmt & TEXT_FORMAT.code) html = `<code>${html}</code>`;
  if (fmt & TEXT_FORMAT.bold) html = `<strong>${html}</strong>`;
  if (fmt & TEXT_FORMAT.italic) html = `<em>${html}</em>`;
  if (fmt & TEXT_FORMAT.underline) html = `<u>${html}</u>`;
  if (fmt & TEXT_FORMAT.strikethrough) html = `<s>${html}</s>`;
  return html;
}

function renderChildren(node: LexicalNode | undefined): string {
  if (!node?.children) return "";
  return node.children.map(renderNode).join("");
}

function renderNode(node: LexicalNode): string {
  switch (node.type) {
    case "text":
      return renderText(node);
    case "linebreak":
      return "<br />";
    case "paragraph":
      return `<p>${renderChildren(node)}</p>`;
    case "heading": {
      const tag = node.tag || "h2";
      return `<${tag}>${renderChildren(node)}</${tag}>`;
    }
    case "list": {
      const tag = node.tag === "number" ? "ol" : "ul";
      return `<${tag}>${renderChildren(node)}</${tag}>`;
    }
    case "listitem":
      return `<li>${renderChildren(node)}</li>`;
    case "quote":
      return `<blockquote>${renderChildren(node)}</blockquote>`;
    case "link": {
      const href = node.fields?.url || node.url || "#";
      const target = node.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${escapeHtml(href)}"${target}>${renderChildren(node)}</a>`;
    }
    default:
      return renderChildren(node);
  }
}

export function lexicalToHtml(value: unknown): string {
  const root = (value as { root?: LexicalNode })?.root;
  if (!root) return "";
  return renderChildren(root);
}
