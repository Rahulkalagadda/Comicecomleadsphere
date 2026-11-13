const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(fs.readFileSync('stitch-screens/manifest.json', 'utf8'));
const allImgSrcs = new Set();

manifest.forEach(item => {
  const content = fs.readFileSync(item.htmlFile, 'utf8');
  const matches = content.match(/src="([^"]+)"/g) || [];
  matches.forEach(m => {
    const url = m.slice(5, -1);
    if (url.startsWith('http')) {
      allImgSrcs.add(url);
    }
  });
});

console.log('Total unique external image URLs across all screens:', allImgSrcs.size);
const arr = Array.from(allImgSrcs);
console.log('Sample image URLs:');
arr.slice(0, 15).forEach((url, i) => console.log(` [${i+1}] ${url}`));

fs.writeFileSync('stitch-screens/image_urls.json', JSON.stringify(arr, null, 2), 'utf8');
