/* global React, ReactDOM */
const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT
// ─────────────────────────────────────────────────────────────────────────────

const PROFILE = {
  handle: "aboric",
  name: "aleksandar borić",
  tagline: "software developer · making music on the side",
  location: "belgrade, serbia · cet",
  email: "aboric@tuta.io",
  links: [
    { label: "github",    url: "https://github.com/aboric" },
    { label: "linkedin",  url: "https://www.linkedin.com/in/aboric" },
    { label: "3ap",       url: "https://3ap.ch/" },
    { label: "bandcamp",  url: "https://streetofcrocodiles.bandcamp.com" },
    { label: "spotify",   url: "https://open.spotify.com/artist/2D1U7DMfjy9DddHPM25jOl" },
    { label: "youtube",   url: "https://www.youtube.com/@street_of_crocodiles" },
  ],
};

const PROJECTS = [
  {
    name: "axa-oms",
    client: "AXA",
    title: "Output Management System",
    type: "frontend",
    year: "2024",
    status: "live",
    stack: ["React", "Spring Boot", "OpenShift", "SQL", "Figma"],
    url: "https://www.axa.ch/en/private-customers.html",
    blurb: "document control + output management system for AXA Switzerland.",
    readme: [
      "## what it does",
      "Internal system AXA uses to manage outbound customer documents — letters, policies, statements — across channels (print, email, portal). Replaces an older legacy tool.",
      "## my role",
      "Frontend lead. Built the React UI from Figma designs, integrated with a Spring Boot service running on OpenShift. Worked closely with AXA's design team to refine the document-control workflows.",
      "## stack",
      "React · Spring Boot · OpenShift · SQL · Figma",
      "## status",
      "Closed source · in production at axa.ch",
    ].join("\n"),
  },
  {
    name: "swica-calc",
    client: "SWICA",
    title: "Health Insurance Calculator",
    type: "frontend",
    year: "2023",
    status: "live",
    stack: ["Vue.js", "Spring Boot", "TypeScript"],
    url: "https://www.swica-calculate.ch/",
    blurb: "redesigned + rebuilt the SWICA premium calculator from scratch.",
    readme: [
      "## what it does",
      "Public-facing premium calculator for SWICA, one of Switzerland's largest health insurers. Customers compare plans and get a quote in under a minute.",
      "## my role",
      "Rewrote the Vue.js frontend from the ground up, working off a new design system. Backend API in Spring Boot, end-to-end typed with TypeScript.",
      "## stack",
      "Vue.js · Nuxt · TypeScript · Spring Boot",
      "## status",
      "Closed source · live at swica-calculate.ch",
    ].join("\n"),
  },
  {
    name: "zhaw-cpa",
    client: "ZHAW",
    title: "Core Process Automation",
    type: "fullstack",
    year: "2023",
    status: "live",
    stack: ["Camunda", "Spring Boot", "React", "MUI"],
    url: "https://www.zhaw.ch/en/university/",
    blurb: "digitised core admin processes for ZHAW's Department of Social Work.",
    readme: [
      "## what it does",
      "Modelled and digitised the core administrative processes for ZHAW's Department of Social Work — application flows, approvals, document routing — running on Camunda BPM.",
      "## my role",
      "Built the React/MUI frontend on top of Camunda's REST APIs, helped revise the underlying BPMN models, integrated with the university's existing data sources.",
      "## stack",
      "Camunda BPM · Spring Boot · React · MUI",
      "## status",
      "Closed source · in production for ZHAW staff",
    ].join("\n"),
  },
  {
    name: "oakhurst",
    client: "Oakhurst Funds",
    title: "Investment Advisory Site",
    type: "web",
    year: "2022",
    status: "live",
    stack: ["TypeScript", "Next.js", "Vercel", "Tailwind"],
    url: "https://www.oakhurstfunds.com/",
    blurb: "main website with client document control + document management.",
    readme: [
      "## what it does",
      "Public marketing site and authenticated client portal for a real-estate-focused investment advisory.",
      "## my role",
      "Full Next.js build, hosted on Vercel. Document management integration so authorised clients can pull fund reports and statements directly from the portal.",
      "## stack",
      "TypeScript · Next.js · Tailwind · Vercel",
      "## status",
      "Live at oakhurstfunds.com",
    ].join("\n"),
  },
  {
    name: "gvc-pps",
    client: "GVC · Intertrader",
    title: "Payment Provider Service",
    type: "backend",
    year: "2021",
    status: "closed",
    stack: ["C#", ".NET"],
    url: null,
    blurb: "geo-routed payment integrations across multiple external providers.",
    readme: [
      "## what it does",
      "Service that picked the right payment provider for a client based on geo-location, routing deposits and withdrawals through whichever provider was available + cheapest for that region.",
      "## my role",
      "Designed and implemented the integration layer across multiple external payment systems, including the fallback + retry logic.",
      "## stack",
      "C# · .NET · SQL Server",
      "## status",
      "Closed source · internal to GVC / Entain",
    ].join("\n"),
  },
  {
    name: "gvc-kvc",
    client: "GVC · Intertrader",
    title: "KVC Check Mapper",
    type: "backend",
    year: "2020",
    status: "closed",
    stack: ["C#", ".NET"],
    url: null,
    blurb: "batch services mapping KYC-passed clients into active trading accounts.",
    readme: [
      "## what it does",
      "Batch services that took clients who'd passed the KVC (know-your-client) check and mapped their payment information into active accounts on the trading platform.",
      "## my role",
      "Owned the batch pipeline end to end — extraction, validation, mapping, error handling. Kept the on-call rotation quiet.",
      "## stack",
      "C# · .NET · SQL Server",
      "## status",
      "Closed source · internal to GVC / Entain",
    ].join("\n"),
  },
  {
    name: "dunav",
    client: "Dunav Osiguranje",
    title: "Main Website + Services",
    type: "web",
    year: "2016",
    status: "live",
    stack: ["WordPress", "C#", "jQuery"],
    url: "https://www.dunav.com/",
    blurb: "main website and connected services for one of serbia's largest insurers.",
    readme: [
      "## what it does",
      "Public website for Dunav Osiguranje plus the Dunav Auto site and several internal WCF services and desktop apps used by employees.",
      "## my role",
      "Built and maintained the WordPress front, integrated it with C# WCF backends. My first long-running production system.",
      "## stack",
      "WordPress · C# · WCF · jQuery",
      "## status",
      "Live at dunav.com",
    ].join("\n"),
  },
  {
    name: "partner-fund",
    client: "Partner Fund Services",
    title: "Fund Admin Marketing Site",
    type: "web",
    year: "2021",
    status: "live",
    stack: ["WordPress"],
    url: "https://partnerfundservices.com/",
    blurb: "main website + presentation pages for a real-estate fund admin partner.",
    readme: [
      "## what it does",
      "Marketing site for a fund administration and operations partner serving real-estate-focused funds.",
      "## my role",
      "WordPress build from a design brief, with custom presentation layouts and tuned editorial workflows for the client.",
      "## stack",
      "WordPress",
      "## status",
      "Live at partnerfundservices.com",
    ].join("\n"),
  },
];

