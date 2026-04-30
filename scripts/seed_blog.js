const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://koqgimbqryaxigwjykau.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // THIS IS THE SERVICE ROLE KEY

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const dataPath = path.join(__dirname, '../data/batch_posts_2026.json');
  if (!fs.existsSync(dataPath)) {
    console.error('Data file not found at:', dataPath);
    return;
  }

  const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log('--- SEEDING BLOG POSTS ---');
  console.log(`Found ${posts.length} posts to insert.`);

  // Insert in chunks of 10 to avoid timeouts
  const chunkSize = 10;
  for (let i = 0; i < posts.length; i += chunkSize) {
    const chunk = posts.slice(i, i + chunkSize);
    console.log(`Inserting batch ${Math.floor(i / chunkSize) + 1}...`);

    const { error } = await supabase
      .from('posts')
      .upsert(chunk, { onConflict: 'slug' });

    if (error) {
      console.error('Error inserting batch:', error.message);
      if (error.code === 'PGRST204') {
        console.error('TABLE NOT FOUND. Please run the SQL in supabase_schema.sql first!');
        break;
      }
    }
  }

  console.log('--- SEEDING COMPLETE ---');
}

seed();
