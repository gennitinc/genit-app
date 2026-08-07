import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const sourceRoots = ["app", "components"];
const targets = ["es", "fr"];
const maxBatchCharacters = 4_000;
const concurrency = 6;

async function sourceFiles(directory) {
  const entries = await fs.readdir(path.join(root, directory), {
    withFileTypes: true,
  });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const relative = path.join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(relative);
      if (!entry.name.endsWith(".tsx")) return [];
      if (/\bcopy\b|page \d+\.tsx$/i.test(entry.name)) return [];
      return [relative];
    })
  );
  return files.flat();
}

function literalText(node) {
  if (ts.isStringLiteralLike(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text.trim();
  }
  return "";
}

function collectTranslationKeys(source, filename) {
  const file = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  const keys = new Set();

  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "t" &&
      node.arguments.length
    ) {
      const text = literalText(node.arguments[0]);
      if (text) keys.add(text);
    }

    if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(file) === "LocalizedText") {
      const attribute = node.attributes.properties.find(
        (property) =>
          ts.isJsxAttribute(property) && property.name.getText(file) === "text"
      );
      if (attribute && ts.isJsxAttribute(attribute) && attribute.initializer) {
        if (ts.isStringLiteral(attribute.initializer)) {
          const text = attribute.initializer.text.trim();
          if (text) keys.add(text);
        } else if (
          ts.isJsxExpression(attribute.initializer) &&
          attribute.initializer.expression
        ) {
          const text = literalText(attribute.initializer.expression);
          if (text) keys.add(text);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(file);
  return keys;
}

function collectManualTranslations(source) {
  const file = ts.createSourceFile(
    "lib/i18n.ts",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  const dictionaries = { es: new Set(), fr: new Set() };

  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      const name = ts.isIdentifier(declaration.name) ? declaration.name.text : "";
      if (!(name in dictionaries) || !declaration.initializer) continue;
      if (!ts.isObjectLiteralExpression(declaration.initializer)) continue;
      for (const property of declaration.initializer.properties) {
        if (!ts.isPropertyAssignment(property)) continue;
        const key = literalText(property.name);
        if (key) dictionaries[name].add(key);
        else if (ts.isIdentifier(property.name)) dictionaries[name].add(property.name.text);
      }
    }
  }
  return dictionaries;
}

function batches(keys) {
  const result = [];
  let batch = [];
  let length = 2;
  for (const key of keys) {
    const addition = JSON.stringify(key).length + 1;
    if (batch.length && length + addition > maxBatchCharacters) {
      result.push(batch);
      batch = [];
      length = 2;
    }
    batch.push(key);
    length += addition;
  }
  if (batch.length) result.push(batch);
  return result;
}

async function translateBatch(language, texts, attempt = 1) {
  const body = new URLSearchParams({
    client: "gtx",
    sl: "en",
    tl: language,
    dt: "t",
    q: JSON.stringify(texts),
  });
  try {
    const response = await fetch(
      "https://translate.googleapis.com/translate_a/single",
      { method: "POST", body, signal: AbortSignal.timeout(30_000) }
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const translatedJson = payload[0].map((part) => part[0]).join("");
    const translated = JSON.parse(translatedJson);
    if (!Array.isArray(translated) || translated.length !== texts.length) {
      throw new Error("Translation response did not preserve the batch");
    }
    return translated;
  } catch (error) {
    if (attempt >= 4) throw error;
    await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
    return translateBatch(language, texts, attempt + 1);
  }
}

async function mapConcurrent(items, mapper) {
  const output = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      output[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return output;
}

const files = (await Promise.all(sourceRoots.map(sourceFiles))).flat();
const keys = new Set();
for (const filename of files) {
  const source = await fs.readFile(path.join(root, filename), "utf8");
  for (const key of collectTranslationKeys(source, filename)) keys.add(key);
}

const manual = collectManualTranslations(
  await fs.readFile(path.join(root, "lib/i18n.ts"), "utf8")
);

for (const language of targets) {
  const outputPath = path.join(root, "locales", `${language}.generated.json`);
  const existing = JSON.parse(await fs.readFile(outputPath, "utf8"));
  const missing = [...keys]
    .filter((key) => !manual[language].has(key) && !existing[key])
    .sort((a, b) => a.localeCompare(b));
  const chunks = batches(missing);
  console.log(`${language}: ${missing.length} missing keys in ${chunks.length} batches`);
  const translations = await mapConcurrent(chunks, async (chunk, index) => {
    const translated = await translateBatch(language, chunk);
    console.log(`${language}: ${index + 1}/${chunks.length}`);
    return translated;
  });
  chunks.forEach((chunk, chunkIndex) => {
    chunk.forEach((key, keyIndex) => {
      existing[key] = translations[chunkIndex][keyIndex];
    });
  });
  const ordered = Object.fromEntries(
    Object.entries(existing).sort(([a], [b]) => a.localeCompare(b))
  );
  await fs.writeFile(outputPath, `${JSON.stringify(ordered, null, 2)}\n`);
  console.log(`${language}: wrote ${Object.keys(ordered).length} generated translations`);
}

console.log(`Done: ${keys.size} application translation keys scanned.`);
