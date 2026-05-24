const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const apiKey = process.env.GOOGLE_AI_STUDIO_KEY;
if (!apiKey) {
  console.error("No GOOGLE_AI_STUDIO_KEY found in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const dataPath = path.join(__dirname, '../data/batch_posts_2026.json');
let posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

async function processPost(post, index, total) {
  // We'll run this on all of them just to be sure.
  const prompt = `You are editing a blog post markdown. The friendly blue monster character has been accidentally named various things (like Fuzz, Pip, Azul, Blorg, Blob, Creature, etc.). 
The character's name MUST be "Fig".

Please read the following blog post body and replace the monster character's name with "Fig" wherever it appears.
For example, change "Pip's" to "Fig's", "Fuzz" to "Fig", etc.
DO NOT change anything else in the text. Output ONLY the updated markdown text, with no conversational wrapper.

Text:
${post.body_markdown}
`;

  try {
    const result = await model.generateContent(prompt);
    let newBody = result.response.text().trim();
    
    if (newBody.startsWith("```markdown")) {
      newBody = newBody.substring(11);
    }
    if (newBody.startsWith("```")) {
      newBody = newBody.substring(3);
    }
    if (newBody.endsWith("```")) {
      newBody = newBody.substring(0, newBody.length - 3);
    }
    
    post.body_markdown = newBody.trim();
    console.log(`Completed ${index + 1}/${total}: ${post.title}`);
  } catch (error) {
    console.error(`Error on post ${index + 1}:`, error.message);
  }
}

async function fixNames() {
  console.log(`Fixing names in ${posts.length} posts concurrently...`);
  
  const concurrency = 10;
  for (let i = 0; i < posts.length; i += concurrency) {
    const batch = posts.slice(i, i + concurrency);
    console.log(`Processing batch ${i/concurrency + 1}...`);
    
    const promises = batch.map((post, idx) => processPost(post, i + idx, posts.length));
    await Promise.all(promises);
    
    // Save progressive
    fs.writeFileSync(dataPath, JSON.stringify(posts, null, 2));
    
    // wait a bit between batches to avoid rate limit
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('Finished fixing names in all posts.');
}

fixNames();
