// -------- Data ---------
const allAnnouncements = [
  {
    title: "New OSS Release",
    body: "We shipped v1.2 of Ledgernaut—now with faster sync.",
    href: "pages/open-source.html"
  },
  { title: "Bug Bash Friday", body: "Community triage session this Friday @ 2pm CT.", href: "pages/blog.html" },
  {title: "Security Update", body: "Important patch for OAuth proxy—review our notes.", href: "pages/blog.html"},
  { title: "Solutions", body: "Cloud-native platforms, data pipelines, and secure APIs built on proven OSS.", href: "pages/services.html" },
  { title: "Open Source", body: "We maintain libraries and contribute upstream. Sustainability matters.", href: "pages/open-source.html" },
  { title: "Work With Us", body: "Join a team that ships and shares. Remote-friendly, impact-driven.", href: "pages/careers.html" },
  { title: "Hiring Maintainers", body: "Paid part-time roles for OSS maintainers.", href: "pages/careers.html" },
  { title: "Client Spotlight", body: "Open standards integration for a fintech leader.", href: "pages/services.html" },
  { title: "RFP Window", body: "Seeking partners for healthcare data pipelines.", href: "pages/contact.html" },
  { title: "Sponsor Us", body: "Back our work to keep core libraries sustainable.", href: "pages/open-source.html" },
  { title: "Docs Refresh", body: "Improved developer guides & API examples.", href: "pages/blog.html" },
  {title: "Meetup", body: "Phoenix OSS meetup—cohosted with local devs.", href: "pages/blog.html"},
];

const highlightImages = [
  "img/highlights/engineer-4904884_640.jpg",
  "img/highlights/website-8305451_640.jpg",
  "img/highlights/engineer-4941172_640.jpg",
  "img/highlights/people-2557399_640.jpg",
  "img/highlights/hack-capital-uv5_bsypFUM-unsplash.jpg",
  "img/highlights/danial-igdery-FCHlYvR5gJI-unsplash.jpg",
  "img/highlights/kaleidico-3V8xo5Gbusk-unsplash.jpg",
  "img/highlights/mohammad-rahmani-q1p2DrLBtko-unsplash.jpg",
  "img/highlights/thisisengineering-t4qI2IDcL5s-unsplash.jpg",
];

// -------- Utils --------
const pickRandom = (source, n) => [...source].sort(() => Math.random() - 0.5).slice(0, n);

const renderCardContent = (ann) => `
  <h3 class="card-title">${ann.title}</h3>
  <p class="card-body">${ann.body}</p>
  ${ann.href ? `<a class="card-link" href="${ann.href}">Learn more →</a>` : ""}
`;

// -------- Layout includes --------
async function inject(url, targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;
  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    target.innerHTML = await res.text();
  } catch (e) {
    /* no-op in prod */
  }
}

async function loadLayout() {
  const headerUrl = document.querySelector('#site-header')?.getAttribute('data-include') || 'partials/header.html';
  const footerUrl = document.querySelector('#site-footer')?.getAttribute('data-include') || 'partials/footer.html';
  await Promise.all([
    inject(headerUrl, '#site-header'),
    inject(footerUrl, '#site-footer'),
  ]);
}

// -------- Highlights --------
let highlightAnnouncements = pickRandom(allAnnouncements, 3);

const renderHighlights = () => {
  const images = pickRandom(highlightImages, 3);
  document.querySelectorAll("[data-highlight-slot]").forEach((slot, i) => {
    const img = images[i % images.length];
    slot.style.backgroundImage = `url(${img})`;
    slot.style.backgroundSize = "cover";
    slot.style.backgroundPosition = "center";
    slot.style.color = "#fff";
    if (highlightAnnouncements[i]) slot.innerHTML = renderCardContent(highlightAnnouncements[i]);
  });
};

setInterval(() => {
  highlightAnnouncements = pickRandom(allAnnouncements, 3);
  renderHighlights();
}, 30 * 60 * 1000);

// Replace your existing rotateAnnouncementsGroup with this:
const rotateAnnouncementsGroup = (intervalMs = 6000, slideMs = 500) => {
  const slots = document.querySelectorAll("[data-announcement-slot]");
  if (!slots.length) return;

  // Exclude current highlights from the pool
  const pool = allAnnouncements.filter(a => !highlightAnnouncements.includes(a));

  // Track the current announcement in each slot
  const current = new Array(slots.length).fill(null);

  const renderRandomFor = (slotIdx) => {
    const slot = slots[slotIdx];
    const oldContent = slot.querySelector(".card-content");

    // Pick a random announcement not currently in this slot
    let next;
    do {
      next = pool[Math.floor(Math.random() * pool.length)];
    } while (next === current[slotIdx] && pool.length > 1);

    current[slotIdx] = next;

    const newContent = document.createElement("div");
    newContent.className = "card-content";
    newContent.style.transform = "translateX(-100%)";
    newContent.innerHTML = renderCardContent(next);
    slot.appendChild(newContent);

    // Animate in
    void newContent.offsetWidth;
    newContent.style.transform = "translateX(0)";
    if (oldContent) {
      oldContent.classList.add("outgoing");
      oldContent.style.transform = "translateX(100%)";
      setTimeout(() => oldContent.remove(), slideMs);
    }
  };

  // Initial fill
  slots.forEach((slot, i) => {
    const ann = pool[Math.floor(Math.random() * pool.length)];
    current[i] = ann;
    slot.innerHTML = `<div class="card-content" style="transform:translateX(0);">
      ${renderCardContent(ann)}
    </div>`;
  });

  // Each slot rotates independently at a random interval
  slots.forEach((_, slotIdx) => {
    const randomDelay = () => intervalMs + Math.floor(Math.random() * intervalMs);
    const rotate = () => {
      renderRandomFor(slotIdx);
      setTimeout(rotate, randomDelay());
    };
    setTimeout(rotate, randomDelay());
  });
};


