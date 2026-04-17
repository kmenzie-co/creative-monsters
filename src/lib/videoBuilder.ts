import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import ffmpeg from 'fluent-ffmpeg';

// Safely require the ffmpeg installer to bypass strict Next.js webpack parsing
const installerPath = (() => {
  try {
    return require('@ffmpeg-installer/ffmpeg').path;
  } catch (e) {
    console.error("Failed to load @ffmpeg-installer/ffmpeg local binary. Install it locally.");
    return 'ffmpeg'; // Default fallback back to global system ffmpeg
  }
})();

// Set ffmpeg path using the platform-specific binary
ffmpeg.setFfmpegPath(installerPath);

/**
 * Downloads a video from a URL and saves it to a temporary local path.
 */
async function downloadVideo(url: string, outputPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download from ${url}`);
  
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
}

/**
 * Splices three videos together seamlessly using FFmpeg.
 * Intros and Outros come dynamically from Runway endpoints (HTTP URLs).
 * The core video is local.
 */
export async function concatenateClassVideo(
  childName: string,
  classId: string,
  introUrl: string,
  outroUrl: string,
  coreVideoUrl: string
): Promise<string> {
  const videoDir = path.join(process.cwd(), 'public', 'videos', 'generated');
  const tempDir = path.join(process.cwd(), 'tmp_video_processing');
  
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const safeName = childName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const finalFilename = `${safeName}_${classId}_class.mp4`;
  const tempIntroPath = path.join(tempDir, `${safeName}_${classId}_intro.mp4`);
  const tempOutroPath = path.join(tempDir, `${safeName}_${classId}_outro.mp4`);
  const tempCorePath = path.join(tempDir, `${classId}_core.mp4`);
  const finalPath = path.join(videoDir, finalFilename);

  // Download core video if not already cached in temp
  if (!fs.existsSync(tempCorePath)) {
    console.log(`[videoBuilder] Downloading core video for class ${classId}...`);
    await downloadVideo(coreVideoUrl, tempCorePath);
  }

  console.log(`[videoBuilder] Downloading intro for ${childName}...`);
  await downloadVideo(introUrl, tempIntroPath);
  
  console.log(`[videoBuilder] Downloading outro for ${childName}...`);
  await downloadVideo(outroUrl, tempOutroPath);

  console.log(`[videoBuilder] Launching FFmpeg combination for ${childName}...`);

  return new Promise((resolve, reject) => {
    // Generate a temporary file containing the inputs for the concat demuxer format
    // file 'path/to/intro.mp4'
    // file 'path/to/core.mp4'
    const listFilePath = path.join(tempDir, `${safeName}_${classId}_list.txt`);
    const fileListContent = `file '${tempIntroPath}'\nfile '${tempCorePath}'\nfile '${tempOutroPath}'`;
    fs.writeFileSync(listFilePath, fileListContent, 'utf-8');

    ffmpeg()
      .input(listFilePath)
      .inputOptions(['-f concat', '-safe 0'])
      // Re-encode video and audio streams to ensure consistency across chunks 
      // where Runway specs might slightly misalign with the local Core MP4 specs
      .outputOptions([
        '-c:v libx264',
        '-c:a aac',
        '-vsync 2',
        '-preset fast' // Speeds up the encode locally
      ])
      .save(finalPath)
      .on('start', (cmd: string) => {
        console.log(`[videoBuilder] FFmpeg stated with command: ${cmd}`);
      })
      .on('end', () => {
        console.log(`[videoBuilder] Success generating ${finalPath}`);
        
        // Clean up temporary files safely
        try {
          fs.unlinkSync(tempIntroPath);
          fs.unlinkSync(tempOutroPath);
          fs.unlinkSync(listFilePath);
        } catch (cleanupErr) {
          console.warn(`[videoBuilder] Cleanup warning:`, cleanupErr);
        }
        
        // Return relative browser path
        resolve(`/videos/generated/${finalFilename}`);
      })
      .on('error', (err: any) => {
        console.error(`[videoBuilder] FFmpeg rendering error:`, err);
        reject(err);
      });
  });
}
