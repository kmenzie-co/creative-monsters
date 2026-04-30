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

async function processPosts() {
  const dataPath = path.join(__dirname, '../data/batch_posts_2026.json');
  const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  console.log(`Processing ${posts.length} posts...`);
  
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    
    // Check if it already looks updated (has "Step 1" or something)
    if (post.body_markdown.includes("Step 1:") || post.body_markdown.length > 800) {
      // Actually we'll just rewrite everything if we run it, 
      // but maybe it's better to force a rewrite.
    }

    console.log(`Processing ${i + 1}/${posts.length}: ${post.title}`);
    
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
      
      // Save progressively in case it crashes
      fs.writeFileSync(dataPath, JSON.stringify(posts, null, 2));
      
      // delay to avoid rate limits
      await new Promise(r => setTimeout(r, 1500));
    } catch (error) {
      console.error(`Error on post ${i + 1}:`, error.message);
    }
  }
  
  console.log('Finished processing posts.');
}

processPosts();
