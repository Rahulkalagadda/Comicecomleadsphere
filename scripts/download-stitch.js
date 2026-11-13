const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const jsonPath = 'C:/Users/Dell/.gemini/antigravity-ide/brain/76552b7f-9352-4858-80a9-939c0ae6c29b/.system_generated/steps/681/output.txt';
const raw = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(raw);

const targetDir = path.resolve('stitch-screens');
const imagesDir = path.join(targetDir, 'images');
const htmlDir = path.join(targetDir, 'html');

fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(htmlDir, { recursive: true });

const screensManifest = [];

data.screens.forEach((screen, idx) => {
  const sid = screen.name.split('/').pop();
  const safeTitle = screen.title.replace(/[^a-zA-Z0-9_\-]/g, '_').toLowerCase();
  const prefix = `${String(idx + 1).padStart(2, '0')}_${sid.substring(0, 8)}_${safeTitle}`;

  const shotUrl = screen.screenshot?.downloadUrl;
  const htmlUrl = screen.htmlCode?.downloadUrl;

  const imageFile = `${prefix}.png`;
  const htmlFile = `${prefix}.html`;

  const imagePath = path.join(imagesDir, imageFile);
  const htmlPath = path.join(htmlDir, htmlFile);

  console.log(`\n[${idx + 1}/${data.screens.length}] Downloading: ${screen.title} (${sid})`);

  if (shotUrl) {
    try {
      console.log(`  Downloading screenshot -> ${imageFile}`);
      execSync(`curl -L -s -o "${imagePath}" "${shotUrl}"`, { timeout: 30000 });
      const stat = fs.statSync(imagePath);
      console.log(`    Success (${(stat.size / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`    Failed to download image:`, e.message);
    }
  }

  if (htmlUrl) {
    try {
      console.log(`  Downloading HTML code -> ${htmlFile}`);
      execSync(`curl -L -s -o "${htmlPath}" "${htmlUrl}"`, { timeout: 30000 });
      const stat = fs.statSync(htmlPath);
      console.log(`    Success (${(stat.size / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`    Failed to download HTML:`, e.message);
    }
  }

  screensManifest.push({
    index: idx + 1,
    id: sid,
    title: screen.title,
    width: screen.width,
    height: screen.height,
    imageFile: `stitch-screens/images/${imageFile}`,
    htmlFile: `stitch-screens/html/${htmlFile}`,
  });
});

fs.writeFileSync(path.join(targetDir, 'manifest.json'), JSON.stringify(screensManifest, null, 2), 'utf8');
console.log('\nManifest written to stitch-screens/manifest.json');
