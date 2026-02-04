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
const mario = document.getElementById('mario');
const progressEl = document.getElementById('progress');
const mileLabel = document.getElementById('mileLabel');
const card = document.getElementById('card');
const cardTitle = document.getElementById('cardTitle');
const cardBody = document.getElementById('cardBody');
const cardClose = document.getElementById('cardClose');

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

function getScrollProgress(){
  const level = document.getElementById('timeline');
  const rect = level.getBoundingClientRect();

  // Progress from when the section enters viewport to when it leaves.
  const total = window.innerHeight + rect.height;
  const passed = window.innerHeight - rect.top;
  return clamp(passed / total, 0, 1);
}

let lastP = 0;
let lastMoveTs = 0;

function render(){
  const p = getScrollProgress();
  const dx = (p - lastP);
  const moving = Math.abs(dx) > 0.0005;

  if(moving){
    lastMoveTs = performance.now();
    mario.classList.add('running');
  } else {
    // small delay before stopping animation
    if(performance.now() - lastMoveTs > 120){
      mario.classList.remove('running');
    }
  }

  // Mario X position within the track
  const x = (p * 84); // keep him away from absolute edges
  mario.style.transform = `translateX(${x}vw)`;

  // Parallax backgrounds
  const far = document.querySelector('.level__parallax--far');
  const near = document.querySelector('.level__parallax--near');
  far.style.transform = `translateX(${-p*120}px)`;
  near.style.transform = `translateX(${-p*220}px)`;

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

render();
