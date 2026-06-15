import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokensDir = path.resolve(__dirname, '../src/tokens');
const baseTokenFiles = [
  'primitives.css',
  'semantic.css',
  'spacing.css',
  'typography.css',
  'elevation.css',
  'motion.css',
  'layout.css'
];
const darkCssPath = path.resolve(tokensDir, 'dark.css');
const outPath = path.resolve(__dirname, '../dist/tokens.json');

function extractTokensFromFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const css = fs.readFileSync(filePath, 'utf-8');
  const tokens = {};
  
  // Regex to capture --var-name: value;
  const regex = /(--[a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;
  let match;
  
  while ((match = regex.exec(css)) !== null) {
    const key = match[1].trim();
    const value = match[2].trim();
    tokens[key] = value;
  }
  
  return tokens;
}

function resolveTokens(tokens, baseTokens = {}) {
  const resolved = { ...tokens };
  const allTokens = { ...baseTokens, ...tokens }; // Context for resolving
  
  let hasUnresolved = true;
  let iterations = 0;
  
  while (hasUnresolved && iterations < 10) {
    hasUnresolved = false;
    iterations++;
    
    for (const key in resolved) {
      let value = resolved[key];
      
      // Match var(--name) or var(--name, fallback)
      const varRegex = /var\((--[a-zA-Z0-9-]+)(?:,\s*([^)]+))?\)/g;
      
      if (varRegex.test(value)) {
        hasUnresolved = true;
        resolved[key] = value.replace(varRegex, (match, varName, fallback) => {
          if (allTokens[varName]) {
            return allTokens[varName];
          } else if (fallback) {
            return fallback;
          }
          return match; // Couldn't resolve yet
        });
      }
    }
  }
  
  return resolved;
}

function generateManifest() {
  if (!fs.existsSync(path.dirname(outPath))) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
  }

  let lightRaw = {};
  for (const file of baseTokenFiles) {
    const fileTokens = extractTokensFromFile(path.resolve(tokensDir, file));
    lightRaw = { ...lightRaw, ...fileTokens };
  }
  
  const darkRaw = extractTokensFromFile(darkCssPath);
  
  const lightResolved = resolveTokens(lightRaw);
  const darkResolved = resolveTokens(darkRaw, lightResolved);

  const manifest = {
    _meta: {
      description: "Resolved token values for visual-diff gate in consumers.",
      format: "resolved"
    },
    light: lightResolved,
    dark: darkResolved
  };

  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
  console.log(`✅ Token manifest generated at dist/tokens.json`);
}

generateManifest();
