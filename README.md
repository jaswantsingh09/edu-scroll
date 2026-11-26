# EduScroll

A mobile-first **PWA that works like Instagram Reels, but every swipe teaches you something**.
On first launch you pick the topics you care about; the feed then serves full-screen, swipeable
lesson cards and quick quizzes for those topics — endlessly.

## Features

- **Onboarding topic picker**: Space, Human Body, History, Psychology, Money, Physics, Coding, Animals & Nature, Geography, Art & Culture
- **Reels-style vertical feed**: full-screen snap scrolling, double-tap to like, save, share, "read more"
- **Endless content**: hand-written starter cards (load instantly, work offline) plus live article intros from the Wikipedia API for each topic
- **Quizzes mixed into the feed** every few cards, including auto-generated "which one is this?" quizzes from fresh content
- **Topic filter chips** ("For you" or a single topic)
- **Progress**: daily streak, cards learned, quiz accuracy; a **Saved** tab for review
- **Installable PWA**: manifest, icons, and a service worker that caches the app shell and recently viewed content
- No backend, no account: everything is stored locally in the browser

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173 (also exposed on your LAN for testing on a phone)
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build (service worker enabled)
```

To install on a phone, deploy `dist/` to any static host with HTTPS (Vercel, Netlify, Cloudflare Pages, GitHub Pages),
open it in the mobile browser, then choose **Add to Home Screen**.

## Project layout

```
src/
  data/topics.ts        topics, colors, Wikipedia search seeds, curated cards + quizzes
  lib/feed.ts           FeedEngine: mixes curated, Wikipedia and quiz cards into an endless stream
  lib/storage.ts        localStorage persistence, streak logic
  components/           Onboarding, Feed, FactCardView, QuizCardView, Saved, Profile, TopicPicker
scripts/make-icons.mjs  renders public/icon.svg to PNG icons (needs Playwright)
```

## Adding content

- **New curated card**: add an `f(...)` or `q(...)` entry to `CURATED` in `src/data/topics.ts`.
- **New topic**: add a `Topic` to `TOPICS` with an emoji, two gradient colors and a few Wikipedia search queries.

## Ideas for next steps

- AI-generated lessons and quizzes per topic (e.g. via the Claude API behind a small serverless function)
- Short video or audio narration per card
- Spaced-repetition review of saved and missed-quiz cards
- Accounts and sync across devices
