import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STRINGS_DIR = path.join(process.cwd(), "src/resources/strings");

// Extract placeholders
function extractPlaceholders(text: string): string[] {
  const patterns = [
    /\$\{([^}]+)\}/g,
    /\{([^}]+)\}/g,
    /\{\{([^}]+)\}\}/g
  ];

  const results: string[] = [];
  for (const pattern of patterns) {
    let match: any;
    while ((match = pattern.exec(text)) !== null) {
      results.push(match[1]);
    }
  }
  return results;
}

async function loadTranslations(filePath: string): Promise<Record<string, string>> {
  const mod = await import(filePath);
  return mod.default || mod;
}

async function main() {
  if (!fs.existsSync(STRINGS_DIR)) {
    console.error(`❌ Directory not found: ${STRINGS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(STRINGS_DIR)
    .filter(f => f.endsWith(".ts"))
    .map(f => path.join(STRINGS_DIR, f));

  if (files.length === 0) {
    console.error("❌ No translation files found.");
    process.exit(1);
  }

  const translations = await Promise.all(
    files.map(async f => ({
      name: path.basename(f),
      data: await loadTranslations(f)
    }))
  );

  const base = translations.find(t => t.name === "en.ts") || translations[0];

  const errors: string[] = [];

  for (const file of translations) {
    if (file === base || !base || !file) continue;

    for (const key of Object.keys(base.data)) {
      if (!(key in file.data)) {
        errors.push(`❌ Missing key "${key}" in ${file.name}`);
        continue;
      }

      const baseArgs = extractPlaceholders(base.data[key]!!);
      const fileArgs = extractPlaceholders(file.data[key]!!);

      if (baseArgs.length !== fileArgs.length) {
        errors.push(
          `❌ Placeholder mismatch for key "${key}" in ${file.name} — expected ${baseArgs.length}, got ${fileArgs.length}`
        );
      }
    }

    for (const key of Object.keys(file.data)) {
      if (!(key in base.data)) {
        errors.push(`❌ Extra key "${key}" found in ${file.name}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  console.log("✅ All translation files are consistent.");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
