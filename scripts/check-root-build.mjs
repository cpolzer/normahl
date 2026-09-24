// Verifies a BASE_PATH=/ build (webspace deploy) is safe to publish:
// no leftover /normahl/ base path, and no password hash baked in.
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const dir = process.argv[2] ?? 'dist';
const TEXT = new Set(['.html', '.css', '.js', '.mjs', '.xml', '.txt', '.json', '.svg']);

async function* walk(d) {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (TEXT.has(extname(e.name))) yield p;
  }
}

const problems = [];
if (!existsSync(join(dir, 'index.html'))) {
  problems.push(`${dir}: index.html missing (empty or failed build?)`);
} else {
  for await (const file of walk(dir)) {
    const text = await readFile(file, 'utf8');
    if (text.includes('/normahl/')) problems.push(`${file}: contains "/normahl/"`);
    if (/passwordHash\s*=\s*(["'`])(?!\1)/.test(text)) problems.push(`${file}: password hash embedded`);
  }
}

if (problems.length) {
  console.error(`Root build check failed (${dir}):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`Root build check passed (${dir})`);
