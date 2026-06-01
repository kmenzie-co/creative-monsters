const { createClient } = require('@supabase/supabase-js');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://koqgimbqryaxigwjykau.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const { data, error } = await supabase
    .from('posts')
    .select('slug, title, body_markdown, publish_date')
    .in('slug', ['the-creative-monster-guide-to-end-of-school-week-8', 'the-creative-monster-guide-to-end-of-school-week-9']);

  if (error) {
    console.error('Error:', error);
    return;
  }

  data.forEach(post => {
    console.log(`=== SLUG: ${post.slug} (${post.publish_date}) ===`);
    console.log(`Title: ${post.title}`);
    console.log(`Body length: ${post.body_markdown.length}`);
    console.log(`First 200 chars: ${post.body_markdown.substring(0, 200)}...`);
    console.log(`===========================================\n`);
  });
}

inspect();
