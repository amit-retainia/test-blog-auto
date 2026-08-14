# Dobby Ads — blog publishing demo

Static site on Netlify. No CMS, no build step. Commit to `main`, Netlify deploys in about a minute.

**Claude: start with [BLOG-PLAYBOOK.md](BLOG-PLAYBOOK.md). It has the publishing rules.**

## Publishing a post

1. Upload the hero image at `/upload.html`, copy the URL it returns.
2. In Claude: *"write a blog for Dobby about X"* — paste the image URL.
3. Review the draft.
4. *"make it live"* — Claude commits, Netlify deploys.

## Layout

```
assets/site.css        every style on the site — the only place design changes
assets/site.js         scroll reveal + mobile menu
blog/_TEMPLATE.html    post skeleton, copied for each new post
blog/index.html        card grid, insertion marker at CARDS:START
blog/<slug>/index.html one published post
blog/images/           legacy images; new ones go to Cloudinary
sitemap.xml            insertion marker at URLS:START
upload.html            Cloudinary uploader — needs CLOUD_NAME + UPLOAD_PRESET set once
robots.txt             blocks all crawlers (demo only)
BLOG-PLAYBOOK.md       the rules
```

## Setup

**Netlify** — build command empty, publish directory `.`

**Cloudinary** — free account, then set `CLOUD_NAME` and `UPLOAD_PRESET` at the top of `upload.html`. The preset must be **unsigned**, so the page holds no secret and nothing expires.

**Claude** — enable the GitHub connector on claude.ai and grant it write access to this repo.
