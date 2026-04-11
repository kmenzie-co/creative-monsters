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
    const filename = post.slug + '.png';
    
    const environments = [
      "at a bright wooden craft table, happily building a smaller character out of a cardboard egg carton and plastic bottle caps.",
      "in a lush green garden, arranging pebbles and leaves into a circular pattern on the ground.",
      "sitting on a grassy hilltop next to a recycling bin, holding a small globe-shaped balloon.",
      "at a small desk, holding a giant pink crayon and decorating a heart-shaped card with glitter."
    ];

    const env = environments[i] || "in a fun creative environment.";
    
    const prompt = `
IMPORTANT: The character must remain IDENTICAL to the input image.

CRITICAL FEATURES (must not change):
- Smooth round pear-shaped head
- Absolutely NO horns, NO spikes, NO bumps
- Single soft curl of hair on the very top (and nothing else)
- Smooth matte light-blue clay skin
- Large eyes with same proportions

Do not remove, alter, or reinterpret any of these features.

This specific blue character is ${env}

Soft cinematic lighting. Preserve original clay style.
`;

    console.log(`\n[${i+1}/4] 🛶 NANO BANANA PRO (MAX LIKENESS): ${post.title}`);
    
    try {
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001', 
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          image: {
            imageBytes: refBytes.toString('base64'),
            mimeType: 'image/png'
          },
          imageStrength: 0.95
        }
      });

      if (response.generatedImages && response.generatedImages[0]) {
        console.log(`   └─ 📉 Data Received. Decoding ...`);
        const imageBytes = response.generatedImages[0].image.imageBytes;
        fs.writeFileSync(path.join('public/assets/blog/', filename), Buffer.from(imageBytes, 'base64'));
        console.log(`   └─ ✅ SUCCESS: Saved to public/assets/blog/${filename}`);
      } else {
        console.error("   └─ ❌ ERROR: API didn't return image data.");
      }
    } catch (e) {
      console.error(`   └─ ❌ API ERROR: ${e.message}`);
    }
  }
}

generate();