const MUSIC = {
  bandcamp: "https://streetofcrocodiles.bandcamp.com",
  youtube:  "https://www.youtube.com/@street_of_crocodiles",
  spotify:  "https://open.spotify.com/artist/2D1U7DMfjy9DddHPM25jOl",
  // featured videos / tracks — rename `title` as you like
  tracks: [
    { title: "track 02",  videoId: "E3-uug-inkM" },
    { title: "track 05",  videoId: "B0e3iv-fqGg" },
    { title: "track 10",  videoId: "Q7UPyPIO7gY" },
    { title: "track 12",  videoId: "8wLWUof6Ofk" },
    { title: "track 15",  videoId: "IW3lAHslqgQ" },
  ],
  // optional: the auto-generated album playlist these tracks belong to
  playlistId: "OLAK5uy_mG_3VGLrAKtzGS0a8huv4saw2OdDi9H3Q",
};

const EXPERIENCE = [
  {
    company: "3ap",
    role: "Software Developer",
    start: "Jan 2022",
    end: "present",
    location: "Belgrade",
    url: "https://3ap.ch/",
    note: "Building software solutions for various clients (AXA, SWICA, ZHAW and others).",
  },
  {
    company: "GVC Group / Intertrader Limited",
    role: "Software Developer",
    start: "Apr 2017",
    end: "Jan 2022",
    location: "Belgrade",
    url: "https://www.entaingroup.com/",
    note: "Child company of Entain (GVC). Client registration workflows, the main website, internal APIs talking to Salesforce.",
  },
  {
    company: "Dunav Osiguranje ADO",
    role: "Software Developer",
    start: "Sep 2013",
    end: "Apr 2017",
    location: "Belgrade",
    url: "https://www.dunav.com/",
    note: "Main websites (Dunav, Dunav Auto), internal WCF services, desktop apps.",
  },
];

