# 🚀 Deployment Guide: Creative Monsters

Follow these steps to take your "Creative Monsters" app from local development to a live URL on GitHub and Vercel.

## 1. Move to GitHub

If you haven't initialized a git repository yet, run these commands in your terminal:

```bash
# 1. Initialize git
git init

# 2. Add all files
git add .

# 3. Create your first commit
git commit -m "feat: initial launch of Creative Monsters MVP"

# 4. Create a new repository on GitHub.com (do not initialize with README)
# 5. Link your local repo to GitHub (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/creative-monsters.git

# 6. Push your code
git branch -M main
git push -u origin main
```

---

## 2. Deploy to Vercel

1.  **Sign in to [Vercel](https://vercel.com)** using your GitHub account.
2.  Click **"Add New..."** and select **"Project"**.
3.  Import your `creative-monsters` repository.
4.  **Configure Environment Variables**: This is the most important step! Expand the "Environment Variables" section and add the following from your `.env.local`:

| Variable Name | Value (from your .env.local) |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` |
| `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key` (Used for Admin actions) |
| `ADMIN_PASSWORD` | `monster123` (or your preferred admin password) |

5.  Click **"Deploy"**. Vercel will build your app and give you a live URL in about 2 minutes!

---

## 3. Post-Deployment Checklist

### ✅ Supabase Permissions
Ensure your "Uploaded Art" bucket in Supabase is set to **Public** so that user creations can be seen in the Gallery.

### ✅ Database Sync
If you haven't already, make sure to run the **[`supabase/seed_prompts.sql`](file:///Users/kmenzie/Documents/Antigravity/Creative%20Monsters/supabase/seed_prompts.sql)** in your Supabase SQL Editor to activate the 2026 daily prompts.

### ✅ Domain Setup (Optional)
In Vercel, you can go to **Settings > Domains** to add a custom domain (e.g., `creativemonsters.com`) if you have one.

---

**That's it! Your Creative Monsters are ready to roam the web. 👾🚀**
