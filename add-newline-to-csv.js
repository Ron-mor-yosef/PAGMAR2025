const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');

const inputPath = 'public/texts_new2.csv';
const outputPath = 'public/texts_new2_aligned.csv';

const csv = fs.readFileSync(inputPath, 'utf8');
const records = parse(csv, { columns: true });
const columns = Object.keys(records[0] || {});

function extractTags(text, tag) {
  if (!text) return [];
  // <קטגוריה: ...> or <רגש: ...>
  const regex = new RegExp(`<${tag}:\\s*([^>/]+)>|<${tag}:\\s*([^>/]+)/>`, 'g');
  const tags = new Set();
  let match;
  while ((match = regex.exec(text))) {
    const val = match[1] || match[2];
    if (val) tags.add(val.trim());
  }
  return Array.from(tags).sort();
}

for (const row of records) {
  const text = row['הטקסט'] || '';
  row['קטגוריה'] = extractTags(text, 'קטגוריה').join('\n');
  row['רגש'] = extractTags(text, 'רגש').join('\n');
}

const output = stringify(records, { header: true, columns });
fs.writeFileSync(outputPath, output, 'utf8');
console.log('Done! Saved to', outputPath);