const EDUCATION = {
  school: "Singidunum University",
  degree: "Master's in Informatics and Computing",
  years: "2008 – 2013",
};

const SKILLS = [
  { group: "frontend",  items: "HTML5, JavaScript, TypeScript, CSS, React.js, Next.js, Vue.js, Nuxt.js, Figma" },
  { group: "backend",   items: "C#, .NET, Java, Spring Boot, SQL, WordPress" },
  { group: "devops",    items: "Git, Jenkins, GitHub Actions, OpenShift, Docker" },
  { group: "languages", items: "Serbian (native), English" },
];

const NOW = [
  "shipping client work at 3ap — current rotation is around an AXA frontend",
  "tinkering with hardware synths in the evenings, slowly recording an EP",
  "reading more, scrolling less",
  "open to interesting side work and collaborations",
];

const SECTIONS = [
  { id: "about",      label: "about",      key: "1" },
  { id: "experience", label: "experience", key: "2" },
  { id: "projects",   label: "projects",   key: "3" },
  { id: "music",      label: "music",      key: "4" },
  { id: "now",        label: "now",        key: "5" },
  { id: "contact",    label: "contact",    key: "6" },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function pad(s, n, ch = " ") {
  s = String(s);
  if (s.length >= n) return s;
  return s + ch.repeat(n - s.length);
}
function padL(s, n, ch = " ") {
  s = String(s);
  if (s.length >= n) return s;
  return ch.repeat(n - s.length) + s;
}

function useNow(intervalMs = 1000) {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return t;
}

function fmtTime(d) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

// blinking cursor
function Cursor({ solid = false }) {
  return <span className={"cursor" + (solid ? " cursor--solid" : "")} aria-hidden="true">█</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Header({ activeId, onJump, theme, onToggleTheme, showClock }) {
  const now = useNow();
  return (
    <header className="header">
      <div className="header__row">
        <div className="header__path">
          <span className="dim">~/</span>{PROFILE.handle}
          <span className="dim"> · </span>
          <span className="dim">{activeId || "about"}</span>
        </div>
        <nav className="header__nav" aria-label="sections">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={"navlink" + (s.id === activeId ? " navlink--active" : "")}
              onClick={() => onJump(s.id)}
            >
              <span className="dim">[{s.key}]</span> {s.label}
            </button>
          ))}
        </nav>
        <div className="header__meta">
          <button className="iconbtn" onClick={onToggleTheme} title="toggle theme (t)">
            {theme === "dark" ? "[ ◐ light ]" : "[ ◑ dark ]"}
          </button>
          {showClock && <span className="dim mono-time">{fmtTime(now)}</span>}
        </div>
      </div>
      <div className="header__rule" aria-hidden="true" />
    </header>
  );
}

function SectionHeader({ n, title, hint }) {
  return (
    <div className="sec__head">
      <div className="sec__num">§ {String(n).padStart(2, "0")}</div>
      <h2 className="sec__title">{title}</h2>
      {hint ? <div className="sec__hint dim">{hint}</div> : null}
    </div>
  );
}

