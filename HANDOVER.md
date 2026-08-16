# Disco Inferno — Website Handover

Windsor's Retro Dance Bar · 29 Park St W, Windsor ON · disco-inferno.ca

This is a **fully static website**: plain HTML, CSS and JavaScript. No paid services, no databases, no build step, nothing that expires. It is designed to be hosted for **free** on Netlify from a **free** GitHub repository, with a simple **/admin** page so the owner can update events and the announcement banner without touching code.

---

## 1. What's in the site

| Page | File | Notes |
|---|---|---|
| Home | `index.html` | Hero video, about, Fri/Sat cards, next 3 special events (from admin), booths/bottles/birthdays tiles, venue teaser, last-weekend's-photos CTA, find us |
| Events | `events.html` | Fri/Sat Posh series, **special events list (from admin — past events auto-hide)**, birthday / advanced tickets / last weekend's photos cards |
| Bottle Service | `bottle-service.html` | 4 party packages, full bottle list, notes, how to reserve, Things To Know |
| Reservations | `reservations.html` | VIP seating info, 30+ section, "How to book a booth" steps, bachelorette section + $299 package, reservation form (visual only), Things To Know |
| Birthdays | `birthdays.html` | Birthday copy, 4 perks, birthday form (visual only), birthday flyer |
| Venue | `venue.html` | LED dance floor / venue copy, private events + event types, fundraisers, music playlists |
| Things To Know | `things-to-know.html` | 19+ notice, house rules, full dress code |
| Photos | `photos.html` | **Last Weekend's Photos** button (SimplyCast form), Instagram + Facebook links |
| Contact | `contact.html` | Contact form (visual only), phone/email/address/hours/socials, map link |
| Now Hiring | `hiring.html` | Application form (visual only), apply-by-email |
| 404 | `404.html` | Not-found page (Netlify serves it automatically) |
| Admin | `admin/` | Decap CMS — owner login to edit events + banner |

Other folders/files:

- `css/styles.css` — all styling. `js/main.js` — nav, animations, banner + events loading, forms.
- `content/events.json`, `content/site.json` — **the two files the admin edits.**
- `assets/img/` — optimised WebP images used by the pages. `assets/img/ig/` are from Instagram, the rest from the old Wix site.
- `assets/img/originals/` — the untouched source photos with descriptive filenames: `instagram/` (used on the site), `instagram-extra-pool/` (≈120 more curated, unused shots for future swaps — safe to delete to slim the repo), `wix/` (media from the old site). `instagram/_sources.json` lists the Instagram post each photo came from.
- `assets/uploads/` — flyers uploaded through /admin land here.
- `assets/video/` — the club's own disco-ball loops (taken from their Wix site, compressed for web, muted). No third-party video assets were used.
- `assets/fonts/` — self-hosted fonts (Righteous, Shrikhand, Outfit — all SIL Open Font License, free for commercial use; see `LICENSES.txt`).
- `netlify.toml` — hosting config (clean URLs, redirects from old Wix URLs, caching, security headers).
- `robots.txt`, `sitemap.xml`.

External links kept exactly as on the old site: Posh (all-access passes `posh.vip/f/d9a53`, Friday & Saturday series), lnk.bio (advanced tickets), Instagram, Facebook, and the SimplyCast "Last Weekend's Photos" form.

---

## 2. One-time setup (all free)

You need: a GitHub account and a Netlify account **in the club's own name** (so the owner controls everything). Both are free for a site like this.

### 2.1 Put the files on GitHub
1. Sign in to GitHub → **New repository** → name it e.g. `disco-inferno-website` → Private or Public (either is fine) → Create.
2. Upload the entire contents of this folder (drag-and-drop in the browser works, or use GitHub Desktop). Make sure `index.html` is at the top level of the repo, not inside a sub-folder.
3. The default branch should be called `main`.

### 2.2 Host it on Netlify
1. Sign in to Netlify → **Add new site → Import an existing project → GitHub** → pick the repo.
2. Build command: *(leave empty)*. Publish directory: `.` (a dot). Netlify also reads `netlify.toml` automatically.
3. Deploy. You'll get a `something.netlify.app` address — the site is live.
4. Every time a file changes in GitHub (including edits made through /admin), Netlify redeploys automatically in ~30 seconds.

### 2.3 Point the domain (disco-inferno.ca)
1. Netlify → Site → **Domain management → Add a domain** → `disco-inferno.ca` (and `www.disco-inferno.ca`).
2. Netlify shows DNS records. At the company where the domain is registered (currently it points at Wix — the owner will know who the registrar is), either:
   - change the nameservers to Netlify's (easiest), or
   - add the A/CNAME records Netlify shows.
