const ui = {
  start: document.getElementById('start'),
  btnStart: document.getElementById('btnStart'),
  btnAudio: document.getElementById('btnAudio'),
  hero: document.getElementById('about'),
};

let audioOn = false;

function setAudio(on){
  audioOn = on;
  if(ui.btnAudio){
    ui.btnAudio.textContent = `Audio: ${on ? 'ON' : 'OFF'}`;
    ui.btnAudio.setAttribute('aria-pressed', String(on));
  }
}

function startExperience(){
  if(ui.start) ui.start.style.display = 'none';
  if(ui.hero) ui.hero.hidden = false;
  // scroll to game
  document.getElementById('game')?.scrollIntoView({behavior:'smooth'});
}

ui.btnStart?.addEventListener('click', startExperience);
ui.btnAudio?.addEventListener('click', () => setAudio(!audioOn));
setAudio(false);

const milestones = [
  {
    title: "Microsoft (2016–2017) — Data Analyst, Transaction Experiences",
    bullets: [
      "Built exec dashboards for Outlook leadership; improved bug prioritization.",
      "Automated workflows saving ~300 man-hours/month and boosting efficiency ~17%."
    ]
  },
  {
    title: "Microsoft (2017–2020) — Data Analyst 2 (fast-track)",
    bullets: [
      "Owned Azure Data Factory for Knowledge Mining; ~140TB/day across 89 pipelines.",
      "Deployed text models (95%+ accuracy) for 10M+ monthly email extractions.",
      "Improved entity recognition pipeline; ~50% compute time reduction post-optimization."
    ]
  },
  {
    title: "Microsoft (2020–2023) — Technical Lead, Data Analytics",
    bullets: [
      "Shipped roadmap + execution for Viva Topics at Ignite; impacted 35M MAU.",
      "Drove AI ops PM work cutting ~$5M/year and contributing to 2 patent filings.",
      "Launched leadership analytics portal saving ~$2M; created org expansion plan.",
      "Built workflow optimization tool increasing throughput 25% for 400-person vendor org.",
      "Mentored 20 interns; 95% full-time conversion rate."
    ]
  },
  {
    title: "Creative Destruction Lab (2024) — Venture Management Analyst",
    bullets: [
      "Attracted 260 startups for Advanced Manufacturing & Computational Health streams.",
      "Ran diligence: 68 interviews; curated 38 ML/AI/Industrial IoT/Digital Twin startups."
    ]
  },
  {
    title: "UW Foster MBA (Mar 2025) — Management Science (STEM)",
    bullets: [
      "GMAT 740 (97%ile), Dean’s Merit Scholar.",
      "VP, Entrepreneurship & Venture Capital Club.",
      "Runner-up in acquisition-focused MBA case competition (20 teams).",
      "Built economic impact analysis models integrating macro + micro data."
    ]
  },
  {
    title: "Nordstrom (2025-06-22) — Technical Product Manager",
    bullets: [
      "Product Insights & Performance Optimization under Merchandising.",
      "Led analytics portal for internal buy pods + external suppliers.",
      "Partnered on ML-based recommendations to improve buyer outcomes ~15%."
    ]
  },
  {
    title: "Amazon (2025-06-23–Present) — Senior Vendor Manager",
    bullets: [
      "Own a retail category doing ~$500M in annual sales.",
      "Drive vendor strategy, selection, and growth across the category."
    ]
  }
];

const track = document.getElementById('track');
const camera = document.getElementById('camera');
const mario = document.getElementById('mario');
const progressEl = document.getElementById('progress');
const mileLabel = document.getElementById('mileLabel');
const card = document.getElementById('card');
const cardTitle = document.getElementById('cardTitle');
const cardBody = document.getElementById('cardBody');
const cardClose = document.getElementById('cardClose');

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

let running = false;

function getRunProgress(){
  // Progress is driven by holding SPACE (desktop) or holding the on-screen button (mobile).
  // Speed is constant for now; later we can add easing/accel.
  return window.__runProgress || 0;
}

function setRunProgress(p){
  window.__runProgress = clamp(p, 0, 1);
}

