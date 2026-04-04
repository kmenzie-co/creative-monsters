# Creative Monsters Weekly Batch Generation Plan

The goal is to generate 52 blog posts (one full year) for the Creative Monsters blog, starting from Monday, April 6, 2026.

## Content Calendar Logic
- **Start Date**: April 6, 2026 (Monday)
- **Time**: 07:00 AM
- **Post Types**:
  - `roundup`: Week A - Themed Activity Roundup
  - `developmental`: Week B - Educational / Developmental Post
  - `seasonal`: Week C - Seasonal / Holiday Content
- **Override**: If within 28 days of a major holiday, generate a `seasonal` post. Resume rotation after.

## Seasonal Moments (2026-2027)
1. **April 22**: Earth Day (Seasonal window: March 25 - April 22)
2. **May 10**: Mother's Day (Seasonal window: April 12 - May 10)
3. **June 14**: End of School Year (Seasonal window: May 17 - June 14)
4. **June 21**: Father's Day & Summer Start (Seasonal window: May 24 - June 21)
5. **July 4**: Independence Day (Seasonal window: June 6 - July 4)
6. **Aug 15**: Back to School (Seasonal window: July 18 - Aug 15)
7. **Sept 22**: Fall Start (Seasonal window: Aug 25 - Sept 22)
8. **Oct 31**: Halloween (Seasonal window: Oct 3 - Oct 31)
9. **Nov 26**: Thanksgiving (Seasonal window: Oct 29 - Nov 26)
10. **Dec 25**: Christmas / Winter Break (Seasonal window: Nov 27 - Dec 25)
11. **Jan 1**: New Year (Seasonal window: Dec 4 - Jan 1)
12. **Feb 14**: Valentine's Day (Seasonal window: Jan 17 - Feb 14)
13. **March 17**: St. Patrick's Day (Seasonal window: Feb 17 - March 17)
14. **March 20**: Spring Start (Seasonal window: Feb 20 - March 20)

## Implementation Steps
### 1. Database Schema Sync
- Ensure the Supabase `posts` table exists with the specified schema.
- Schema: `slug`, `title`, `meta_description`, `post_type`, `category_tags`, `body_markdown`, `hero_image_path`, `hero_image_alt`, `publish_date`, `status`.

### 2. Content Generation Script
- Run a loop 52 times.
- Calculate `publish_date` and `post_type`.
- Generate SEO-optimized titles, meta descriptions, and body content using my LLM capability.
- Save to an array.

### 3. Image Generation
- For each post, generate a hero image featuring the "Creative Monsters" blue monster.
- Save to `/public/assets/blog/` with names matching slugs.

### 4. Database Insertion
- Use `supabaseAdmin` to insert all records.

### 5. Frontend & SEO Updates
- Create `src/app/blog/page.tsx` (Index).
- Create `src/app/blog/[slug]/page.tsx` (Dynamic post page).
- Update `public/sitemap.xml` with the new URLs.

### 6. Verification
- Verify the blog index filters by `publish_date <= now()`.
- Verify the future posts are "hidden" from public but available for preview.

---

## Post Type Details
### Type A: roundup
- **Target**: Engaging themes for kids' activities.
- **Content**: 7-10 curated activities with intro and conclusion.
### Type B: developmental
- **Target**: Educational growth, skill-building.
- **Content**: Focus on drawing, creativity, or emotional development through art.
### Type C: seasonal
- **Target**: Timely themes (Easter, Earth Day, Spring, etc.).
- **Content**: Season-specific creative projects.

---

## 52 Week Schedule (Draft)
1. **Apr 6, 2026**: Earth Day (Seasonal) —— Window for Earth Day (Apr 22).
2. **Apr 13, 2026**: Earth Day / Mother's Day (Seasonal) —— Window for Earth Day (Apr 22) and Mother's Day (May 10).
3. **Apr 20, 2026**: Earth Day (Seasonal)
4. **Apr 27, 2026**: Mother's Day (Seasonal)
5. **May 4, 2026**: Mother's Day (Seasonal)
6. **May 11, 2026**: Roundup (A) —— Resume rotation.
... and so on.
