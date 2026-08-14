# Dobby Ads — blog publishing demo

Static site on Netlify. No CMS, no build step. Commit to `main`, Netlify deploys in about a minute.

**Claude: start with [BLOG-PLAYBOOK.md](BLOG-PLAYBOOK.md). It has the publishing rules.**

## Publishing a post

1. In Claude Code: *"write a blog for Dobby about X"* — attach the hero image.
2. Review the draft.
3. *"make it live"* — Claude commits the post, the index card, the sitemap entry and the image. Netlify deploys.

Hero images live in the repo at `blog/images/<slug>.webp` — filename must match the slug.

> **Claude Code vs claude.ai.** Claude can only place the image file when it has filesystem access, which means Claude Code. On claude.ai the GitHub connector writes text only; Claude will commit the post and tell you to drag the image into `blog/images/` on github.com. Everything else is identical.

## Layout

```
assets/site.css        every style on the site — the only place design changes
assets/site.js         scroll reveal + mobile menu
blog/_TEMPLATE.html    post skeleton, copied for each new post
blog/index.html        card grid, insertion marker at CARDS:START
blog/<slug>/index.html one published post
blog/images/           hero images, named after the slug
sitemap.xml            insertion marker at URLS:START
robots.txt             blocks all crawlers (demo only)
BLOG-PLAYBOOK.md       the rules
```

## Setup

**Netlify** — build command empty, publish directory `.`

**Claude** — for the claude.ai flow, enable the GitHub connector and grant it write access to this repo. For the Claude Code flow, just clone the repo and work in it.
