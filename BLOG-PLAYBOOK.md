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

Every post needs one. It lives in the repo at:

```
blog/images/<slug>.webp
```

Filename must equal the slug exactly. `{{HERO_IMAGE}}` is then `/blog/images/<slug>.webp`.

### Getting it there

The user supplies the image. You put it in place by **copying the file** — never by generating or re-encoding it.

```bash
cp "<path the user gave you>" blog/images/<slug>.webp
git add blog/images/<slug>.webp
```

If the file is a JPG or PNG, keep the real extension (`blog/images/<slug>.jpg`) and point `{{HERO_IMAGE}}` at that. Do not rename a JPG to `.webp` — the extension has to match the actual format or browsers and Google both complain.

### This only works when you have filesystem access

| Where you are running | Can you place the image? |
|---|---|
| Claude Code (desktop or CLI) | **Yes.** The image is a file on disk. Copy it. |
| claude.ai with the GitHub connector | **No.** You can only write text through the API. You cannot reproduce the bytes of an image the user attached to the chat. |

**If you are on claude.ai and the image is not already in the repo:** write the post and commit the text files, then tell the user in plain words:

> The post is live but the hero image is missing. Upload your image to `blog/images/<slug>.webp` — open the repo on github.com, go to that folder, click Add file › Upload files, drag it in, commit. Netlify will redeploy and the image will appear.

Do not stall waiting for the image, and do not invent a URL or a filename. A post with a temporarily missing hero recovers in one drag-and-drop. A post referencing an image that never existed is silently broken forever.

### Rules

- Never commit an image you generated, re-encoded, or reconstructed from base64. Only ever copy the user's actual file.
- Keep hero images under about 200KB. If the user's file is much larger, say so and ask for a compressed version rather than committing a 4MB page-killer.
- Never rename or delete an existing image. Older posts reference them.

---

## Publishing

Three text files change, plus the image file when you are able to place it. All of it goes in **one commit**.

### 0. Place the hero image — only if you have filesystem access

```bash
cp "<path the user gave you>" blog/images/<slug>.webp
```

Skip this on claude.ai and tell the user to upload it, as described above.

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
- [ ] Hero image path `/blog/images/<slug>.<ext>` appears in `og:image`, `twitter:image`, JSON-LD `image`, the `<img>` tag, and the index card — identical in all five
- [ ] Image extension matches the file's real format
- [ ] Image file is either committed, or the user has been told exactly where to upload it
- [ ] Body uses only the allowed tags, no inline styles
- [ ] Post ends with the FAQ section
- [ ] Three related cards, all pointing at posts that actually exist
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
