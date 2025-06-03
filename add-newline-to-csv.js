const fs = require('fs');

const inputPath = 'C:\\Users\\yuval_c\\Desktop\\emotion-site\\emotion-site-react\\public\\texts.csv';
const outputPath = 'C:\\Users\\yuval_c\\Desktop\\emotion-site\\emotion-site-react\\public\\texts_new.csv';

const data = fs.readFileSync(inputPath, 'utf8');
const lines = data.split(/\r?\n/);
const newLines = lines.map(line => line + '\\n');
fs.writeFileSync(outputPath, newLines.join('\n'), 'utf8');

console.log('Done!');