function Rule({ char = "─", label = "" }) {
  return (
    <div className="rule" aria-hidden="true">
      <span className="rule__line">{char.repeat(120)}</span>
      {label ? <span className="rule__label">{label}</span> : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────────────────────────

function AboutSection({ asciiHeader = true }) {
  return (
    <section id="about" className="sec" data-screen-label="01 about">
      <SectionHeader n={1} title="about" hint="↓ scroll or press 'j'" />
      {asciiHeader && (
        <pre className="ascii ascii--hero">
{`  ┌────────────────────────────────────────────────────────┐
  │                                                        │
  │   ${pad(PROFILE.name, 49)}    │
  │   ${pad(PROFILE.tagline, 49)}    │
  │   ${pad(PROFILE.location, 49)}    │
  │                                                        │
  └────────────────────────────────────────────────────────┘`}
        </pre>
      )}
      {!asciiHeader && (
        <div className="hero-plain">
          <div className="hero-plain__name">{PROFILE.name}<Cursor /></div>
          <div className="hero-plain__line dim">{PROFILE.tagline}</div>
          <div className="hero-plain__line dim">{PROFILE.location}</div>
        </div>
      )}
      <div className="prose">
        <p>
          software developer based in belgrade. been writing code professionally
          since <em>2013</em> — backend, frontend, and whatever sits between
          them. master's in informatics and computing from singidunum university.
        </p>
        <p>
          currently at <a className="link" href="https://3ap.ch/">3ap</a>, mostly
          on frontends for swiss enterprise clients (axa, swica, zhaw). before
          that, five years on payments and registration flows at gvc/entain, and
          before that, four years on insurance websites and internal tools at
          dunav osiguranje.
        </p>
        <p>
          comfortable across the stack: react / next / vue on the front, spring
          boot / .net / wordpress on the back, openshift / docker / github
          actions to ship it. see <button className="link" onClick={() => {
            const el = document.getElementById("projects");
            if (el) {
              const top = el.getBoundingClientRect().top + window.scrollY - 56;
              window.scrollTo({ top, behavior: "smooth" });
            }
          }}>projects ↓</button>.
        </p>
        <p>
          outside of work i make electronic music as{" "}
          <a className="link" href="https://streetofcrocodiles.bandcamp.com" target="_blank" rel="noreferrer">
            Street of Crocodiles
          </a>{" "}
          (SOC) — mostly instrumental, somewhere between ambient, techno, and
          synthwave. started in 2010, came at it from a background as a guitar
          and bass player. see{" "}
          <button className="link" onClick={() => {
            const el = document.getElementById("music");
            if (el) {
              const top = el.getBoundingClientRect().top + window.scrollY - 56;
              window.scrollTo({ top, behavior: "smooth" });
            }
          }}>music ↓</button>.
        </p>
        <p>
          press <kbd>?</kbd> for keyboard shortcuts.
        </p>
      </div>
    </section>
  );
}

function Markdown({ src }) {
  // very small md-ish renderer for the README blurbs (## headers, paragraphs)
  const lines = src.split("\n");
  const out = [];
  let buf = [];
  const flush = (key) => {
    if (buf.length) {
      out.push(<p key={"p" + key} className="md__p">{buf.join(" ")}</p>);
      buf = [];
    }
  };
  lines.forEach((ln, i) => {
    if (ln.startsWith("## ")) {
      flush(i);
      out.push(<div key={"h" + i} className="md__h">## {ln.slice(3)}</div>);
    } else if (ln.trim() === "") {
      flush(i);
    } else {
      buf.push(ln);
    }
  });
  flush("end");
  return <div className="md">{out}</div>;
}

function ProjectsSection() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section id="projects" className="sec" data-screen-label="03 projects">
      <SectionHeader n={3} title="projects" hint="click a row to read the readme · all closed source" />
      <div className="filetree">
        <div className="filetree__head dim filetree__row--grid">
          <span>status</span>
          <span>type</span>
          <span>year</span>
          <span>client</span>
          <span>project</span>
        </div>
        {PROJECTS.map((p, i) => (
          <div key={p.name} className="filetree__group">
            <button
              className={"filetree__row filetree__row--grid" + (openIdx === i ? " is-open" : "")}
              onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              aria-expanded={openIdx === i}
            >
              <span className={"badge badge--" + p.status}>{p.status}</span>
              <span className="dim">{p.type}</span>
              <span className="dim">{p.year}</span>
              <span>{p.client}</span>
              <span className="filetree__name">
                <span className="dim">{openIdx === i ? "▼ " : "▶ "}</span>
                {p.title}
              </span>
            </button>
            {openIdx === i && (
              <div className="filetree__body">
                <div className="filetree__connector dim" aria-hidden="true">│</div>
                <div className="filetree__content">
                  <div className="readme">
                    <div className="readme__head">
                      <span className="dim">$ cat </span>
                      <span>{p.name}/README.md</span>
                    </div>
                    <Markdown src={p.readme} />
                    <div className="readme__stack">
                      {p.stack.map((s) => (
                        <span key={s} className="chip">{s}</span>
                      ))}
                    </div>
                    {p.url ? (
                      <div className="readme__actions">
                        <a className="link" href={p.url} target="_blank" rel="noreferrer">
                          [ visit live site ↗ ]
                        </a>
                      </div>
                    ) : (
                      <div className="readme__actions dim">
                        [ no public link — internal system ]
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Waveform({ playing, seed = 0, width = 60 }) {
  // a fake but plausible waveform rendered as ASCII bars
  const bars = useMemo(() => {
    const chars = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
    const out = [];
    for (let i = 0; i < width; i++) {
      // deterministic pseudo-random based on i + seed
      const x = Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453;
      const v = x - Math.floor(x);
      const env = Math.sin((i / width) * Math.PI); // taper edges
      const h = Math.max(0, Math.min(7, Math.floor((v * 0.6 + env * 0.4) * 8)));
      out.push(chars[h]);
    }
    return out;
  }, [width, seed]);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTick((t) => t + 1), 90);
    return () => clearInterval(id);
  }, [playing]);

  // when playing, shift hue of bars by walking the array
  const display = playing
    ? bars.map((_, i) => bars[(i + tick) % bars.length]).join("")
    : bars.join("");

  return (
    <pre className={"wave" + (playing ? " wave--playing" : "")} aria-hidden="true">{display}</pre>
  );
}

function MusicRow({ rel, idx, playingIdx, onToggle }) {
  const playing = playingIdx === idx;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!playing) return;
    setProgress(0);
    const id = setInterval(() => setProgress((p) => (p + 1) % 100), 120);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div className={"music__row" + (playing ? " is-playing" : "")}>
      <button className="music__play" onClick={() => onToggle(idx)} aria-label={playing ? "pause" : "play"}>
        {playing ? "[ ❚❚ ]" : "[ ▶  ]"}
      </button>
      <div className="music__meta">
        <div className="music__title">
          <span>{rel.title}</span>
          <span className="dim"> — {rel.kind}, {rel.year}</span>
        </div>
        <div className="music__sub dim">
          {rel.tracks} tracks · {rel.length}
        </div>
        <div className="music__note dim">{rel.note}</div>
      </div>
      <div className="music__wave">
        <Waveform playing={playing} seed={idx + 1} width={48} />
        <div className="music__progress dim">
          {playing
            ? `[${"=".repeat(Math.floor(progress / 5))}${" ".repeat(20 - Math.floor(progress / 5))}] ${String(progress).padStart(2,"0")}%`
            : `[${" ".repeat(20)}] 00%`}
        </div>
      </div>
    </div>
  );
}

function MusicSection() {
  return (
    <section id="music" className="sec" data-screen-label="04 music">
      <SectionHeader n={4} title="music" hint="aka Street of Crocodiles · est. 2010" />

      <div className="music__intro prose">
        <p>
          i record electronic music as <strong>Street of Crocodiles</strong>{" "}
          <span className="dim">(SOC)</span>. mostly instrumental — ambient,
          downtempo, techno, synthwave. came at it from years of playing guitar
          and bass; started producing in 2010.
        </p>
      </div>

      <div className="links-block">
        <a className="links-block__row" href={MUSIC.bandcamp} target="_blank" rel="noreferrer">
          <span className="dim links-block__label">bandcamp</span>
          <span className="links-block__val">streetofcrocodiles.bandcamp.com</span>
          <span className="dim links-block__arrow">↗</span>
        </a>
        <a className="links-block__row" href={MUSIC.spotify} target="_blank" rel="noreferrer">
          <span className="dim links-block__label">spotify</span>
          <span className="links-block__val">Street of Crocodiles</span>
          <span className="dim links-block__arrow">↗</span>
        </a>
        <a className="links-block__row" href={MUSIC.youtube} target="_blank" rel="noreferrer">
          <span className="dim links-block__label">youtube</span>
          <span className="links-block__val">@street_of_crocodiles</span>
          <span className="dim links-block__arrow">↗</span>
        </a>
      </div>

      <div className="tracks">
        <div className="tracks__head dim">
          <span>#</span>
          <span>title</span>
          <span>open in</span>
        </div>
        {MUSIC.tracks.map((t, i) => {
          const watchUrl = `https://www.youtube.com/watch?v=${t.videoId}&list=${MUSIC.playlistId}&index=${i + 1}`;
          return (
            <a key={t.videoId} className="tracks__row" href={watchUrl} target="_blank" rel="noreferrer">
              <span className="dim tracks__num">{padL(i + 1, 2, "0")}</span>
              <span className="tracks__title">
                <span className="dim">▸ </span>{t.title}
              </span>
              <span className="dim tracks__where">youtube ↗</span>
            </a>
          );
        })}
      </div>

      <p className="dim small music__foot">
        full catalog + lossless downloads on{" "}
        <a className="link" href={MUSIC.bandcamp} target="_blank" rel="noreferrer">bandcamp ↗</a>.
      </p>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section id="experience" className="sec" data-screen-label="02 experience">
      <SectionHeader n={2} title="experience" hint="13+ years, three companies" />
      <ol className="exp">
        {EXPERIENCE.map((job, i) => (
          <li key={job.company} className="exp__row">
            <div className="exp__rail" aria-hidden="true">
              <span className="exp__dot">{i === 0 ? "●" : "○"}</span>
              {i < EXPERIENCE.length - 1 && <span className="exp__line">│</span>}
            </div>
            <div className="exp__body">
              <div className="exp__head">
                <span className="exp__company">
                  <a className="link" href={job.url} target="_blank" rel="noreferrer">{job.company}</a>
                </span>
                <span className="dim exp__dates">
                  {job.start} → {job.end}
                </span>
              </div>
              <div className="exp__sub dim">
                {job.role} · {job.location}
              </div>
              <div className="exp__note">{job.note}</div>
            </div>
          </li>
        ))}
      </ol>

      <div className="edu">
        <div className="edu__head dim">— education —</div>
        <div className="edu__row">
          <span>{EDUCATION.school}</span>
          <span className="dim"> · </span>
          <span>{EDUCATION.degree}</span>
          <span className="dim"> · </span>
          <span className="dim">{EDUCATION.years}</span>
        </div>
      </div>

      <div className="skills">
        <div className="skills__head dim">— skills —</div>
        <dl className="skills__list">
          {SKILLS.map((s) => (
            <div key={s.group} className="skills__row">
              <dt className="dim">{pad(s.group, 12)}</dt>
              <dd>{s.items}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function NowSection() {
  return (
    <section id="now" className="sec" data-screen-label="05 now">
      <SectionHeader n={5} title="now" hint={`updated ${new Date().toISOString().slice(0,10)}`} />
      <ul className="now">
        {NOW.map((line, i) => (
          <li key={i} className="now__row">
            <span className="dim">{padL(i + 1, 2, "0")}.</span> {line}
          </li>
        ))}
      </ul>
      <p className="dim small">
        inspired by <a className="link" href="https://nownownow.com">nownownow.com</a>. updated every few weeks.
      </p>
    </section>
  );
}

function ContactSection() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (e) {}
  };
  return (
    <section id="contact" className="sec" data-screen-label="06 contact">
      <SectionHeader n={6} title="contact" hint="say hello" />
      <div className="contact">
        <div className="contact__row">
          <span className="dim">email </span>
          <button className="link" onClick={copy}>{PROFILE.email}</button>
          <span className="dim small">{copied ? " ✓ copied" : " · click to copy"}</span>
        </div>
        <div className="contact__row">
          <span className="dim">links </span>
          <span className="contact__links">
            {PROFILE.links.map((l, i) => (
              <React.Fragment key={l.label}>
                <a className="link" href={l.url}>{l.label} ↗</a>
                {i < PROFILE.links.length - 1 ? <span className="dim"> · </span> : null}
              </React.Fragment>
            ))}
          </span>
        </div>
        <div className="contact__row">
          <span className="dim">based </span>
          <span>belgrade, serbia</span>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMMAND BAR + HELP
// ─────────────────────────────────────────────────────────────────────────────

function CommandBar({ open, onClose, onJump, onToggleTheme }) {
  const [val, setVal] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (open) {
      setVal("");
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    }
  }, [open]);

  const submit = (e) => {
    e.preventDefault();
    const v = val.trim().toLowerCase();
    if (!v) return onClose();
    // commands
    if (v === "help" || v === "?") { onClose(); window.dispatchEvent(new CustomEvent("show-help")); return; }
    if (v === "theme" || v === "t") { onToggleTheme(); onClose(); return; }
    // goto <section> | <section>
    const target = v.replace(/^(goto|go|jump|cd)\s+/, "");
    const match = SECTIONS.find((s) => s.label === target || s.key === target);
    if (match) { onJump(match.id); onClose(); return; }
    // fall through: try matching project name
    const proj = PROJECTS.find((p) => p.name === target);
    if (proj) { onJump("projects"); onClose(); return; }
    onClose();
  };

  if (!open) return null;
  return (
    <div className="cmd" onClick={onClose}>
      <div className="cmd__panel" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={submit} className="cmd__form">
          <span className="cmd__prompt">~/aboric $</span>
          <input
            ref={inputRef}
            className="cmd__input"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
            placeholder="try: goto music · theme · help"
            spellCheck="false"
            autoComplete="off"
          />
        </form>
        <div className="cmd__hints dim">
          <span>goto &lt;section&gt;</span>
          <span>theme</span>
          <span>help</span>
          <span className="dim">esc to close</span>
        </div>
      </div>
    </div>
  );
}

function HelpOverlay({ open, onClose }) {
  if (!open) return null;
  const rows = [
    ["j / ↓", "next section"],
    ["k / ↑", "previous section"],
    ["1 – 6", "jump to section"],
    ["t",     "toggle theme"],
    ["/",     "command palette"],
    ["?",     "this help"],
    ["esc",   "close overlay"],
    ["g g",   "jump to top"],
    ["G",     "jump to bottom"],
  ];
  return (
    <div className="help" onClick={onClose}>
      <div className="help__panel" onClick={(e) => e.stopPropagation()}>
        <div className="help__head">
          <span>keyboard shortcuts</span>
          <button className="link" onClick={onClose}>[ esc ]</button>
        </div>
        <pre className="help__table">
{rows.map(([k, v]) => `  ${pad(k, 10)}${v}`).join("\n")}
        </pre>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "font": "JetBrains Mono",
  "density": "comfortable",
  "asciiHeader": true,
  "showClock": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = (window.useTweaks || (() => [TWEAK_DEFAULTS, () => {}]))(TWEAK_DEFAULTS);
  const [activeId, setActiveId] = useState("about");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const lastG = useRef(0);

  const toggleTheme = useCallback(() => {
    setTweak("theme", tweaks.theme === "dark" ? "light" : "dark");
  }, [tweaks.theme, setTweak]);

  const jump = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 56;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(id);
  }, []);

  // observe sections
  useEffect(() => {
    const opts = { rootMargin: "-40% 0px -55% 0px", threshold: 0 };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActiveId(e.target.id);
      });
    }, opts);
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      // ignore when typing in an input
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "?") { e.preventDefault(); setHelpOpen(true); return; }
      if (e.key === "/") { e.preventDefault(); setCmdOpen(true); return; }
      if (e.key === "Escape") { setHelpOpen(false); setCmdOpen(false); return; }
      if (e.key === "t" || e.key === "T") { toggleTheme(); return; }
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        const idx = SECTIONS.findIndex((s) => s.id === activeId);
        const next = SECTIONS[Math.min(idx + 1, SECTIONS.length - 1)];
        if (next) jump(next.id);
        return;
      }
      if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        const idx = SECTIONS.findIndex((s) => s.id === activeId);
        const prev = SECTIONS[Math.max(idx - 1, 0)];
        if (prev) jump(prev.id);
        return;
      }
      if (e.key >= "1" && e.key <= "6") {
        const s = SECTIONS[parseInt(e.key, 10) - 1];
        if (s) jump(s.id);
        return;
      }
      if (e.key === "g") {
        const now = Date.now();
        if (now - lastG.current < 400) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setActiveId(SECTIONS[0].id);
          lastG.current = 0;
        } else {
          lastG.current = now;
        }
        return;
      }
      if (e.key === "G") {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        setActiveId(SECTIONS[SECTIONS.length - 1].id);
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    const onShowHelp = () => setHelpOpen(true);
    window.addEventListener("show-help", onShowHelp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("show-help", onShowHelp);
    };
  }, [activeId, jump, toggleTheme]);

  // apply theme + font to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = tweaks.theme;
    root.dataset.density = tweaks.density;
    root.style.setProperty("--font-mono", `"${tweaks.font}", ui-monospace, "SF Mono", Menlo, Consolas, monospace`);
  }, [tweaks.theme, tweaks.font, tweaks.density]);

  const T = window.TweaksPanel ? window : null;

  return (
    <div className="app">
      <Header
        activeId={activeId}
        onJump={jump}
        theme={tweaks.theme}
        onToggleTheme={toggleTheme}
        showClock={tweaks.showClock}
      />

      <main className="main">
        <AboutSection asciiHeader={tweaks.asciiHeader} />
        <Rule />
        <ExperienceSection />
        <Rule />
        <ProjectsSection />
        <Rule />
        <MusicSection />
        <Rule />
        <NowSection />
        <Rule />
        <ContactSection />
      </main>

      <footer className="footer">
        <div className="footer__row">
          <span className="dim">© {new Date().getFullYear()} {PROFILE.name}</span>
          <span className="dim">·</span>
          <span className="dim">plain html, ~14kb</span>
          <span className="dim">·</span>
          <span className="dim">no cookies</span>
          <span className="footer__spacer" />
          <button className="link" onClick={() => setHelpOpen(true)}>press <kbd>?</kbd> for shortcuts</button>
        </div>
      </footer>

      <button className="fab" onClick={() => setCmdOpen(true)} title="command palette (/)">
        <span className="dim">$</span> <span>type a command</span> <span className="dim">/</span>
      </button>

      <CommandBar
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onJump={jump}
        onToggleTheme={toggleTheme}
      />
      <HelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} />

      {T && (
        <T.TweaksPanel>
          <T.TweakSection label="theme">
            <T.TweakRadio
              label="mode"
              value={tweaks.theme}
              options={["dark", "light"]}
              onChange={(v) => setTweak("theme", v)}
            />
            <T.TweakRadio
              label="density"
              value={tweaks.density}
              options={["tight", "comfortable", "loose"]}
              onChange={(v) => setTweak("density", v)}
            />
          </T.TweakSection>
          <T.TweakSection label="type">
            <T.TweakSelect
              label="monospace"
              value={tweaks.font}
              options={[
                "JetBrains Mono",
                "IBM Plex Mono",
                "Fira Code",
                "DM Mono",
                "Space Mono",
                "ui-monospace",
              ]}
              onChange={(v) => setTweak("font", v)}
            />
          </T.TweakSection>
          <T.TweakSection label="content">
            <T.TweakToggle
              label="ascii hero header"
              value={tweaks.asciiHeader}
              onChange={(v) => setTweak("asciiHeader", v)}
            />
            <T.TweakToggle
              label="live clock"
              value={tweaks.showClock}
              onChange={(v) => setTweak("showClock", v)}
            />
          </T.TweakSection>
        </T.TweaksPanel>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
