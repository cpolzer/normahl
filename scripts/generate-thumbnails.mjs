import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const pressDir = 'public/images/presse';
const heroDir = 'public/images/hero';

const heroImages = [
  { src: 'public/images/presse/fotoshooting_lutz_20.01.2020/p9V8A0278-2.tif', dst: 'public/images/hero/hero-1.jpg', max: 1920 },
  { src: 'public/images/presse/fotoshooting_lutz_20.01.2020/p9V8A0339.tif', dst: 'public/images/hero/hero-2.jpg', max: 1920 },
  { src: 'public/images/presse/fotoshooting_lutz_20.01.2020/p9V8A0452.tif', dst: 'public/images/hero/hero-3.jpg', max: 1920 },
];

const pressImages = [
  { src: 'public/images/presse/fotoshooting_lutz_20.01.2020/p9V8A0278-2.tif', dst: 'public/images/presse/band-1.jpg', max: 600 },
  { src: 'public/images/presse/fotoshooting_lutz_20.01.2020/p9V8A0339.tif', dst: 'public/images/presse/band-2.jpg', max: 600 },
  { src: 'public/images/presse/fotoshooting_lutz_20.01.2020/p9V8A0452.tif', dst: 'public/images/presse/band-3.jpg', max: 600 },
];

console.log('Generating optimized thumbnails...\n');

async function generate() {
  // Hero images (1920px max for background)
  for (const img of heroImages) {
    if (!fs.existsSync(img.src)) {
      console.log(`Source not found: ${img.src}`);
      continue;
    }
    console.log(`Creating ${img.dst} (${img.max}px)...`);
    await sharp(img.src)
      .resize(img.max, img.max, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(img.dst);
    console.log(`  ${Math.round(fs.statSync(img.dst).size / 1024)}KB`);
  }

  // Press thumbnails (600px for previews)
  for (const img of pressImages) {
    if (!fs.existsSync(img.src)) continue;
    console.log(`Creating ${img.dst} (${img.max}px)...`);
    await sharp(img.src)
      .resize(img.max, img.max, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(img.dst);
    console.log(`  ${Math.round(fs.statSync(img.dst).size / 1024)}KB`);
  }
  
  console.log('\nDone!');
}

generate();