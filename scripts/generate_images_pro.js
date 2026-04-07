require('dotenv').config({ path: '.env.local' });
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GOOGLE_AI_STUDIO_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

const posts = JSON.parse(fs.readFileSync('data/batch_posts_2026.json', 'utf8'));

async function generate() {
  const refPath = 'public/assets/blog/character_ref.png';
  const refBytes = fs.readFileSync(refPath);

  for (let i = 0; i < 4; i++) {
    const post = posts[i];
    console.log(`[2026 NANO BANANA PRO] Rendering: ${post.title}`);

    const prompt = `A premium 3D claymation-render of the light-blue, pear-shaped monster from the attached reference. 
    CHARACTER: Smooth clay texture, exactly 4 white square teeth, wave wisp hair. 
    SCENE: The monster is ${post.hero_image_alt}. 
    QUALITY: High-fidelity Nano Banana Pro style, Soft 3D lighting, Clean white background.`;

    try {
      // Using the 2026 Imagen 4 / Nano Banana Pro model ID
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001', 
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png'
        },
      });

      if (response.generatedImages && response.generatedImages[0]) {
        const imageBytes = response.generatedImages[0].image.imageBytes;
        const filename = post.slug + '.png';
        fs.writeFileSync(path.join('public/assets/blog/', filename), imageBytes);
        console.log(`✅ Nano Banana Render Complete: ${filename}`);
      } else {
        console.error("❌ Model returned no image data.");
      }
    } catch (e) {
      console.error(`❌ Generation error: ${e.message}`);
    }
  }
  console.log("\n--- BATCH COMPLETE ---");
  console.log("Run 'git add -f public/assets/blog/*.png && git commit -m \"feat: nano banana illustrations\" && git push' to deploy.");
}

generate();