3. Wait for DNS (minutes to a few hours). Netlify issues a free HTTPS certificate automatically.
4. Set `www.disco-inferno.ca` as the primary domain (that's what the site's canonical URLs use).

### 2.4 Admin login (Decap CMS) — free GitHub OAuth via Netlify
The admin at `/admin` saves changes straight into the GitHub repo. It needs a one-time "OAuth app" so the owner can log in with a GitHub account:

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
   - Application name: `Disco Inferno Admin`
   - Homepage URL: `https://www.disco-inferno.ca`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Register → copy the **Client ID**, then **Generate a new client secret** and copy it.
2. Netlify → Site → **Site configuration → Access & security → OAuth → Install provider → GitHub** → paste Client ID + Secret.
3. In this repo, open `admin/config.yml` and change `repo: YOUR-GITHUB-USER/YOUR-REPO` to the real one (e.g. `discoinferno/disco-inferno-website`). Commit.
4. Anyone who should be able to edit the site needs a GitHub account with **write access to the repo** (repo → Settings → Collaborators → add them). The owner's own account works out of the box.

That's it. No Netlify Identity, no monthly fees.


---

## 3. Owner's day-to-day: updating the site (no code)

Go to **`https://www.disco-inferno.ca/admin`** → **Login with GitHub**.

### Add / edit an event
1. Click **Upcoming Events**.
2. Click **Add Event** (or open an existing one).
3. Fill in: Event name · Date · Time (optional, e.g. "10pm – 2am") · Short description (optional) · Flyer image (optional — click *Choose an image* → *Upload*) · Ticket link (paste the full Posh URL) · Button text.
4. Click **Save**, then **Publish → Publish now**.
5. Wait ~1 minute. The event appears on the **Events** page and (the next 3) on the **Home** page.
6. **Past events disappear automatically** the day after their date — no need to delete them (you can, to keep the list tidy).

### Announcement banner (the yellow bar at the top of every page)
1. Click **Site Settings → Announcement Banner**.
2. Toggle **Show the banner?** on or off, edit the text, optionally add a link (e.g. a Posh page) and the button text.
3. **Save → Publish now**. Turn it **off** when the promo ends.

Tips: keep banner text to one sentence; flyers look best square (1080×1080). If you make a mistake, just edit again — every change is also saved in GitHub's history.

### Anything else (prices, hours, packages, copy, photos)
Everything else is plain text inside the `.html` files. Anyone comfortable with basic HTML (or a web person for an hour) can edit them directly on GitHub — click the file → pencil icon → change the text → Commit. Netlify redeploys automatically. Bottle prices live in `bottle-service.html`; hours/address/phone appear in the footer of every page (search for `10pm`).

---

## 4. Forms — currently visual only (to be wired up)

The forms on **Reservations, Birthdays, Contact and Hiring** are styled and work as a UI, but **do not send anywhere yet**. When someone presses Submit they see a friendly notice with the phone number, email and Instagram. Look for `<!-- VISUAL-ONLY FORM -->` in each HTML file and the "Visual-only forms" block in `js/main.js`.

Free options to make them real later:
- **Netlify Forms** (100 submissions/month free): add `name="reservation" method="POST" data-netlify="true"` to the `<form>` tag, remove the `data-visual-only` attribute, and Netlify will email submissions to the owner (configure under Forms → Notifications). File uploads (hiring resume) also work with Netlify Forms.
- Or Formspree / Google Forms embed.

---

## 5. Content log — everything trimmed, changed or needing confirmation

All copy was carried over **word-for-word** from disco-inferno.ca (crawled 15 Aug 2026) or from the club's Instagram. Nothing was invented. Deviations:

