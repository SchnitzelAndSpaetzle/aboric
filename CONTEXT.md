# aboric.dev (personal site)

Aleksandar Borić's personal website — a terminal-aesthetic static site whose content lives in markdown files so editing the MD updates the site.

## Language

### Site structure

**Section**:
A top-level page region with its own number, label, and keyboard shortcut. The site has six fixed sections: about, experience, projects, music, now, contact.
_Avoid_: Page, route, tab.

**Profile**:
The site-wide personal data file (`src/content/profile.yaml`) — name, handle, tagline, location, email, links, education, skills. Slow-changing facts about the site's owner, distinct from per-section content.

### Projects

**Project**:
A piece of professional work, one MD file under `src/content/projects/`. Filename is the slug (e.g. `axa-oms.md`); the MD body is the README shown on expand; frontmatter holds metadata.

**Project type**:
Closed enum describing what kind of work the project was.
- `frontend` — SPA or app UI build (you owned the UI, someone else may have owned the backend)
- `fullstack` — SPA plus your own backend
- `backend` — service-side only, no UI
- `web` — content/marketing site (WordPress or marketing-flavoured Next.js)

_Avoid_: "app" (ambiguous), "site" (overloaded with the site itself).

**Project status**:
- `live` — currently publicly accessible at its URL
- `closed` — closed source, internal-only, or decommissioned

### Music

**SOC** (alias: **Street of Crocodiles**):
Aboric's musician alias, active since 2010. Mostly instrumental electronic music — ambient, downtempo, techno, synthwave. Surfaced in the music section.
_Avoid_: "the band", "my music project".

### Now page

**Now page**:
The `now` section — a short list of what aboric is currently doing. Inspired by [nownownow.com](https://nownownow.com). Has an explicit `updated:` date in frontmatter that the author bumps manually; never derived from build time or `new Date()`.

## Example dialogue

> **Dev:** I want to add a new project I shipped last month.
>
> **Aboric:** Drop a new MD file under `src/content/projects/` — filename is the slug. Frontmatter needs title, client, type, year, status, stack, and optional url. Body is the README.
>
> **Dev:** It's a Next.js marketing site for a client — type is `frontend`?
>
> **Aboric:** No, `web`. `frontend` is for SPAs/app UIs. Marketing sites are `web` even when they're Next.js.
>
> **Dev:** Got it. And it's still on their staging URL, not public yet.
>
> **Aboric:** Then status is `closed` until it goes live. `live` means publicly accessible at the URL today.
