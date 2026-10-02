# Barina Shafique Portfolio

A modern, sci-fi themed portfolio website for Barina Shafique — CS graduate and Masters scholarship applicant.

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Animations**: GSAP + ScrollTrigger
- **Styling**: CSS Modules + Custom Design System
- **Data**: JSON files in `/src/data/`
- **Admin**: Password-protected dashboard at `/admin`

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the portfolio.  
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin panel.

## Admin Panel

Default password: `barina2024admin`

Set `ADMIN_PASSWORD` in `.env.local` to change it.

### Features
- Edit personal info (name, bio, email, social links)
- CRUD for Projects (add, edit, delete, mark featured)
- Edit Research Interests
- View/manage Publications and Skills

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Add environment variables:
   - `ADMIN_PASSWORD` — your secure admin password
4. Deploy!

> **Note**: The admin save feature uses `fs` (filesystem write). On Vercel, this only works in development. For production, you'll need to switch to a database (Vercel KV, Supabase, or similar) for persistent data changes.

## Sections
1. Hero — Animated name reveal, typing effect
2. About — Bio, stats, code card
3. Research Interests — Interactive topic cards
4. Projects — Filterable grid with detail modals
5. Skills — Category tabs with animated bars
6. Publications — Academic paper list
7. Resume — Education/experience timeline
8. Contact — Contact form + social links

## Adding a Profile Photo

Replace `/public/profile.jpg` with Barina's actual photo. The hero section will automatically display it.
