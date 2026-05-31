import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "p",
  "br",
  "hr",
  "strong",
  "em",
  "u",
  "s",
  "a",
  "blockquote",
  "code",
  "pre",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "h4",
  "figure",
  "figcaption",
  "img",
  "span",
  "h1",
];

const allowedAttributes: sanitizeHtml.IOptions["allowedAttributes"] = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "title", "loading"],
  span: ["style"],
};

export function sanitizeContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    },
  });
}
