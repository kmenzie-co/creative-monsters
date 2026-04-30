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
  // Skip if already processed (has multiple headings)
  if (post.body_markdown.includes("### Step-by-Step Instructions")) {
    console.log(`Skipping ${index + 1}/${total}: ${post.title} (already processed)`);
    return;
  }

  const prompt = `You are a blog writer for "Creative Monsters", a children's art platform where a friendly blue monster guides activities.
Please rewrite the following blog post body to be more specific about the project mentioned in the title.
Include specific materials needed for this exact project, and detailed step-by-step instructions. Keep the playful, encouraging tone. Don't add a title heading since that's rendered separately. Do use markdown headings like ### Materials Needed and ### Step-by-Step Instructions.

Title: ${post.title}
Tags: ${post.category_tags.join(', ')}

Output ONLY the new markdown text. No conversational wrapper.`;

  try {
    const result = await model.generateContent(prompt);
    let newBody = result.response.text().trim();
    
    // strip out ```markdown if it exists
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

async function processConcurrent() {
  console.log(`Processing ${posts.length} posts concurrently...`);
  
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
  
  console.log('Finished processing all posts.');
}

processConcurrent();
