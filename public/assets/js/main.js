/* public/js/main.js */

// --- MOCK DATA (Would come from API in real app) ---
const BRANCHES = [
    { id: 1, name: "Main Hub", city: "New York", lat: 40.7128, lng: -74.0060, manager: "Admin User", contact: "555-0101" },
    { id: 2, name: "West Side", city: "Newark", lat: 40.7357, lng: -74.1724, manager: "Mike Ross", contact: "555-0102" },
    { id: 3, name: "East Side", city: "Brooklyn", lat: 40.6782, lng: -73.9442, manager: "Rachel Zane", contact: "555-0103" },
    { id: 4, name: "North Depot", city: "Yonkers", lat: 40.9312, lng: -73.8988, manager: "Louis Litt", contact: "555-0104" },
    { id: 5, name: "South Point", city: "Staten Island", lat: 40.5795, lng: -74.1502, manager: "Donna Paulsen", contact: "555-0105" },
];

let PARCELS = [
    { id: "TRK-1001", sender: "John Smith", receiver: "Sarah Connor", from: "Main Hub", to: "West Side", status: "In Transit", date: "2023-10-23" },
    { id: "TRK-1002", sender: "Alice Wonderland", receiver: "Bob Builder", from: "East Side", to: "North Depot", status: "Pending", date: "2023-10-24" },
    { id: "TRK-1003", sender: "Charlie Brown", receiver: "Snoopy Dog", from: "South Point", to: "Main Hub", status: "Delivered", date: "2023-10-20" },
];

// --- AUTH LOGIC ---
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;

        // In a real app, fetch('/api/login', ...)
        if (email && pass) {
            window.location.href = '/dashboard'; // Redirect to dashboard
        }
    });
}

