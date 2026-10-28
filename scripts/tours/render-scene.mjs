export function renderSceneHtml(tour, scene, sceneIndex, thumbFiles) {
  const accent = tour.accent
  const body = renderBody(tour, scene, thumbFiles)
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${escapeHtml(tour.name)} tour</title>
<style>
:root {
  --accent: ${accent};
  --accent-soft: color-mix(in srgb, ${accent} 70%, white);
  --bg: #070b12;
  --ink: #eef3fa;
  --muted: #93a0b5;
  --line: rgba(255,255,255,0.12);
  --panel: rgba(14, 18, 28, 0.92);
  --sans: "Segoe UI", system-ui, sans-serif;
}
* { box-sizing: border-box; }
html, body {
  margin: 0; width: 1920px; height: 1080px; overflow: hidden;
  font-family: var(--sans); color: var(--ink);
  background:
    radial-gradient(ellipse at 15% 10%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 42%),
    radial-gradient(ellipse at 85% 90%, rgba(56,189,248,0.08), transparent 40%),
    linear-gradient(155deg, #080b12, #121826 55%, #070a10);
}
.wrap { padding: 56px 64px; height: 100%; position: relative; }
.badge {
  display: inline-flex; gap: 8px; align-items: center;
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  color: var(--accent-soft); border-radius: 999px; padding: 8px 14px;
  letter-spacing: 0.14em; text-transform: uppercase; font-size: 14px; font-weight: 700;
}
h1 { margin: 18px 0 14px; font-size: 78px; line-height: 0.95; letter-spacing: -0.03em; }
h2 { margin: 16px 0 12px; font-size: 52px; letter-spacing: -0.02em; }
.lead { max-width: 980px; color: var(--muted); font-size: 28px; line-height: 1.45; }
.footer {
  position: absolute; left: 64px; bottom: 44px; color: var(--muted);
  font-size: 18px; letter-spacing: 0.04em;
}
.features {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 34px;
}
.feature {
  min-height: 190px; padding: 24px; border-radius: 16px; border: 1px solid var(--line);
  background: rgba(255,255,255,0.03);
}
.feature strong { display: block; color: var(--accent-soft); font-size: 22px; margin-bottom: 10px; }
.feature p { margin: 0; color: var(--muted); font-size: 18px; line-height: 1.45; }
.steps { margin-top: 28px; display: grid; gap: 14px; max-width: 1100px; }
.step {
  display: grid; grid-template-columns: 64px 1fr; gap: 16px; align-items: center;
  padding: 16px 18px; border-radius: 14px; border: 1px solid var(--line);
  background: var(--panel); font-size: 24px;
}
.num {
  width: 48px; height: 48px; border-radius: 12px; display: grid; place-items: center;
  background: color-mix(in srgb, var(--accent) 22%, transparent); color: var(--accent-soft); font-weight: 800;
}
.yt-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 28px;
}
.yt-card {
  border-radius: 16px; overflow: hidden; border: 1px solid var(--line); background: #0c111a;
  box-shadow: 0 18px 40px rgba(0,0,0,0.28);
}
.yt-card img { width: 100%; height: 280px; object-fit: cover; display: block; background: #111; }
.yt-card .cap {
  padding: 14px 16px; font-size: 18px; color: #d7dee9; min-height: 74px;
  border-top: 1px solid var(--line);
}
.yt-card .cap small { display: block; color: var(--accent-soft); margin-bottom: 4px; letter-spacing: 0.08em; text-transform: uppercase; font-size: 12px; }
.callout {
  margin-top: 28px; padding: 20px 24px; border-left: 4px solid var(--accent);
  background: rgba(255,255,255,0.03); font-size: 24px; max-width: 1000px;
}
.mark {
  position: absolute; right: 60px; bottom: 40px; font-size: 120px; font-weight: 800;
  opacity: 0.07; letter-spacing: -0.04em;
}
</style>
</head>
<body>
  <div class="wrap">
    <div class="badge">${escapeHtml(scene.badge || tour.category)}</div>
    ${body}
    <div class="footer">Solonaras Store · ${escapeHtml(tour.name)} · Scene ${sceneIndex + 1}</div>
    <div class="mark">S</div>
  </div>
</body>
</html>`
}

function renderBody(tour, scene, thumbFiles) {
  if (scene.type === 'intro' || scene.type === 'outro') {
    return `
      <h1>${escapeHtml(scene.title)}</h1>
      <p class="lead">${escapeHtml(scene.lead)}</p>
      ${scene.type === 'outro' ? `<div class="callout">Built by Solonaras · Cyprus</div>` : ''}
    `
  }
  if (scene.type === 'features') {
    return `
      <h2>${escapeHtml(scene.title)}</h2>
      <p class="lead">${escapeHtml(scene.lead || '')}</p>
      <div class="features">
        ${(scene.items || [])
          .map(
            (item) => `
          <div class="feature">
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.text)}</p>
          </div>`,
          )
          .join('')}
      </div>
    `
  }
  if (scene.type === 'steps') {
    return `
      <h2>${escapeHtml(scene.title)}</h2>
      <div class="steps">
        ${(scene.steps || [])
          .map(
            (step, i) => `
          <div class="step">
            <div class="num">${String(i + 1).padStart(2, '0')}</div>
            <div>${escapeHtml(step)}</div>
          </div>`,
          )
          .join('')}
      </div>
    `
  }
  if (scene.type === 'youtube') {
    const cards = (thumbFiles || [])
      .map(
        (file, i) => `
        <div class="yt-card">
          <img src="${file.replace(/\\/g, '/')}" alt="" />
          <div class="cap">
            <small>YouTube</small>
            ${escapeHtml((tour.youtubeTitles && tour.youtubeTitles[i]) || 'Related clip')}
          </div>
        </div>`,
      )
      .join('')
    return `
      <h2>${escapeHtml(scene.title)}</h2>
      <p class="lead">${escapeHtml(scene.lead || '')}</p>
      <div class="yt-grid">${cards}</div>
    `
  }
  return `<h2>${escapeHtml(scene.title || tour.name)}</h2>`
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
