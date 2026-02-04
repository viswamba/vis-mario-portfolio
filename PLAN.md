# Rleonardi-style "WOW" plan

Goal: make the visitor feel like they're *playing* the resume.

## Flow (chapters)

1. **Start / Controls**
   - "Press Start" overlay
   - Scroll-to-run instruction + mobile swipe
   - Audio toggle (off by default)

2. **About / Stats Power-ups**
   - Collect coins = headline stats (35M MAU, $5M saved, 140TB/day)
   - Quick "who I am" + roles

3. **Career Level Run (Timeline)**
   - Signposts become interactive NPCs
   - Each milestone opens a mini-scene (popup + small animation)

4. **Impact Boss Fights (Case studies)**
   - 2–3 featured achievements presented as "boss"
   - Defeat = reveal story + metrics + tools

5. **Skills + Certifications**
   - Skill blocks / pipes; hover reveals details

6. **Contact / End Flag**
   - Flagpole finish with contact links + downloadable resume

## Technical plan

- Convert current layout to a **horizontal world** wider than viewport.
- Use scroll position to drive:
  - camera translate
  - character run cycle
  - parallax layers
  - trigger animations + chapter transitions
- Add:
  - pixel SFX (optional) with WebAudio
  - subtle screen shake on milestone triggers
  - lazy-loaded sprite sheet (custom, non-Nintendo)

## TODO (next commits)

- [ ] Build world layout: sections on a long horizontal track
- [ ] Add camera system (translate world based on scroll)
- [ ] Add intro overlay + progress map
- [ ] Add interactive objects (coins, question blocks) tied to stats
- [ ] Add featured case studies as boss scenes
- [ ] Add simple audio toggle
- [ ] Make mobile controls smooth
