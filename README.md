# MBA Skills Index

The first platform to compare business schools to the actual job market.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data Files

Place these in `/public/data/`:

- `school_scores_united_states.json` ✅
- `school_scores_illinois.json` ✅
- `skills_results_united_states_LABELED.json` (optional, for future features)
- `skills_results_illinois_LABELED.json` (optional, for future features)
- `jobs_db.json` (for live job ticker — optional, fallback data used if missing)

## Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/mba-skills-index.git
git push -u origin main

# 2. Go to vercel.com → New Project → Import GitHub repo
# 3. Framework: Next.js (auto-detected)
# 4. Deploy
```

## Adding More Schools

When `school_scores_united_states.json` is updated with more scored schools, they automatically appear in the search and leaderboard. No code changes needed.

## Pages

- `/` — Landing page with search, leaderboard, job ticker
- `/school/[slug]` — Individual school radar chart + analysis
- `/methodology` — Full 7-step methodology with scroll-animated timeline

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Recharts (radar charts)
- Framer Motion (animations)
- Google Fonts: Playfair Display + DM Sans + JetBrains Mono
