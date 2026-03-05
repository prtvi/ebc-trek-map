const fs = require("fs").promises;
const os = require("os");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");
const sharp = require("sharp");

const execFileP = promisify(execFile);

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".tiff",
  ".tif",
  ".webp",
  ".heic",
]);

function isImageFile(filename) {
  return IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase());
}

function isHeic(filename) {
  return path.extname(filename).toLowerCase() === ".heic";
}

/**
 * On macOS, use built-in sips to decode HEIC (avoids libheif/HEVC plugin issues).
 * Returns a JPEG buffer or null if not macOS or sips fails.
 */
async function heicToJpegBufferViaSips(inputPath) {
  if (os.platform() !== "darwin") return null;
  const tempPath = path.join(
    os.tmpdir(),
    `heic-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
  );
  try {
    await execFileP("sips", [
      "-s",
      "format",
      "jpeg",
      inputPath,
      "--out",
      tempPath,
    ]);
    const buffer = await fs.readFile(tempPath);
    return buffer;
  } catch {
    return null;
  } finally {
    await fs.unlink(tempPath).catch(() => {});
  }
}

async function convertToWebp(buffer) {
  const sharpInstance = sharp(buffer).rotate(); // apply EXIF orientation so portrait stays portrait
  const metadata = await sharpInstance.metadata();

  if (metadata.width > 1000) {
    return sharpInstance.resize(1024, null).webp().toBuffer();
  }

  return sharpInstance.webp().toBuffer();
}

async function processDirectory(dirPath) {
  const resolved = path.resolve(dirPath);
  const stat = await fs.stat(resolved);
  if (!stat.isDirectory()) {
    console.error("Not a directory:", resolved);
    process.exit(1);
  }

  const entries = await fs.readdir(resolved, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && isImageFile(e.name))
    .map((e) => e.name);

  if (files.length === 0) {
    console.log("No image files found in", resolved);
    return;
  }

  const outputDir = path.join(resolved, "webp");
  await fs.mkdir(outputDir, { recursive: true });

  const filesWithTime = await Promise.all(
    files.map(async (file) => {
      const inputPath = path.join(resolved, file);
      const inputStat = await fs.stat(inputPath);
      const originalTime =
        inputStat.birthtime.getTime() > 0 ? inputStat.birthtime : inputStat.mtime;
      return { file, inputPath, originalTime };
    })
  );
  filesWithTime.sort((a, b) => a.originalTime - b.originalTime);

  const dayCounter = new Map();
  console.log(`Found ${files.length} image(s). Converting to .webp in ${outputDir} (grouped by day, named 1-n) ...`);

  for (const { file, inputPath, originalTime } of filesWithTime) {
    const d = originalTime;
    const dayDir =
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const n = (dayCounter.get(dayDir) ?? 0) + 1;
    dayCounter.set(dayDir, n);

    const dayOutputDir = path.join(outputDir, dayDir);
    await fs.mkdir(dayOutputDir, { recursive: true });
    const outputPath = path.join(dayOutputDir, `${n}.webp`);

    try {
      let buffer = await fs.readFile(inputPath);
      if (isHeic(file)) {
        const jpegBuffer = await heicToJpegBufferViaSips(inputPath);
        if (jpegBuffer) buffer = jpegBuffer;
      }
      const webpBuffer = await convertToWebp(buffer);
      await fs.writeFile(outputPath, webpBuffer);
      await fs.utimes(outputPath, originalTime, originalTime);
      console.log("  ", file, "->", dayDir + "/" + `${n}.webp`);
    } catch (err) {
      console.error("  Error processing", file, err.message);
    }
  }

  console.log("Done.");
}

const dir = process.argv[2];
if (!dir) {
  console.error("Usage: node imagesToWebp.js <directory-path>");
  process.exit(1);
}

processDirectory(dir).catch((err) => {
  console.error(err);
  process.exit(1);
});