// --- GLOBAL UTILITIES ---
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    let color = 'var(--primary)';
    if (type === 'success') color = 'var(--success)';
    if (type === 'error') color = 'var(--danger)';

    toast.style.borderLeftColor = color;
    toast.innerHTML = `<div style="width: 10px; height: 10px; border-radius: 50%; background: ${color}"></div><span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- DASHBOARD LOGIC ---
function renderRecentActivity() {
    const tbody = document.getElementById('recent-activity-body');
    if (!tbody) return;

    tbody.innerHTML = PARCELS.slice(0, 5).map(p => `
        <tr>
            <td class="font-bold text-primary">${p.id}</td>
            <td>${p.sender}</td>
            <td><span class="status-badge ${getStatusClass(p.status)}">${p.status}</span></td>
            <td class="text-sm text-muted">${p.date}</td>
        </tr>
    `).join('');
}

function getStatusClass(status) {
    switch (status) {
        case 'Pending': return 'status-pending';
        case 'In Transit': return 'status-transit';
        case 'Delivered': return 'status-delivered';
        default: return '';
    }
}

// --- PARCEL LOGIC ---
function renderParcelsTable(filter = 'all') {
    const tbody = document.getElementById('parcels-table-body');
    if (!tbody) return;

    const filtered = filter === 'all' ? PARCELS : PARCELS.filter(p => p.status === filter);
    tbody.innerHTML = filtered.map(p => `
        <tr>
            <td class="font-bold text-primary">${p.id}</td>
            <td>${p.sender}</td>
            <td>${p.receiver}</td>
            <td>${p.to}</td>
            <td><span class="status-badge ${getStatusClass(p.status)}">${p.status}</span></td>
            <td><button class="btn btn-outline" style="padding:0.2rem 0.5rem;">Edit</button></td>
        </tr>
    `).join('');
}

const parcelFilter = document.getElementById('parcel-filter');
if (parcelFilter) {
    parcelFilter.addEventListener('change', (e) => renderParcelsTable(e.target.value));
}

// --- TRACKING LOGIC ---
function trackParcel() {
    const id = document.getElementById('track-input').value;
    if (!id) { showToast("Please enter a tracking ID", "error"); return; }
    document.getElementById('tracking-result').classList.remove('hidden');
    showToast("Tracking information found", "success");
}

// --- MODAL LOGIC ---
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function handleParcelCreate(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newParcel = {
        id: `TRK-${1000 + PARCELS.length + 1}`,
        sender: formData.get('sender'),
        receiver: formData.get('receiver'),
        from: formData.get('origin'),
        to: formData.get('destination'),
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
    };
    PARCELS.unshift(newParcel);
    // If we are on parcels page, refresh
    renderParcelsTable();
    renderRecentActivity();
    closeModal('createParcelModal');
    showToast(`Parcel ${newParcel.id} created successfully!`, "success");
    e.target.reset();
}

// --- ROUTE OPTIMIZER (2D TOOL) ---
let mapConfig = { scale: 0, offsetX: 0, offsetY: 0 };

function resizeCanvas() {
    const container = document.getElementById('map-container');
    const canvas = document.getElementById('routeCanvas');
    if (container && canvas) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
}

function project(lat, lng) {
    const centerLat = (BRANCHES.reduce((s, b) => s + b.lat, 0) / BRANCHES.length);
    const centerLng = (BRANCHES.reduce((s, b) => s + b.lng, 0) / BRANCHES.length);
    const rangeLat = 0.6;
    mapConfig.scale = canvas.height / rangeLat;
    const x = (lng - centerLng) * mapConfig.scale + (canvas.width / 2);
    const y = (centerLat - lat) * mapConfig.scale + (canvas.height / 2);
    return { x, y };
}

function deg2rad(deg) { return deg * (Math.PI / 180); }

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function calculateNearestNeighbor(startId, points) {
    const startPoint = points.find(p => p.id == startId);
    let unvisited = points.filter(p => p.id != startId);
    let path = [startPoint];
    let current = startPoint;
    let totalDist = 0;

    while (unvisited.length > 0) {
        let nearest = null, minDst = Infinity, nearestIdx = -1;
        unvisited.forEach((p, idx) => {
            const dst = getDistance(current.lat, current.lng, p.lat, p.lng);
            if (dst < minDst) { minDst = dst; nearest = p; nearestIdx = idx; }
        });
        if (nearest) {
            totalDist += minDst;
            path.push(nearest);
            current = nearest;
            unvisited.splice(nearestIdx, 1);
        } else break;
    }
    return { path, totalDist };
}

function drawMap(path = []) {
    const canvas = document.getElementById('routeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
    for (let i = 0; i < canvas.height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }

    // Path
    if (path.length > 1) {
        ctx.beginPath(); ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 3; ctx.setLineDash([5, 5]);
        const start = project(path[0].lat, path[0].lng);
        ctx.moveTo(start.x, start.y);
        for (let i = 1; i < path.length; i++) {
            const p = project(path[i].lat, path[i].lng);
            ctx.lineTo(p.x, p.y);
        }
        ctx.stroke(); ctx.setLineDash([]);
    }

    // Points
    BRANCHES.forEach(b => {
        const pos = project(b.lat, b.lng);
        ctx.beginPath();
        ctx.fillStyle = path.length > 0 && path.find(p => p.id === b.id) ? '#2563eb' : '#64748b';
        ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1e293b'; ctx.font = 'bold 12px sans-serif';
        ctx.fillText(b.name, pos.x + 10, pos.y + 4);
    });
}

function runOptimization() {
    const startId = document.getElementById('start-point-select').value;
    showToast("Calculating optimal route...", "info");
    setTimeout(() => {
        const result = calculateNearestNeighbor(startId, BRANCHES);
        drawMap(result.path);
        document.getElementById('route-stats').classList.remove('hidden');
        document.getElementById('total-dist').innerText = result.totalDist.toFixed(2) + ' km';
        document.getElementById('route-seq').innerText = result.path.map(p => p.name.split(' ')[0]).join(' → ');
        showToast("Route optimized!", "success");
    }, 500);
}

function resetMap() {
    drawMap([]);
    document.getElementById('route-stats').classList.add('hidden');
}

// --- INITIALIZATION CHECKS ---
document.addEventListener('DOMContentLoaded', () => {
    renderRecentActivity();
    renderParcelsTable();

    // Populate Selects if they exist
    const originSelect = document.getElementById('modal-branches-origin');
    const destSelect = document.getElementById('modal-branches-dest');
    const mapSelect = document.getElementById('start-point-select');

    if (originSelect && destSelect && mapSelect) {
        const options = BRANCHES.map(b => `<option value="${b.name}">${b.name} (${b.city})</option>`).join('');
        originSelect.innerHTML = options;
        destSelect.innerHTML = options;
        mapSelect.innerHTML = BRANCHES.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
    }

    // Init Map Tool only if on routes page
    if (document.getElementById('routeCanvas')) {
        window.addEventListener('resize', () => { resizeCanvas(); drawMap(); });
        resizeCanvas();
        drawMap();
    }
});