// -------- Nav + Footer --------
const setActiveNav = () => {
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("header nav a").forEach(a => {
    const href = a.getAttribute("href") || "";
    if (href.endsWith(currentPage)) a.classList.add("active");
    if (currentPage === "index.html" && (href === "/" || href.endsWith("/index.html"))) a.classList.add("active");
  });
};

const setYear = () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = "" + new Date().getFullYear();
};

// Toggle dropdown on hamburger
function wireHamburger(){
  const header=document.querySelector('header');
  const btn=header?.querySelector('.nav-toggle');
  const nav=header?.querySelector('#primary-nav');
  if(!header||!btn||!nav) return;
  btn.addEventListener('click',()=>{
    const open=header.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded',open?'true':'false');
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    header.classList.remove('nav-open');
    btn.setAttribute('aria-expanded','false');
  }));
}

/* ---------- NEW: condense nav when brand+links don't fit one line ----------
   Assumes header markup:
   <nav id="primary-nav">
     <a class="brand-link">...</a>
     <div class="nav-links"> <a>Home</a> ... </div>
   </nav>

   Behavior:
   - When condensed, header gets .nav-condense. Hamburger shows, .nav-links hide.
   - When expanded, hamburger hides, .nav-links flow inline next to brand.
--------------------------------------------------------------------------- */
function updateNavCondense(){
  const header = document.querySelector('header');
  const row = header?.querySelector('.row');
  const nav = header?.querySelector('#primary-nav');
  if (!header || !row || !nav) return;

  // snapshot current state
  const wasCondensed = header.classList.contains('nav-condense');
  const wasOpen = header.classList.contains('nav-open');

  // Enter measuring mode: intrinsic widths, no hamburger
  header.classList.add('measuring');
  header.classList.remove('nav-condense', 'nav-open'); // ensure inline layout
  // Force a reflow so styles apply before measuring
  void nav.offsetWidth;

  // Compute needed vs available
  const needed = Math.ceil(nav.scrollWidth);          // intrinsic width of [brand + links]
  const avail  = Math.max(0, Math.floor(row.clientWidth - 24)); // small gutter

  const condense = needed > avail;

  // Exit measuring mode and set final state
  header.classList.remove('measuring');
  header.classList.toggle('nav-condense', condense);

  // Close dropdown if returning to full inline
  if (!condense && wasOpen) {
    header.classList.remove('nav-open');
    const btn = header.querySelector('.nav-toggle');
    if (btn) btn.setAttribute('aria-expanded','false');
  }
}


function wireNavCondense() {
  // run now and after layout shifts
  updateNavCondense();
  window.addEventListener('resize', updateNavCondense, {passive: true});
  // fonts/images can shift metrics
  setTimeout(updateNavCondense, 100);
  setTimeout(updateNavCondense, 500);
}

// --- Boot ---
document.addEventListener("DOMContentLoaded", async () => {
  await loadLayout();            // inject header/footer
  wireHamburger();               // hook hamburger behavior
  wireNavCondense();             // compute condensed vs full
  setActiveNav();
  setYear();
  renderHighlights();
  rotateAnnouncementsGroup();
});

/* ---- Under Construction redirect (env-agnostic) ---- */
const UC = (() => {
  // Normalize a path to '/foo/bar.html' form (strip trailing slash, add .html if missing)
  const norm = (pth) => {
    try {
      const url = new URL(pth, location.origin);
      let out = url.pathname;
      if (out.length > 1 && out.endsWith("/")) out = out.slice(0, -1);
      if (!out.endsWith(".html")) out = out + ".html";
      return out;
    } catch { return pth; }
  };

  // Pages to mark as under construction (both with and without .html are accepted)
  const PAGES = [
    "pages/services", "pages/blog", "pages/privacy", "pages/terms",
    "pages/open-source",
  ].map(norm);

  function maybeRedirect(){
    let here = location.pathname;
    if (here.length > 1 && here.endsWith("/")) here = here.slice(0, -1);
    if (!here.endsWith(".html")) here = here + ".html";

    if (here === norm("/under-construction.html")) return;
    if (PAGES.includes(here)) {
      const next = `pages/under-construction.html?from=${encodeURIComponent(location.pathname + location.search)}`;
      location.replace(next);
    }
  }
  return { maybeRedirect };
})();

// Run ASAP to avoid flicker
UC.maybeRedirect();
