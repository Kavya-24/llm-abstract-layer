import fs from "fs";
import path from "path";

// Directory of translations
const STRINGS_DIR = path.join(process.cwd(), "src/resources/strings");

function extractPlaceholders(text: string): string[] {
  const patterns = [
    /\$\{([^}]+)\}/g,
    /\{([^}]+)\}/g,
    /\{\{([^}]+)\}\}/g,
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

function loadTranslations(filePath: string): Record<string, string> {
  const mod = require(filePath);
  return mod.default || mod;
}

function main() {
  if (!fs.existsSync(STRINGS_DIR)) {
    console.error("❌ Directory not found:", STRINGS_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(STRINGS_DIR)
    .filter(f => f.endsWith(".ts"))
    .map(f => path.join(STRINGS_DIR, f));

  if (files.length === 0) {
    console.error("❌ No translation files found in", STRINGS_DIR);
    process.exit(1);
  }

  const translations = files.map(f => ({
    name: path.basename(f),
    data: loadTranslations(f),
  }));

  const base = translations.find(t => t.name === "en.ts") || translations[0];

  const errors: string[] = [];

  for (const file of translations) {

    if (!file || !base || file === base || !base.data) continue;

    for (const key of Object.keys(base.data)) {
      if (!(key in file.data)) {
        errors.push(`❌ Missing key "${key}" in ${file.name}`);
        continue;
      }

      const baseArgs = extractPlaceholders(base.data[key]!!);
      const fileArgs = extractPlaceholders(file.data[key]!!);

      if (baseArgs.length !== fileArgs.length) {
        errors.push(
          `❌ Placeholder count mismatch for "${key}" in ${file.name}: ` +
          `expected ${baseArgs.length}, got ${fileArgs.length}`
        );
      }
    }

    for (const key of Object.keys(file.data)) {
      if (!(key in base.data)) {
        errors.push(`❌ Extra key "${key}" in ${file.name}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  console.log("✅ All translation files are consistent!");
}

main();
