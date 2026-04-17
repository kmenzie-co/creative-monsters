const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const installerPath = (() => {
  try {
    return require('@ffmpeg-installer/ffmpeg').path;
  } catch (e) {
    return 'ffmpeg';
  }
})();

ffmpeg.setFfmpegPath(installerPath);

const tempDir = path.join(process.cwd(), 'tmp_video_processing');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const tempIntroPath = path.join(tempDir, 'test_intro.mp4');
const tempOutroPath = path.join(tempDir, 'test_outro.mp4');
const coreVideoPath = path.join(process.cwd(), 'public', 'videos', 'core.mp4');
const outPath = path.join(tempDir, 'out.mp4');

// Create dummy files if they don't exist
if (!fs.existsSync(tempIntroPath)) fs.copyFileSync(coreVideoPath, tempIntroPath);
if (!fs.existsSync(tempOutroPath)) fs.copyFileSync(coreVideoPath, tempOutroPath);

const listFilePath = path.join(tempDir, `test_list.txt`);
const fileListContent = `file '${tempIntroPath}'\nfile '${coreVideoPath}'\nfile '${tempOutroPath}'`;
fs.writeFileSync(listFilePath, fileListContent, 'utf-8');

console.log("Starting ffmpeg test using", installerPath);

ffmpeg()
  .input(listFilePath)
  .inputOptions(['-f concat', '-safe 0'])
  .outputOptions([
    '-c:v libx264',
    '-c:a aac',
    '-fps_mode vfr',
    '-preset fast'
  ])
  .save(outPath)
  .on('start', (cmd) => {
    console.log("Started:", cmd);
  })
  .on('end', () => {
    console.log("Success!");
  })
  .on('error', (err) => {
    console.error("FFmpeg Error:", err.message);
  });