### Trimmed / changed
| Item | What I did | Why |
|---|---|---|
| Meta descriptions said **"21+"** (home, bottle service) | Changed to **19+** | Every page body, Instagram bio and Ontario law say 19+ |
| Upcoming Events → "Book Your Birthday Party" and "Get Advance Tickets" cards linked to **wkndhospitality.com/birthdays** (a third-party site) | Now link to the site's own **Birthdays** page / lnk.bio | Keeps visitors on the club's site; content otherwise verbatim |
| Wix Events list of individual "Disco Inferno Fridays / Saturdays" dates | Replaced with two standing **Every Friday / Every Saturday** cards linking to the same Posh series | The dated list was auto-generated by Wix; the Posh series links are the same destination |
| Nav item names: "Nightlife / Venue" → **Venue**, "Style Code"/"Things To Know" → **Things To Know**, "Upcoming Events" → **Events** | Renamed for a shorter nav | Page titles/URL redirects preserved (`netlify.toml`) |
| Old Wix URLs `/upcoming-events`, `/nightlife-venue`, `/style-code`, `/about` | 301-redirected to the new pages | So old links / Google results keep working |
| Hiring page had **no text**, only a form; the Wix position dropdown had no visible options | Form rebuilt with a free-text "position" field + "Must have Smart Serve" line (from their Instagram hiring posts) and apply-by-email | Nothing invented |
| "Last Weekend's Photos" (was a small card at the bottom of Upcoming Events) | Now the headline of the **Photos** page, plus a card on Events, a CTA on Home and a footer link | Owner requested it be easier to find; same SimplyCast link |
| Home hero tagline "Windsor's Retro Dance Bar" | Taken from the site's own `<title>` | — |
| Section headings/labels I added for structure (e.g. "Your weekend plans = sorted", "Booths, bottles & birthdays", "Find your photos", polaroid captions like "friday night", "good vibes only", ticker strip) | Decorative headings only — no facts, prices or claims | The one factual ticker line, "Windsor's first LED Disco Dance floor", is their own copy |
| Music copy: home says "70's through the 90's", Venue page says up to the 2010's | Kept each in its original place | Both are their words |
| Instagram-only promos ($3.99 / $4.99 / $5 drink specials, "ladies free before 11pm", Bombshell Fridays, etc.) | **Not** put on the site | They change weekly; use the **announcement banner** or an **event** for these |
| Old-venue photos | Prioritised photos posted after the **Sept 6, 2025 "Grand Opening — our new home"** post for venue/atmosphere shots; a few older crowd/people shots are used where the venue isn't visible | So the site shows the current room |

### Added from Instagram (their own posts, verbatim)
- **"How to book a booth" steps** (Reservations page) — from the Jan 28, 2026 carousel.
- **"Raise funds, have fun!"** fundraiser blurb (Venue page) — from the Jan 6, 2026 post + graphic ("Sports teams & clubs, Non profits & charities, Social & community groups, Student organizations, Convention events — inquire by emailing info@disco-inferno.ca").
- **Announcement banner default text**: the **September All Access Pass** ("one pass, every Friday & Saturday, all September long… only 100 passes available") — from the Aug 15, 2026 post, linking to the same Posh page the old site's "Buy All Access Passes" button used. **Turn it off after September.**
- **Seed event**: *STILL GOT IT: Halloween 30+ Disco Inferno Day Party — Sat Oct 24, 4pm–9pm* — from the old site's Upcoming Events + flyer, linking to the same Posh page.
- Hiring: "Must have Smart Serve" / apply by email — from the hiring posts.

### Please confirm with the owner
1. **Bachelorette $299 package** (VIP line skip, complimentary bottle of champagne, 1 bottle of your choice, DJ shoutout for the bride-to-be, disco party favours; taxes + 18% gratuity not included) — this text existed only inside a flyer *image* on the old Reservations page. I've shown it as text. Still current?
2. **Bottle service prices & packages** — carried over exactly; worth a quick check they're current (last edited on Wix at an unknown date).
3. **"Disco Inferno is the newest sensation in Windsor's hospitality scene."** — their About copy, kept verbatim; may feel dated.
4. **Two ticket buttons**: "Buy All Access Passes" → Posh `f/d9a53`; "Advanced Tickets" → lnk.bio. Both kept, Posh is the sticky "Tickets" button. OK, or should everything go to one place?
5. **Hiring page** — has no intro text (never did). If the owner wants a sentence or a list of open roles, send it over.
6. **Hours** "Fridays & Saturdays 10pm–2am" — from the site footer. (Instagram posts mention some 4am extended nights and day parties — treat those as events.)
7. **Email** `info@disco-inferno.ca` and phone `519-791-3496` — from the site.
8. Whether to keep the **wkndhospitality.com** birthday link anywhere (I removed it).
9. **Photo choices** — all photos are from @discoinfernowindsor (source post per file in `assets/img/originals/instagram/_sources.json`) or the old Wix site. If any guest asks to be removed, swap the file in `assets/img/ig/` (keep the same filename) or tell me and I'll re-pick.

---

## 6. Local preview / editing tips
- Open the folder with any static server (e.g. VS Code "Live Server", or `npx serve .`) — the pages use root-relative paths (`/css/...`), so opening `index.html` directly from disk won't load styles; a local server is needed.
- To try the admin locally without GitHub: uncomment `local_backend: true` in `admin/config.yml`, run `npx decap-server` in the folder, and open `http://localhost:5173/admin/`. Comment it out again before publishing.

## 7. Credits / licences
- Photos © Disco Inferno (from their Instagram and website). Video loops © Disco Inferno (from their website).
- Fonts: Righteous, Shrikhand, Outfit — SIL Open Font License 1.1 (`assets/fonts/LICENSES.txt`).
- Decap CMS — MIT licence (`admin/decap-cms.js`, v3.15.1, self-hosted).
- Icons: inline SVG drawn for this site.
