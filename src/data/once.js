const fs = require("fs");
const path = require("path");

// Find project root based on this file location
const rootDir = path.resolve(__dirname, "../../");

// Paths
const mapsDir = path.join(rootDir, "public/maps");
const dataFile = path.join(rootDir, "src/data/maps.js");

// Load mapData
let mapData = require(dataFile).mapData;

// Helper: generate random 6-char string
function randomName() {
  return Math.random().toString(36).substring(2, 8);
}

// Rename files + update entries
mapData = mapData.map(map => {
  const ext = path.extname(map.img);
  const oldFile = path.basename(map.img);
  const oldPath = path.join(mapsDir, oldFile);

  const newFileName = randomName() + ext;
  const newPath = path.join(mapsDir, newFileName);

  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed ${oldFile} → ${newFileName}`);
  } else {
    console.warn(`File not found: ${oldFile}`);
  }

  return { ...map, img: `/maps/${newFileName}` };
});

// Write updated mapData back to maps.js
const output = `export const mapData = ${JSON.stringify(mapData, null, 2)};\n`;

fs.writeFileSync(dataFile, output, "utf8");
console.log("Updated src/data/maps.js with new filenames.");
