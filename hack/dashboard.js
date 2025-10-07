// dashboard.js - Analytics & Impact Map

// Mock metrics
const METRICS = {
  volunteers: 428,
  eventsThisMonth: 18,
  avgParticipationRate: 72, // percent
  spacesUtilized: 34,
};

// Mock time-series data for participation
const participationSeries = Array.from({ length: 12 }, (_, i) => ({
  label: new Date(2025, i, 1).toLocaleString('en', { month: 'short' }),
  value: Math.round(40 + Math.random() * 60),
}));

// Mock space usage breakdown
const spaceUsage = [
  { label: 'Classrooms', value: 38 },
  { label: 'Labs', value: 28 },
  { label: 'Venues', value: 20 },
  { label: 'Outdoors', value: 14 },
];

// Impact points for map (lat, lng, intensity [1..3])
const impactPoints = [
  { coord: [37.775, -122.4183], level: 3 },
  { coord: [37.777, -122.414], level: 2 },
  { coord: [37.772, -122.421], level: 1 },
  { coord: [37.779, -122.423], level: 2 },
  { coord: [37.771, -122.416], level: 3 },
  { coord: [37.773, -122.426], level: 1 },
];

// KPIs
function animateCount(el, to, suffix = ''){
  let start = 0; const duration = 900; const t0 = performance.now();
  function frame(now){
    const p = Math.min(1, (now - t0)/duration);
    const val = Math.floor(start + (to - start) * (p < 0.5 ? 2*p*p : -1 + (4 - 2*p) * p));
    el.textContent = `${val}${suffix}`;
    if(p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const kpiVolunteers = document.getElementById('kpiVolunteers');
const kpiEvents = document.getElementById('kpiEvents');
const kpiRate = document.getElementById('kpiRate');
const kpiSpaces = document.getElementById('kpiSpaces');

animateCount(kpiVolunteers, METRICS.volunteers);
animateCount(kpiEvents, METRICS.eventsThisMonth);
animateCount(kpiRate, METRICS.avgParticipationRate, '%');
animateCount(kpiSpaces, METRICS.spacesUtilized);

// Charts
const primary = '#6c8cff';
const purple = '#9b6bff';
const orange = '#ff7a45';
const gridColor = 'rgba(255,255,255,0.15)';
const textColor = '#e5e7ff';

// Participation over time (line)
const ctx1 = document.getElementById('chartParticipation').getContext('2d');
new Chart(ctx1, {
  type: 'line',
  data: {
    labels: participationSeries.map(d => d.label),
    datasets: [{
      label: 'Participation %',
      data: participationSeries.map(d => d.value),
      tension: 0.35,
      fill: true,
      backgroundColor: 'rgba(108,140,255,0.20)',
      borderColor: primary,
      borderWidth: 2,
      pointRadius: 0,
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: textColor } },
      y: { grid: { color: gridColor }, ticks: { color: textColor }, suggestedMin: 0, suggestedMax: 100 }
    }
  }
});

// Department-wise engagement (bar)
const deptData = [
  { dept: 'CS', value: 96 },
  { dept: 'ENG', value: 74 },
  { dept: 'BIO', value: 62 },
  { dept: 'BUS', value: 55 },
  { dept: 'ART', value: 48 },
  { dept: 'HUM', value: 39 },
];
const ctx3 = document.getElementById('chartDept').getContext('2d');
new Chart(ctx3, {
  type: 'bar',
  data: {
    labels: deptData.map(d => d.dept),
    datasets: [{
      label: 'Volunteers',
      data: deptData.map(d => d.value),
      backgroundColor: 'rgba(155,107,255,0.35)',
      borderColor: purple,
      borderWidth: 2,
      borderRadius: 8,
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: textColor } },
      y: { grid: { color: gridColor }, ticks: { color: textColor }, suggestedMin: 0 }
    }
  }
});

// Space usage (doughnut)
const ctx2 = document.getElementById('chartSpaceUsage').getContext('2d');
new Chart(ctx2, {
  type: 'doughnut',
  data: {
    labels: spaceUsage.map(s => s.label),
    datasets: [{
      data: spaceUsage.map(s => s.value),
      backgroundColor: [primary, '#34d399', orange, purple],
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 2,
      hoverOffset: 6,
    }]
  },
  options: {
    plugins: {
      legend: { position: 'bottom', labels: { color: textColor } }
    }
  }
});

// Impact Map (Leaflet)
const impactMap = L.map('impactMap', { zoomControl: true, attributionControl: false }).setView([37.775, -122.4183], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(impactMap);

function levelColor(level){
  return level === 3 ? '#ef4444' : level === 2 ? '#f59e0b' : '#60a5fa';
}

const circleMarkers = impactPoints.map((p, i) => {
  const color = levelColor(p.level);
  const circle = L.circleMarker(p.coord, {
    radius: 6 + p.level * 2,
    color,
    weight: 2,
    fillColor: color,
    fillOpacity: 0.85,
  }).addTo(impactMap);
  circle.bindPopup(`<b>Impact Level ${p.level}</b>`);
  setTimeout(() => circle.setStyle({ radius: 10 + p.level * 2 }), i * 80);
  return circle;
});

if(circleMarkers.length){
  const group = L.featureGroup(circleMarkers);
  impactMap.fitBounds(group.getBounds().pad(0.2));
}
