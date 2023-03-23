// Required imports
import * as fs from "fs";
import * as path from "path";
import fontSpider from "font-spider";
import ttf2woff from "ttf2woff";
import ttf2woff2 from "ttf2woff2";

// Set input and output directories
const inputDir = "./src/locales";
const outputDir = "./tools/fonts/seaborn/glyphs";

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const fontMap = {
  zh_CN: ["noto-serif-sc", "Noto Serif SC"],
  en_US: ["noto-serif", "Noto Serif"],
  ja_JP: ["noto-serif-jp", "Noto Serif JP"],
  ko_KR: ["noto-serif-kr", "Noto Serif KR"],
};

function convertTTF2Woffs(path) {
  // convert ttf to woff
  const data = fs.readFileSync(path);
  const woff = ttf2woff(data, {});
  fs.writeFileSync(path.replace(/\.ttf$/, ".woff"), Buffer.from(woff.buffer));

  // convert ttf to woff2
  const woff2 = ttf2woff2(data);
  fs.writeFileSync(path.replace(/\.ttf$/, ".woff2"), Buffer.from(woff2.buffer));
}

// Iterate through JSON files
async function main() {
  for (const localeName of Object.keys(fontMap)) {
    const file = `${localeName}.json`;

    // Read JSON file
    const data = fs.readFileSync(path.join(inputDir, file), "utf-8");

    // Extract unique characters
    const dict = {};
    for (const char of data.split("")) {
      dict[char] = true;
    }
    if (fs.existsSync(path.join(inputDir, `${localeName}_x_seaborn.json`))) {
      const seabornData = fs.readFileSync(
        path.join(inputDir, `${localeName}_x_seaborn.json`),
        "utf-8"
      );
      for (const char of seabornData.split("")) {
        dict[char] = true;
      }
    }
    // add basic ascii chars
    for (let i = 32; i < 127; i++) {
      dict[String.fromCharCode(i)] = true;
    }
    const uniqueChars = [...Object.keys(dict)].sort().join("");

    const font = fontMap[localeName];

    // Generate HTML
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Unique Characters for ${localeName}</title>
      <style>
      @font-face {
        font-family: '${font[1]}';
        font-style: normal;
        font-display: swap;
        font-weight: 400;
        src: url('/Users/galvingao/WebstormProjects/penguin-stats-frontend/tools/fonts/seaborn/glyphs/shrinked/${font[0]}-400.ttf') format('truetype');
      }
      @font-face {
        font-family: '${font[1]}';
        font-style: normal;
        font-display: swap;
        font-weight: 700;
        src: url('/Users/galvingao/WebstormProjects/penguin-stats-frontend/tools/fonts/seaborn/glyphs/shrinked/${font[0]}-700.ttf') format('truetype');
      }
      </style>
      <style>
        .fwnormal { font-family: '${font[1]}', sans-serif; font-weight: 400; }
        .fwbold { font-family: '${font[1]}', sans-serif; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="fwnormal">${uniqueChars}</div>
      <div class="fwbold">${uniqueChars}</div>
    </body>
    </html>
  `;

    // Write HTML to output directory
    fs.writeFileSync(path.join(outputDir, `${localeName}.html`), html);

    const webFonts = await fontSpider.spider([
      path.join(outputDir, `${localeName}.html`),
    ]);

    console.log(webFonts);

    await fontSpider.compressor(webFonts, {
      backup: true,
    });

    convertTTF2Woffs(path.join(outputDir, "shrinked", `${font[0]}-400.ttf`));
    convertTTF2Woffs(path.join(outputDir, "shrinked", `${font[0]}-700.ttf`));
  }
}

main();
