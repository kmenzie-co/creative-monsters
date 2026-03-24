# Creative Monsters 👾

Creative Monsters is a playful MVP web app designed to inspire kids with daily creative challenges. Kids can draw, build, or craft anything offline, take a photo, and share it with the "Monster World" (after a quick review by the Monster Welcome Committee).

## ✨ Features

- **Daily Creative Prompt**: A new playful challenge every day (hardcoded in v1).
- **Monster Upload**: Simple image upload flow with name and nickname.
- **Moderation System**: Secure admin portal to approve or reject submissions.
- **Public Gallery**: A magical shared space to see all approved monster creations.
- **Playful Design**: Pixar-inspired aesthetics, micro-animations, and whimsical micro-copy.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Database & Storage**: [Supabase](https://supabase.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Analytics**: [PostHog](https://posthog.com/)

## 🛠️ Local Setup

1. **Clone the repository** and install dependencies:
   ```bash
   npm install
   ```

2. **Supabase Configuration**:
   - Create a new project in [Supabase](https://app.supabase.com/).
   - Go to the **SQL Editor** and run the script found in `supabase/schema.sql`.
 -- Set up Storage for monster images
-- NOTE: You must manually create a bucket named 'Uploaded Art' in the Supabase Dashboard
-- with Public Access enabled for the public gallery to work easily.

3. **Environment Variables**:
   - Rename `.env.local.example` to `.env.local`.
   - Fill in your Supabase URL, Anon Key, and Service Role Key (found in Project Settings > API).
   - Set an `ADMIN_PASSWORD` (default in code for MVP is `monster123`).

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the magic!

## 🛡️ Moderation

Access the admin portal at `/admin`.
- Use the password defined in your environment (or `monster123` for the initial test).
- Review pending monsters and click **Approve** to send them to the Public Gallery!

## 📈 Analytics

This project uses **PostHog** to track key engagement events:

- `prompt_viewed`: Triggered when the home page loads.
- `upload_started`: Triggered when a user clicks the final "Share your art!" button.
- `upload_completed`: Triggered after a successful submission.
- `gallery_viewed`: Triggered when the public gallery page is viewed.
- `submission_approved`: Triggered when an admin approves a monster.

### Setup
1. Create a PostHog project at [app.posthog.com](https://app.posthog.com).
2. Add your **Project API Key** to `.env.local`:
   ```env
   NEXT_PUBLIC_POSTHOG_KEY=your_key_here
   NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com (optional)
   ```
3. (Optional) Analytics are skipped during local development if the key is missing.

## 🎨 Creative Prompts

To update the daily prompt, simply edit `src/lib/constants.ts`.

---
*Made with ✨ magic and imagination for kids everywhere.*
