# DefinitelyFAKENEWS

A global satire / parody news website — in the spirit of *The Onion* and
nenovinite.com, but in English and worldwide. **Everything published is fiction.**

Built with Next.js (App Router) + Tailwind CSS. Content is plain Markdown files,
so there's **no database and no hosting cost** — and it's trivial to automate later.

---

## Run it locally

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

Build a production version:

```bash
npm run build
npm start
```

---

## 🔒 Admin login (single hidden account)

There is **one** admin account and **no public link to it anywhere**. The login
form lives only at a secret URL:

```
https://yourdomain.com/adminlogin
```

`/admin` and `/admin/ads` simply return **404** to anyone who isn't signed in —
so the admin area is invisible. The publish/ads APIs reject unauthenticated
requests too.

Set your credentials in `.env.local` (copy from `.env.example`):

- `ADMIN_USER` — your username
- `ADMIN_PASSWORD` — your password
- `ADMIN_SECRET` — any long random string (signs the session cookie)

Then restart `npm run dev`, go to `/adminlogin`, and sign in. The session lasts
30 days; there's a **Log out** link in the admin bar.

When you deploy, set the same three as Environment Variables in your host's
dashboard (Vercel/Netlify). `.env.local` is git-ignored, so your credentials
never go into the repo. **To change username/password later, just edit those env
values** — no code changes.

---

## ✍️ How to publish an article — the easy way (Publishing Studio)

While running locally (`npm run dev`), and **logged in** (via `/adminlogin`):

1. Open **<http://localhost:3000/admin>** (the Publishing Studio).
2. Type or paste the headline and the article text, pick a category, and
   **upload a photo** (or leave it blank for an auto-generated placeholder).
3. Click **Publish Article**.

That's it. The studio automatically:

- turns your text + photo into a Markdown file in `content/articles/`,
- saves the image into `public/img/`,
- generates the URL slug, the date (today), and the excerpt,
- and the article appears on the site immediately.

To put it on the **live** site afterwards, commit & push (or redeploy) — see below.

### 🗂 Bulk Upload (many articles at once)

Open **`/admin/batch`** ("Bulk Upload" in the admin nav). Paste several finished
articles into one box using this format (each `TITLE:` starts a new article; a
`===` separator is optional):

```
TITLE: Headline In Title Case
CATEGORY: world
AUTHOR: Funny Byline
EXCERPT: One-line summary.
BODY:
First paragraph.

Second paragraph.

===

TITLE: Next Headline
CATEGORY: science
BODY:
...
```

The page parses and validates each article live, lets you attach a photo per
article, and publishes them all in one click. **Scheduling options:**

- **Publish all now** — everything goes live immediately.
- **Spread across the week** — pick a start date & time and an "hours apart"
  value (default **2.4 h**, which is exactly **10 posts/day**). Every article is
  auto-spaced evenly from the start, so pasting a week's worth drips them out
  across the days automatically. It shows the per-day rate and the first/last
  times so you can see the spread before publishing.
- **Custom stagger** — pick when the *first* one publishes, set a default gap,
  then optionally override each article's "minutes after previous". So you can
  drip them out unevenly: 1st at 9:00, 2nd 30 min later, 3rd 13 min after that.

Tip: the ChatGPT mega-prompt (ask the assistant for it) outputs exactly this
format, so you can paste a whole batch straight in.

### ⏱ Scheduling (publish itself later)

In the studio, under **When to publish**, choose **Schedule for later** and pick a
date & time. The article is written now but stays **completely hidden** (off the
homepage, off its category, and its page returns 404) until that moment — then it
**publishes itself** automatically. No second step.

- The **Scheduled queue** at the bottom of the studio shows everything waiting,
  with a countdown ("in 3 hrs").
- How the auto-publish works: every listing/article page uses
  `export const revalidate = 60`, so the site re-checks roughly once a minute and
  reveals posts whose time has arrived. This works on the **live site** (Vercel /
  Netlify / any Node host) with no cron job needed.
- Workflow: write a batch of articles, schedule them across the week, commit &
  push once — they'll each go live at their set time.

> The studio writes files on your computer, so it only works locally. It is not
> exposed on the deployed public site.

## 📢 Ads & monetization

The site reserves four ad placements. Until you add a creative, each shows a
subtle "Your ad here" placeholder; once filled, the real ad renders.

| Slot | Where it appears | Recommended size |
|------|------------------|------------------|
| **Top Leaderboard** | Full-width banner below the nav, every page | 970×90 / 728×90 |
| **Homepage Sidebar** | Under "Also Allegedly" on the homepage | 300×250 |
| **In-Feed** | A card inside the homepage article grid | 600×500 |
| **In-Article** | End of every article, before related stories | 300×250 / 728×90 |

**Each slot is a billboard that holds several rotating ads.** Add as many ads as
you want to one slot — they cycle one after another, and **each ad has its own
click-through link**. Open the **Ad Manager** from the admin menu (or go to
`/admin/ads`). For any slot:

