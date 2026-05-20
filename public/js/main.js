// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-msg">${message}</span>
    <button class="toast-close" onclick="removeToast(this.parentElement)">✕</button>
  `;
  container.appendChild(toast);

  setTimeout(() => removeToast(toast), 4000);
}

function removeToast(el) {
  if (!el || !el.parentElement) return;
  el.classList.add('removing');
  setTimeout(() => el.remove(), 300);
}

// Show flash message from server on page load
document.addEventListener('DOMContentLoaded', () => {
  const flashEl = document.getElementById('__flash__');
  if (flashEl) {
    const { type, message } = JSON.parse(flashEl.textContent || '{}');
    if (message) showToast(message, type || 'info');
  }

  // Init canvas if on routes page
  if (document.getElementById('route-canvas')) initCanvas();
});

// ── Modal ─────────────────────────────────────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});

// ── Route Optimizer Canvas ────────────────────────────────────────────────────
let canvas, ctx, points = [], activeRouteId = null, addingPoint = false;

function initCanvas() {
  canvas = document.getElementById('route-canvas');
  if (!canvas) return;
  const wrap = document.getElementById('route-canvas-wrap');
  canvas.width = wrap.offsetWidth;
  canvas.height = wrap.offsetHeight;
  ctx = canvas.getContext('2d');
  drawCanvas();

  canvas.addEventListener('click', (e) => {
    if (!addingPoint) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const name = document.getElementById('point-name').value.trim() || `Point ${points.length + 1}`;
    // Normalize to 0-1 range for lat/lng simulation
    const lat = 27 + (1 - y / canvas.height) * 3;
    const lng = 83 + (x / canvas.width) * 5;
    points.push({ id: points.length + 1, name, lat, lng, x, y });
    document.getElementById('point-name').value = '';
    addingPoint = false;
    canvas.style.cursor = 'crosshair';
    drawCanvas();
    if (points.length >= 2) {
      document.getElementById('optimize-wrap').classList.remove('hidden');
    }
    document.getElementById('canvas-hint').style.display = 'none';
  });
}

function addPointMode() {
  if (!activeRouteId) { showToast('Please load a route first.', 'warning'); return; }
  addingPoint = true;
  canvas.style.cursor = 'crosshair';
  showToast('Click on the canvas to place a delivery point.', 'info');
}

function loadRoute(id, start, end) {
  activeRouteId = id;
  points = [];
  document.getElementById('optimize-wrap').classList.add('hidden');
  document.getElementById('route-info-panel').classList.add('hidden');
  document.getElementById('canvas-hint').style.display = 'none';
  drawCanvas();
  showToast(`Route #${id} loaded: ${start} → ${end}`, 'info');
}

function clearCanvas() {
  points = [];
  activeRouteId = null;
  document.getElementById('optimize-wrap').classList.add('hidden');
  document.getElementById('route-info-panel').classList.add('hidden');
  document.getElementById('canvas-hint').style.display = '';
  drawCanvas();
}

function drawCanvas() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background grid
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  if (points.length === 0) return;

  // Draw path lines
  ctx.strokeStyle = '#4f46e5';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw points
  points.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = i === 0 ? '#10b981' : '#4f46e5';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label
    ctx.fillStyle = '#0f172a';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.fillText(p.name, p.x + 14, p.y + 4);

    // Order number
    ctx.fillStyle = 'white';
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(i + 1, p.x, p.y + 3);
    ctx.textAlign = 'left';
  });
}

async function runOptimize() {
  if (!activeRouteId || points.length < 2) {
    showToast('Add at least 2 points and load a route.', 'warning');
    return;
  }
  try {
    const res = await fetch('/routes/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ routeId: activeRouteId, points }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error || 'Optimization failed', 'error'); return; }

    const ordered = data.route.waypoints;
    // Remap canvas positions to optimized order
    const nameMap = Object.fromEntries(points.map(p => [p.name, p]));
    points = ordered.map(p => nameMap[p.name] || p);
    drawCanvas();

    const panel = document.getElementById('route-info-panel');
    const text = document.getElementById('route-result-text');
    text.innerHTML = `
      <strong>Distance:</strong> ${data.route.distance} km<br>
      <strong>Est. Time:</strong> ${data.route.estimatedTime} min<br>
      <strong>Stops:</strong> ${ordered.length}
    `;
    panel.classList.remove('hidden');
    showToast('Route optimized using Nearest Neighbour algorithm!', 'success');
  } catch (err) {
    showToast('Network error during optimization.', 'error');
  }
}
