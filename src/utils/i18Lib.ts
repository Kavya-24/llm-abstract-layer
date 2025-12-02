import en from "../resources/strings/en.js";
import es from "../resources/strings/es.js";

type SupportedLang = "en" | "es";

// 1. Load languages
type TranslationBundle = Record<string, string>;
type TranslationKey = keyof typeof en;

const LANG_BUNDLES: Record<SupportedLang, TranslationBundle> = {
  en,
  es,
};

function formatString(template: string, args: Record<string, any> = {}) {
  return template.replace(/\$\{(\w+)\}/g, (_, key) =>
    key in args ? String(args[key]) : `\${${key}}`
  );
}

interface GetStringOptions {
  language?: SupportedLang;
  args?: Record<string, any>;
}

export function getString(
  key: TranslationKey,
  opts: GetStringOptions = {}
): string {
  const { language = "en", args = {} } = opts;

  const primary = LANG_BUNDLES[language][key];
  const fallback = LANG_BUNDLES["en"][key];

  if (primary) return formatString(primary, args);
  if (fallback) return formatString(fallback, args);

  console.warn(`⚠️ Missing translation key: "${key}" in all languages`);
  return key;
}
