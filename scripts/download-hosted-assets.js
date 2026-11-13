const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const urls = JSON.parse(fs.readFileSync('stitch-screens/image_urls.json', 'utf8'));
const assetsDir = path.resolve('stitch-screens/assets');
fs.mkdirSync(assetsDir, { recursive: true });

console.log(`Downloading ${urls.length} hosted assets to stitch-screens/assets/...`);

const assetManifest = [];

urls.forEach((url, i) => {
  if (!url.startsWith('https://lh3.googleusercontent.com')) {
    return; // skip non-image urls like tailwind cdn
  }
  const filename = `asset_${String(i + 1).padStart(2, '0')}.jpg`;
  const filePath = path.join(assetsDir, filename);

  try {
    execSync(`curl -L -s -o "${filePath}" "${url}"`, { timeout: 15000 });
    const stat = fs.statSync(filePath);
    if (stat.size > 100) {
      console.log(`[${i + 1}/${urls.length}] Downloaded ${filename} (${(stat.size / 1024).toFixed(1)} KB)`);
      assetManifest.push({ index: i + 1, filename, size: stat.size, url });
    } else {
      fs.unlinkSync(filePath);
    }
  } catch (e) {
    console.error(`Failed ${url}: ${e.message}`);
  }
});

fs.writeFileSync('stitch-screens/assets_manifest.json', JSON.stringify(assetManifest, null, 2), 'utf8');
console.log(`\nDownloaded ${assetManifest.length} image assets successfully!`);
