const SUPPORTED_TYPES = new Set(["steps", "checklist", "summary"]);

// Read the optional UI block from an AI answer. If it is not complete or safe,
// return null and let the normal Markdown answer display as usual.
export function parseGenerativeUi(answer = "") {
  const match = answer.match(/```qadeer-ui\s*\n([\s\S]*?)\n```/);
  if (!match) return { ui: null, content: answer };

  const content = answer.replace(match[0], "").trim();

  try {
    const data = JSON.parse(match[1]);
    const items = Array.isArray(data.items)
      ? data.items.filter((item) => typeof item === "string" && item.trim()).slice(0, 6)
      : [];

    if (!SUPPORTED_TYPES.has(data.type) || typeof data.title !== "string" || !items.length) {
      return { ui: null, content };
    }

    return {
      ui: { type: data.type, title: data.title.slice(0, 80), items },
      content,
    };
  } catch {
    return { ui: null, content: answer };
  }
}
