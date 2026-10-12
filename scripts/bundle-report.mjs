import { readdir, readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const files = (await readdir('dist/assets')).filter(
  (file) => file.endsWith('.js') || file.endsWith('.css'),
);
const rows = [];
for (const file of files) {
  const bytes = await readFile(`dist/assets/${file}`);
  const gzipBytes = gzipSync(bytes).byteLength;
  const budget = file.startsWith('Scene-')
    ? 330 * 1024
    : file.endsWith('.js')
      ? 150 * 1024
      : 15 * 1024;
  rows.push({
    file,
    bytes: (await stat(`dist/assets/${file}`)).size,
    gzipBytes,
    budget,
    withinBudget: gzipBytes <= budget,
  });
}
console.table(rows);
if (rows.some((row) => !row.withinBudget)) process.exitCode = 1;