1. Choose **Image(s)** or **Video**.
2. Upload a file. Any size works; images are **auto-scaled & optimized** (≤1600px,
   compressed WebP) on upload. (Selecting several images adds them all at once,
   sharing the link below.)
3. Add a **🔗 Click-through link** — the advertiser's URL for *this* ad (opens in
   a new tab, tagged `rel="sponsored"`). Leave blank for a non-clickable ad.
4. **Add to rotation.** Repeat to add more ads to the same billboard.

The slot shows its current rotation as a numbered list — each ad has its own
**Remove**, and when there are 2+ you get a **"Rotate every N seconds"** control.
Images advance on that timer; **videos play fully** before the next ad. **Clear
all** empties the slot. (Empty slots show the "Your ad here" placeholder.)

Ads are stored as files — config in `content/ads.json`, media in `public/ads/` —
so commit & push to make them live, just like articles. No ad network required;
when you're ready for one (Google AdSense, etc.), you can paste its script into
`components/AdSlot.tsx` instead of uploading a creative.

## How to publish by hand (alternative)

You can also just create the Markdown file yourself:

1. Go to the `content/articles/` folder.
2. Make a **new file** ending in `.md` — e.g. `mayor-eats-own-hat.md`.
   The filename becomes the URL (`/article/mayor-eats-own-hat`).
3. Copy the structure from `content/articles/_TEMPLATE.md.txt`.
4. Fill in the frontmatter at the top (between the `---` lines) and write the
   story below it in Markdown.
5. Save. The article appears automatically — no code changes needed.

### Frontmatter fields

| Field         | Required | Notes                                                                 |
|---------------|----------|-----------------------------------------------------------------------|
| `title`       | yes      | The headline.                                                         |
| `category`    | yes      | One of: `politics`, `world`, `business`, `science`, `entertainment`, `sports`, `horoscope` |
| `author`      | yes      | A (made-up) byline.                                                   |
| `date`        | yes      | `YYYY-MM-DD`. Newest date = featured story on the homepage.           |
| `excerpt`     | yes      | 1–2 sentence summary shown on cards and link previews.                |
| `image`       | yes      | Path to a local image in `public/img/` (e.g. `/img/my-photo.jpg`) or a full `https://...` URL. Branded placeholders: `node scripts/generate-placeholders.mjs` |
| `imageCredit` | optional | Caption under the image.                                              |

> **Workflow tip:** Generate articles with an AI, paste each into a new `.md`
> file with the frontmatter above, and commit. That's your manual pipeline for now.

### Adding or renaming categories

Edit `lib/categories.ts`. The `slug` there must match the `category` you use in
article frontmatter. The nav, footer, and category pages all update automatically.

---

## Going live later (free)

- Push this folder to a GitHub repo.
- Import it on **Vercel** or **Netlify** (free tier). It auto-deploys on every push.
- Point your `definitelyfakenews.com` domain at it in the host's dashboard.

### When you're ready to automate content

Because articles are just Markdown files, automation later just means: a script
calls the Claude API, gets a story, writes a new `.md` file into
`content/articles/`, and pushes to GitHub — the site rebuilds itself. No
re-architecting required.

---

## 📨 Reader submissions (where they go)

The public **Submit a Fake Story** form (`/submit`) emails each submission
straight to your inbox using **[Web3Forms](https://web3forms.com)** — a free
service that needs no backend and works on a static deploy. Submissions are
**not** stored on the site or auto-published; you read them in your email and an
editor decides what to publish.

To turn it on:

1. Go to <https://web3forms.com>, enter the email address where you want
   submissions delivered, and copy the free **Access Key**.
2. Put it in `.env.local` (and your host's env vars) as
   `NEXT_PUBLIC_WEB3FORMS_KEY=your-key`.
3. Restart the dev server.

Until a key is set, the form shows a "Setup needed" notice and won't send.
(This key is designed to be public, so it's fine in a `NEXT_PUBLIC_` variable.)

---

## 🌗 Appearance & languages

Two controls live in the **top-right** of every page:

- **Dark / light mode** — the sun/moon button toggles the theme. The choice is
  saved in the browser and the site also respects the visitor's system
  preference on first visit (no flash on load).
- **Language** — the 🌐 dropdown translates the entire site (including article
  text) into 16 languages via Google Translate. It's loaded **only when a
  visitor picks a language**, so the default English page stays fast with no
  third-party requests. Pick "English" to switch back.

Theming is driven by CSS variables in `app/globals.css` (`:root` for light,
`.dark` for dark) and consumed through Tailwind tokens — so adding a new colored
element automatically works in both themes. To add/remove languages, edit the
`LANGS` list in `components/LanguageSwitcher.tsx`.

## Before you ship

- **Set `ADMIN_PASSWORD` / `ADMIN_SECRET`** to real values (see Admin login above).
- **Add your `NEXT_PUBLIC_WEB3FORMS_KEY`** so reader submissions reach your inbox.
- Replace any placeholder images with your own when you have them.
- Keep the satire disclaimer in the footer — it's there for a reason.
