const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(fs.readFileSync('stitch-screens/manifest.json', 'utf8'));

console.log('Total screens:', manifest.length);

manifest.forEach(item => {
  const htmlPath = path.resolve(item.htmlFile);
  if (!fs.existsSync(htmlPath)) return;
  const content = fs.readFileSync(htmlPath, 'utf8');

  // Find colors (hex)
  const hexes = content.match(/#[0-9a-fA-F]{3,8}/g) || [];
  const colorCounts = {};
  hexes.forEach(c => {
    const norm = c.toLowerCase();
    colorCounts[norm] = (colorCounts[norm] || 0) + 1;
  });
  const topColors = Object.entries(colorCounts).sort((a,b) => b[1] - a[1]).slice(0, 8);

  // Find fonts
  const fonts = [...new Set(content.match(/family=([^&"']+)/g) || [])];

  // Find main headings
  const h1s = [...content.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const h2s = [...content.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).slice(0, 5);

  console.log(`\n==================================================`);
  console.log(`[Screen ${item.index}] ${item.title}`);
  console.log(`ID: ${item.id}`);
  console.log(`Dimensions: ${item.width} x ${item.height}`);
  console.log(`Headings: H1 = "${h1s[0] || 'N/A'}"`);
  console.log(`H2s:`, h2s);
  console.log(`Fonts:`, fonts);
  console.log(`Top Colors:`, topColors.map(([c, n]) => `${c} (${n})`).join(', '));
});