let lastP = 0;
let lastMoveTs = 0;

let lastTs = performance.now();
function render(){
  const now = performance.now();
  const dt = Math.min(0.05, (now - lastTs) / 1000);
  lastTs = now;

  // advance progress while running
  if(running){
    setRunProgress(getRunProgress() + dt * 0.08); // ~12.5s for full run
  }

  const p = getRunProgress();
  const dx = (p - lastP);
  const moving = Math.abs(dx) > 0.00001;

  if(moving){
    lastMoveTs = performance.now();
    mario.classList.add('running');
  } else {
    // small delay before stopping animation
    if(performance.now() - lastMoveTs > 120){
      mario.classList.remove('running');
    }
  }

  // Camera system: keep Mario near a comfortable screen position while world scrolls.
  // We render the world in a wide virtual space (WORLD_W px) and translate the camera.
  const WORLD_W = 5200;
  const VIEW_W = track.clientWidth;
  const marioX = 220 + p * (WORLD_W - 440); // keep off edges
  const cameraX = clamp(marioX - VIEW_W * 0.35, 0, WORLD_W - VIEW_W);

  if(camera){
    camera.style.transform = `translateX(${-cameraX}px)`;
  }
  // Mario is positioned in world coordinates inside the camera.
  mario.style.left = `${marioX}px`;

  // Parallax backgrounds
  const far = document.querySelector('.level__parallax--far');
  const near = document.querySelector('.level__parallax--near');
  far.style.transform = `translateX(${-p*240}px)`;
  near.style.transform = `translateX(${-p*420}px)`;

  // HUD progress
  progressEl.style.width = `${(p*100).toFixed(1)}%`;

  // Update mile label based on nearest sign
  const mile = nearestMile(p);
  mileLabel.textContent = mile !== null ? `MILE ${mile+1}/${milestones.length}` : 'RUN';

  lastP = p;
  requestAnimationFrame(render);
}

function nearestMile(p){
  const signs = Array.from(document.querySelectorAll('.signpost'));
  let best = null;
  let bestD = 999;
  signs.forEach(s => {
    const leftPct = parseFloat(s.style.left) / 100;
    const d = Math.abs(leftPct - p);
    if(d < bestD){ bestD = d; best = Number(s.dataset.mile); }
  });
  // only snap when within range
  if(bestD < 0.06) return best;
  return null;
}

function openCard(i){
  const m = milestones[i];
  if(!m) return;
  cardTitle.textContent = m.title;
  const list = `<ul>${m.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`;
  cardBody.innerHTML = list;
  card.classList.add('open');
  card.setAttribute('aria-hidden', 'false');
}

function closeCard(){
  card.classList.remove('open');
  card.setAttribute('aria-hidden', 'true');
}

function escapeHtml(str){
  return str
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}

// Signpost click handlers
Array.from(document.querySelectorAll('.signpost__sign')).forEach(btn => {
  btn.addEventListener('click', (e) => {
    const parent = e.target.closest('.signpost');
    openCard(Number(parent.dataset.mile));
  });
});

cardClose.addEventListener('click', closeCard);
window.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeCard();
});

// Run controls
const runBtn = document.getElementById('runBtn');
function setRunning(on){
  running = on;
  if(on){
    mario.classList.add('running');
  } else {
    mario.classList.remove('running');
  }
}

window.addEventListener('keydown', (e) => {
  if(e.code === 'Space'){
    e.preventDefault();
    setRunning(true);
  }
});
window.addEventListener('keyup', (e) => {
  if(e.code === 'Space'){
    e.preventDefault();
    setRunning(false);
  }
});

// Mobile button (also works with mouse)
runBtn?.addEventListener('pointerdown', (e) => { e.preventDefault(); setRunning(true); });
runBtn?.addEventListener('pointerup', (e) => { e.preventDefault(); setRunning(false); });
runBtn?.addEventListener('pointercancel', () => setRunning(false));
runBtn?.addEventListener('pointerleave', () => setRunning(false));

// On start, reset progress and focus the game section.
ui.btnStart?.addEventListener('click', () => { setRunProgress(0); });

render();
