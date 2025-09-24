// js/app.js  (swipe-away preserved, boxes change at random times; no CSS added)

// -------- Data --------
const allAnnouncements = [
  { title: "New OSS Release", body: "We shipped v1.2 of Ledgernaut—now with faster sync.", href: "pages/open-source.html" },
  { title: "Bug Bash Friday", body: "Community triage session this Friday @ 2pm CT.", href: "pages/blog.html" },
  { title: "Security Update", body: "Important patch for OAuth proxy—review our notes.", href: "pages/blog.html" },
  { title: "Solutions", body: "Cloud-native platforms, data pipelines, and secure APIs built on proven OSS.", href: "pages/services.html" },
  { title: "Open Source", body: "We maintain libraries and contribute upstream. Sustainability matters.", href: "pages/open-source.html" },
  { title: "Work With Us", body: "Join a team that ships and shares. Remote-friendly, impact-driven.", href: "pages/careers.html" },
  { title: "Hiring Maintainers", body: "Paid part-time roles for OSS maintainers.", href: "pages/careers.html" },
  { title: "Client Spotlight", body: "Open standards integration for a fintech leader.", href: "pages/services.html" },
  { title: "RFP Window", body: "Seeking partners for healthcare data pipelines.", href: "pages/contact.html" },
  { title: "Sponsor Us", body: "Back our work to keep core libraries sustainable.", href: "pages/open-source.html" },
  { title: "Docs Refresh", body: "Improved developer guides & API examples.", href: "pages/blog.html" },
  { title: "Meetup", body: "Phoenix OSS meetup—cohosted with local devs.", href: "pages/blog.html" },
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
const pickRandom = (src, n) => [...src].sort(() => Math.random() - 0.5).slice(0, n);
const rnd = (min, max) => Math.floor(min + Math.random() * (max - min));
const cardHTML = (ann) => `
  <h3 class="card-title">${ann.title}</h3>
  <p class="card-body">${ann.body}</p>
  ${ann.href ? `<a class="card-link" href="${ann.href}">Learn more →</a>` : ""}
`;

// -------- Layout includes (relative) --------
async function inject(url, targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;
  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error();
    target.innerHTML = await res.text();
  } catch {}
}

async function loadLayout() {
  const headerUrl = document.querySelector('#site-header')?.getAttribute('data-include') || 'partials/header.html';
  const footerUrl = document.querySelector('#site-footer')?.getAttribute('data-include') || 'partials/footer.html';
  await Promise.all([inject(headerUrl, '#site-header'), inject(footerUrl, '#site-footer')]);
}

// -------- Highlights --------
let highlightAnnouncements = pickRandom(allAnnouncements, 3);

function renderHighlights() {
  const images = pickRandom(highlightImages, 3);
  document.querySelectorAll("[data-highlight-slot]").forEach((slot, i) => {
    const img = images[i % images.length];
    slot.style.backgroundImage = `url(${img})`;
    slot.style.backgroundSize = "cover";
    slot.style.backgroundPosition = "center";
    if (highlightAnnouncements[i]) slot.innerHTML = cardHTML(highlightAnnouncements[i]);
  });
}

setInterval(() => {
  highlightAnnouncements = pickRandom(allAnnouncements, 3);
  renderHighlights();
}, 30 * 60 * 1000);

// -------- Announcements: independent, random timing, swipe-away --------
function rotateAnnouncementsGroup(baseMs = 6000, slideMs = 500) {
  const slots = document.querySelectorAll("[data-announcement-slot]");
  if (!slots.length) return;

  const pool = allAnnouncements.filter(a => !highlightAnnouncements.includes(a));
  if (!pool.length) return;

  const pickOne = () => pool[Math.floor(Math.random() * pool.length)];
  const nextDelay = () => Math.round(baseMs * (0.75 + Math.random() * 0.5)); // 0.75x–1.25x

  slots.forEach((slot) => {
    // initial content
    const first = document.createElement("div");
    first.className = "card-content";
    first.style.transform = "translateX(0)";
    first.innerHTML = cardHTML(pickOne());
    slot.innerHTML = "";
    slot.appendChild(first);

    const tick = () => {
      const oldEl = slot.querySelector(".card-content");
      const incoming = document.createElement("div");
      incoming.className = "card-content";
      incoming.style.transform = "translateX(-100%)"; // start off-screen left
      incoming.innerHTML = cardHTML(pickOne());
      slot.appendChild(incoming);

      // force reflow then animate
      void incoming.offsetWidth;
      incoming.style.transform = "translateX(0)";
      if (oldEl) {
        oldEl.style.transform = "translateX(100%)"; // swipe away right (same as before)
        setTimeout(() => oldEl.remove(), slideMs);
      }

      setTimeout(tick, nextDelay());
    };

    // stagger starts so they don't move together
    setTimeout(tick, rnd(0, baseMs));
  });
}

// -------- Nav + Footer --------
function setActiveNav() {
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("header nav a").forEach(a => {
    const href = a.getAttribute("href") || "";
    if (href.endsWith(currentPage)) a.classList.add("active");
    if (currentPage === "index.html" && (href === "/" || href.endsWith("/index.html"))) a.classList.add("active");
  });
}

function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = "" + new Date().getFullYear();
}

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

function updateNavCondense(){
  const header = document.querySelector('header');
  const row = header?.querySelector('.row');
  const nav = header?.querySelector('#primary-nav');
  if (!header || !row || !nav) return;

  const wasOpen = header.classList.contains('nav-open');
  header.classList.add('measuring');
  header.classList.remove('nav-condense','nav-open');
  void nav.offsetWidth;

  const needed = Math.ceil(nav.scrollWidth);
  const avail  = Math.max(0, Math.floor(row.clientWidth - 24));
  const condense = needed > avail;

  header.classList.remove('measuring');
  header.classList.toggle('nav-condense', condense);

  if (!condense && wasOpen) {
    header.classList.remove('nav-open');
    const btn = header.querySelector('.nav-toggle');
    if (btn) btn.setAttribute('aria-expanded','false');
  }
}

function wireNavCondense() {
  updateNavCondense();
  window.addEventListener('resize', updateNavCondense, {passive:true});
  setTimeout(updateNavCondense, 100);
  setTimeout(updateNavCondense, 500);
}

// ---- Boot ----
document.addEventListener("DOMContentLoaded", async () => {
  await loadLayout();
  wireHamburger();
  wireNavCondense();
  setActiveNav();
  setYear();
  renderHighlights();
  rotateAnnouncementsGroup(6000, 500);
});
