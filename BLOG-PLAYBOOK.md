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

That list is exhaustive. Anything not on it is not allowed — in particular **no `<hr>`**, no `<div>`, no `<span>`, no `<br>`, no `<blockquote>`, no `<table>`, no `style=` attributes, no inline CSS.

`<hr>` is the one that gets reached for most often, as a separator between sections. Do not use it. `<h2>` already carries the spacing that separates sections; a horizontal rule on this dark theme reads as a design mistake.

Styling is handled by `/assets/site.css`. If something looks wrong, the stylesheet is what changes — never the post.

**Structure that works here:**
- Opening paragraph that states the problem in plain terms. No throat-clearing.
- 4–8 `<h2>` sections.
- `<h3>` only inside a section, never as a section header.
- Close with an `<h2>` titled exactly `Frequently Asked Questions`, then `<h3>` question / `<p>` answer pairs. This is not optional — it feeds search result rich snippets.

**Related posts** — pick the 3 most topically relevant posts that already exist. If the blog has fewer than 3 other posts, use all of them; never link a post that does not exist. Card markup for `{{RELATED}}`:

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

Every post needs one. Hero images are **not** stored in this repo — they live in Cloudflare R2 and the post references a full URL.

`{{HERO_IMAGE}}` is therefore an absolute URL like:

```
https://pub-xxxxxxxx.r2.dev/blog/amazon-bullet-points-that-convert.webp
```

That URL is public and permanent. Nothing about it expires.

### When the user gives you an image file

Upload it, then use the URL the script prints:

```bash
node --env-file=.env scripts/upload-image.mjs "<path the user gave you>" <slug>
```

It prints one line to stdout — the public URL. Use that string verbatim for `{{HERO_IMAGE}}`, in all five places (`og:image`, `twitter:image`, JSON-LD `image`, the `<img>` tag, the index card).

The object key is `blog/<slug>.<ext>`, keeping the real extension. Never rename a JPG to `.webp`; the extension must match the actual format.

### This requires the actual file on disk

| Where you are running | Can you upload the image? |
|---|---|
| Claude Code (desktop or CLI) | **Yes.** The image is a file. Run the script. |
| claude.ai with the GitHub connector | **No.** An image attached to a chat reaches you as vision input, not bytes. You cannot re-emit it — not to R2, not to GitHub, not anywhere. |

**If you are on claude.ai:** publish anyway. On "make it live", commit the three text files immediately, then tell the user:

> The post is live but the hero image is missing. Run this from the repo, then tell me the URL it prints and I'll wire it in:
> `node --env-file=.env scripts/upload-image.mjs <your-image> <slug>`
> Or upload it however you like and send me the public URL.

**Do not hold the publish waiting for an image, and do not offer to upload it yourself when you are on claude.ai.** Saying you will and then failing wastes the user's time. Say up front that you cannot.

Until a real URL exists, leave the five image references pointing at the URL the user will produce — ask for it rather than guessing. **Never invent a URL.** A post whose hero arrives ten minutes late is fine. A post pointing at a URL that never existed is silently broken forever.

### Rules

- Never generate, re-encode, or reconstruct an image. Only ever upload the user's actual file.
- Keep hero images under about 200KB. If the user's file is much larger, say so and ask for a compressed version rather than shipping a 4MB page-killer.
- Never overwrite an existing key. Slugs are unique, so this only happens if you reuse a slug — which you must not do anyway.
- Older posts reference `/blog/images/<slug>.webp` inside the repo. That still works. Leave them alone; only new posts use R2.

---

## Publishing

Three text files change, plus the image file when you are able to place it. All of it goes in **one commit**.

### 0. Upload the hero image — only if you have the file on disk

```bash
node --env-file=.env scripts/upload-image.mjs "<path>" <slug>
```

Use the URL it prints. Nothing image-related gets committed — R2 holds the file, the post holds the URL.

Skip this on claude.ai and ask the user for the URL, as described above.

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
- [ ] `{{HERO_IMAGE}}` is a **full `https://` URL**, used byte-identically in all five places: `og:image`, `twitter:image`, JSON-LD `image`, the `<img>` tag, and the index card. `og:image` and JSON-LD `image` are required to be absolute — a relative path there means no social preview and an invalid `BlogPosting`.
- [ ] That URL was printed by the upload script, never composed by you
- [ ] Image extension matches the file's real format
- [ ] No image file committed to the repo — R2 holds the bytes
- [ ] Body uses only the allowed tags — no `<hr>`, `<div>`, `<br>`, `<table>` or inline styles
- [ ] Post ends with the FAQ section
- [ ] Up to three related cards, every one pointing at a post that actually exists
- [ ] Card added below `CARDS:START`, sitemap entry added below `URLS:START`
- [ ] Everything in one commit

---

## Never do these

- Never paste CSS into a post. One stylesheet, `/assets/site.css`.
- Never edit `blog/_TEMPLATE.html` while publishing. Changing it changes every future post.
- Never change the nav or footer in one page only. They are identical everywhere by design.
- Never rename or delete an existing post folder. The URL is indexed by Google; breaking it loses the ranking that post earned.
- Never generate, re-encode, or reconstruct an image file. Copy the user's real file, or leave it to them. See *The hero image* above.

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
