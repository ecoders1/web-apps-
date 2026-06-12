# Changelog

All notable changes to **Exit Exam Ethiopia** are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-06-10

### Added
- Next.js 16 App Router with Tailwind CSS v4
- Supabase authentication (email/password)
- Supabase database with full RLS policies
- Home page: hero, stats counter, features, CTA, footer
- Navigation: responsive navbar with dark/light mode toggle
- Universities listing page
- Departments listing page
- Exams listing page with search and download
- About page
- Contact page with form
- Login page with show/hide password
- Register page with password strength meter
- Student dashboard with progress stats
- 404 not-found page
- Dark mode via next-themes
- Full admin panel (restricted to iyasu4313@gmail.com)
  - Admin dashboard with live stats
  - Universities CRUD (create, read, update, delete)
  - Departments CRUD
  - Exams CRUD with publish/unpublish toggle
  - Students/Users listing
- Auto-push to GitHub hook on file save
- Supabase schema with seed data
- Vercel deployment config

### Security
- Admin routes protected by email allowlist
- Supabase RLS policies on all tables
- .env.local excluded from git

---

## [0.1.0] — 2026-06-10

### Added
- Initial project scaffold with create-next-app
- Tailwind CSS, TypeScript, ESLint configuration
