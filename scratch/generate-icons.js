// scratch/generate-icons.js
const { Jimp } = require('jimp');

const grid = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0],
  [0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0],
  [0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

async function main() {
  console.log('Generating PWA icons using Jimp...');
  
  // 512x512
  const image512 = new Jimp({ width: 512, height: 512, color: 0x0a0a0aff });
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      if (grid[y][x] === 1) {
        for (let dy = 0; dy < 32; dy++) {
          for (let dx = 0; dx < 32; dx++) {
            image512.setPixelColor(0xffffffff, x * 32 + dx, y * 32 + dy);
          }
        }
      }
    }
  }
  await image512.write('public/icon-512.png');
  console.log('Created public/icon-512.png');

  // 192x192
  const image192 = new Jimp({ width: 192, height: 192, color: 0x0a0a0aff });
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      if (grid[y][x] === 1) {
        for (let dy = 0; dy < 12; dy++) {
          for (let dx = 0; dx < 12; dx++) {
            image192.setPixelColor(0xffffffff, x * 12 + dx, y * 12 + dy);
          }
        }
      }
    }
  }
  await image192.write('public/icon-192.png');
  console.log('Created public/icon-192.png');
  
  console.log('Icon generation successful!');
}

main().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
