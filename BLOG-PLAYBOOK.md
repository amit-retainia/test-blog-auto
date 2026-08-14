# BLOG PLAYBOOK

**Claude: read this file completely before writing or publishing any post. It is the only source of truth for how posts are built here.**

This is a static HTML site on Netlify. There is no CMS, no build step, no database. A post goes live when its files are committed to `main` — Netlify redeploys automatically, roughly 60 seconds later.

---

## The two commands you will be given

| The user says | You do |
|---|---|
| "write a blog for Dobby about X" | Draft the post. Show it in chat. **Do not commit.** |
| "make it live" / "publish it" | Commit the three files in *Publishing* below. |

Never commit on the first command. Drafting and publishing are always separate steps, so the user gets a review pass.

---

## Before you write

Read these two files from the repo:

1. `blog/_TEMPLATE.html` — the exact page skeleton. Every post is this file with placeholders replaced.
2. `blog/index.html` — see how existing cards are written, and find the `<!-- CARDS:START -->` marker.

If you need a tone reference, read one existing post, for example `blog/amazon-listing-image-mistakes/index.html`.

---

## Writing the post

**Slug** — lowercase, hyphens only, no dates, no stop words. Derive from the title, keep it under 60 characters.
Good: `amazon-listing-image-mistakes`
Bad: `The-7-Amazon-Listing-Image-Mistakes-2026`

**Dates** — you need both forms, and they must agree.
- `{{DATE_DISPLAY}}` → `June 16, 2026`
- `{{DATE_ISO}}` → `2026-06-16`

Use today's date unless the user gives one. **Ask if you are not certain what today's date is** — a wrong date corrupts the sitemap and the structured data.

**Meta description** — 150–160 characters. No double quotes (it sits inside an HTML attribute). Say what the reader gets, not what the post "discusses".

**Body** — goes into `{{BODY}}`. Allowed tags only:

```
<p> <h2> <h3> <ul> <ol> <li> <strong> <a>
```

No `<div>`, no `<span>`, no `style=` attributes, no inline CSS. Styling is handled by `/assets/site.css`. If something looks wrong, the stylesheet is what changes — never the post.

**Structure that works here:**
- Opening paragraph that states the problem in plain terms. No throat-clearing.
- 4–8 `<h2>` sections.
- `<h3>` only inside a section, never as a section header.
- Close with an `<h2>` titled exactly `Frequently Asked Questions`, then `<h3>` question / `<p>` answer pairs. This is not optional — it feeds search result rich snippets.

**Related posts** — pick 3 existing posts, most topically relevant. Card markup for `{{RELATED}}`:

```html
      <a href="/blog/SLUG" class="blog-card r">
        <img class="blog-card-img" src="HERO_IMAGE" alt="TITLE" loading="lazy">
        <div class="blog-card-body">
          <div class="blog-card-date">DATE_DISPLAY</div>
          <div class="blog-card-title">TITLE</div>
        </div>
      </a>
```

**Escaping** — `&` becomes `&amp;` everywhere, including inside titles and meta tags. Use `&rsquo;` for apostrophes and `&ldquo;` `&rdquo;` for quotes in visible text.

---

## The hero image

Every post needs one. **You never upload it — you only reference its URL.**

The user gets the URL from `/upload.html` on the site: they drop the image, the page returns a URL, they paste it to you. It looks like:

```
https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto/dobby-blog/<name>.jpg
```

Use that string for `{{HERO_IMAGE}}`, unchanged.

**If the user has not given you an image URL, ask for it before publishing.** Do not invent a URL, do not guess a filename, do not publish without one — a post with a broken hero image looks worse than no post.

Older posts use repo-local paths like `/blog/images/<slug>.webp` instead. Both work. Leave existing posts alone.

---

## Publishing

Exactly three files change. Commit them together, one commit.

### 1. Create `blog/<slug>/index.html`

Copy `blog/_TEMPLATE.html`, replace every `{{PLACEHOLDER}}`, and **delete the instruction comment block** at the top (the `<!-- ==== BLOG POST TEMPLATE ... -->` section). Do not leave any `{{` in the output.

### 2. Add the card to `blog/index.html`

Insert directly **below** `<!-- CARDS:START -->` so the newest post appears first:

```html
      <a href="/blog/SLUG" class="blog-card r">
        <img class="blog-card-img" src="HERO_IMAGE" alt="TITLE" loading="lazy">
        <div class="blog-card-body">
          <div class="blog-card-date">DATE_DISPLAY</div>
          <div class="blog-card-title">TITLE</div>
          <p class="blog-card-excerpt">One or two sentences. Not a copy of the meta description.</p>
        </div>
      </a>
```

Change nothing else in that file.

### 3. Add the URL to `sitemap.xml`

Insert directly **below** `<!-- URLS:START -->`:

```xml
  <url>
    <loc>https://www.dobbyads.com/blog/SLUG</loc>
    <lastmod>DATE_ISO</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
```

### Commit message

```
Publish: <post title>

Slug: <slug>
Date: <DATE_DISPLAY>
```

---

## Checklist before you commit

- [ ] No `{{` left anywhere in the new file
- [ ] Template instruction comment removed
- [ ] Slug in the folder name, canonical, og:url, JSON-LD and sitemap all match exactly
- [ ] `DATE_DISPLAY` and `DATE_ISO` are the same day
- [ ] Hero image URL is present in `og:image`, `twitter:image`, JSON-LD `image`, the `<img>` tag, and the index card
- [ ] Body uses only the allowed tags, no inline styles
- [ ] Post ends with the FAQ section
- [ ] Three related cards, all pointing at posts that actually exist
- [ ] Card added below `CARDS:START`, sitemap entry added below `URLS:START`
- [ ] All three files in one commit

---

## Never do these

- Never paste CSS into a post. One stylesheet, `/assets/site.css`.
- Never edit `blog/_TEMPLATE.html` while publishing. Changing it changes every future post.
- Never change the nav or footer in one page only. They are identical everywhere by design.
- Never rename or delete an existing post folder. The URL is indexed by Google; breaking it loses the ranking that post earned.
- Never commit binary files (images, video). You cannot reproduce their bytes faithfully. Images go through `/upload.html`.

---

## Design or layout changes

If the user asks for a look change — different card style, new section, spacing — edit `/assets/site.css` only. One commit, every page updates. That is the entire reason the CSS is not inlined.

---

## Environment notes

| Thing | Value |
|---|---|
| Host | Netlify, auto-deploys on push to `main` |
| Build command | none — files are served as-is |
| Publish directory | repo root |
| Analytics | GA4 `G-LDBEMQM3ZW`, already in the template |
| Author default | Prathna Jeswani |
| Canonical domain | `https://www.dobbyads.com` |

**This is the demo repo.** `robots.txt` blocks all crawlers here on purpose. When this moves to the production repo, that file gets replaced — instructions are in the file itself.
