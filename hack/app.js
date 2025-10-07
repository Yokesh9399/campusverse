// App.js - Homepage interactions for Campus Engagement Navigator

// Mock data
const VOLUNTEER_OPPS = [
  { id: 1, title: 'Riverbank Clean-up', category: 'environment', program: 'BIO', time: 'this-week', location: [37.7749, -122.4194], venueType: 'venue', icon: 'ri-leaf-line', participants: 86, capacity: 120 },
  { id: 2, title: 'Peer Tutoring - CS101', category: 'education', program: 'CS', time: 'this-month', location: [37.7739, -122.4134], venueType: 'classroom', icon: 'ri-book-2-line', participants: 42, capacity: 60 },
  { id: 3, title: 'Health Camp Outreach', category: 'health', program: 'BIO', time: 'weekend', location: [37.7799, -122.4184], venueType: 'venue', icon: 'ri-heart-2-line', participants: 64, capacity: 100 },
  { id: 4, title: 'Makerspace Robotics Assist', category: 'tech', program: 'ENG', time: 'this-month', location: [37.7762, -122.4234], venueType: 'lab', icon: 'ri-cpu-line', participants: 25, capacity: 40 },
  { id: 5, title: 'Campus Mural Painting', category: 'arts', program: 'BUS', time: 'this-week', location: [37.7722, -122.4251], venueType: 'venue', icon: 'ri-brush-line', participants: 58, capacity: 80 },
  { id: 6, title: 'Open Lab Night Mentor', category: 'tech', program: 'CS', time: 'weekend', location: [37.7711, -122.4167], venueType: 'lab', icon: 'ri-cpu-line', participants: 31, capacity: 50 },
];

const UPCOMING_EVENTS = [
  { name: 'Volunteer Fair', date: 'Oct 10', location: 'Student Center' },
  { name: 'Green Campus Day', date: 'Oct 14', location: 'Main Quad' },
  { name: 'Health & Wellness Drive', date: 'Oct 20', location: 'Hall B' },
  { name: 'Tech for Good Hack', date: 'Oct 26', location: 'Makers Lab' },
];

// DOM refs
const cardsEl = document.getElementById('cards');
const eventsListEl = document.getElementById('eventsList');
const searchInput = document.getElementById('searchInput');
const programFilter = document.getElementById('programFilter');
const timeFilter = document.getElementById('timeFilter');
const searchBtn = document.getElementById('searchBtn');
const chipButtons = Array.from(document.querySelectorAll('.chip'));
const ssoModal = document.getElementById('ssoModal');
const btnSSO = document.getElementById('btnSSO');
const btnSSOGuest = document.getElementById('btnSSOGuest');
const mobilePreviewBtn = document.getElementById('btnMobilePreview');
const pointsBadge = document.getElementById('pointsBadge');
const langSelect = document.getElementById('langSelect');
const recoGrid = document.getElementById('recoGrid');
const galleryGrid = document.getElementById('galleryGrid');
const toggleLandmarks = document.getElementById('toggleLandmarks');
const toggleAccessible = document.getElementById('toggleAccessible');
const btnTheme = document.getElementById('btnTheme');
// New section refs
const storiesGrid = document.getElementById('storiesGrid');
const highlightsFeed = document.getElementById('highlightsFeed');
const lostFoundGrid = document.getElementById('lostFoundGrid');
const utilitiesGrid = document.getElementById('utilitiesGrid');
const leaderboardGrid = document.getElementById('leaderboard');
const certificatesGrid = document.getElementById('certificates');
// Messaging drawer & chatbot
const drawer = document.getElementById('messagesDrawer');
const closeDrawerBtn = document.getElementById('closeDrawer');
const messagesList = document.getElementById('messagesList');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessage');
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotBody = document.getElementById('chatbotBody');
const chatbotText = document.getElementById('chatbotText');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotClose = document.getElementById('chatbotClose');

// Helpers
let activeCategory = '';
let points = 0;
const userProfile = { program: 'CS', interests: ['tech', 'education'], past: ['Peer Tutoring - CS101'] };
function categoryBadgeClass(cat){
  switch(cat){
    case 'environment': return 'cat-environment';
    case 'education': return 'cat-education';
    case 'health': return 'cat-health';
    case 'tech': return 'cat-tech';
    case 'arts': return 'cat-arts';
    default: return '';
  }
}
function matchesFilters(opp) {
  const q = (searchInput.value || '').trim().toLowerCase();
  const matchQ = !q || opp.title.toLowerCase().includes(q);
  const matchCat = !activeCategory || opp.category === activeCategory;
  const matchProg = !programFilter.value || opp.program === programFilter.value;
  const matchTime = !timeFilter.value || opp.time === timeFilter.value;
  return matchQ && matchCat && matchProg && matchTime;
}

// Render volunteer cards
function renderCards() {
  cardsEl.innerHTML = '';
  const filtered = VOLUNTEER_OPPS.filter(matchesFilters);
  filtered.forEach((opp, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="header">
        <div class="icon"><i class="${opp.icon}"></i></div>
        <div>
          <div class="title">${opp.title}</div>
          <div class="meta">
            <span class="badge-cat ${categoryBadgeClass(opp.category)}">${opp.category}</span>
            <span><i class="ri-graduation-cap-line"></i> ${opp.program}</span>
            <span><i class="ri-time-line"></i> ${opp.time}</span>
          </div>
        </div>
      </div>
      <div class="stats">
        <span><i class="ri-user-smile-line"></i> ${opp.participants} joined</span>
        <span><i class="ri-group-line"></i> cap ${opp.capacity}</span>
      </div>
      <div class="actions">
        <button class="btn primary action-vol"><i class="ri-hand-heart-line"></i> Volunteer</button>
        <button class="btn ghost action-map"><i class="ri-map-pin-2-line"></i> View on Map</button>
        <button class="btn ghost action-cal"><i class="ri-calendar-event-line"></i> Add to Calendar</button>
        <button class="btn ghost action-reco"><i class="ri-star-line"></i> Recommend</button>
      </div>
    `;
    // Appear animation delay
    card.style.transitionDelay = `${Math.min(idx * 60, 300)}ms`;
    cardsEl.appendChild(card);
    card.querySelector('.action-reco').addEventListener('click', () => {
      pushMessage('Organizer', `You are recommended for ${opp.title}!`);
    });
    requestAnimationFrame(() => card.classList.add('appear'));

    // Actions
    card.querySelector('.action-map').addEventListener('click', () => {
      map.setView(opp.location, 16, { animate: true });
      awardPoints(2);
    });
    card.querySelector('.action-vol').addEventListener('click', () => {
      pushMessage('Organizer', `Thanks for your interest in "${opp.title}"! We will confirm your spot soon.`);
      openDrawer();
      awardPoints(5);
    });
    card.querySelector('.action-cal').addEventListener('click', () => {
      addToCalendar(opp);
      awardPoints(1);
    });
  });
}

// Render upcoming events
function renderEvents(){
  eventsListEl.innerHTML = '';
  UPCOMING_EVENTS.forEach(ev => {
    const li = document.createElement('li');
    li.innerHTML = `<span><i class="ri-calendar-line"></i> ${ev.name}</span><span>${ev.date} • ${ev.location}</span>`;
    eventsListEl.appendChild(li);
  });
}

// Filters and search listeners
chipButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const wasActive = btn.classList.contains('active');
    chipButtons.forEach(b => b.classList.remove('active'));
    if (!wasActive) {
      btn.classList.add('active');
      activeCategory = btn.dataset.filter;
    } else {
      activeCategory = '';
    }
    renderCards();
    awardPoints(1);
  });
});
[programFilter, timeFilter].forEach(el => el.addEventListener('change', renderCards));
[searchInput, searchBtn].forEach(el => el && el.addEventListener('input', renderCards));
searchBtn && searchBtn.addEventListener('click', renderCards);

// SSO Modal
btnSSO?.addEventListener('click', () => ssoModal.classList.remove('hidden'));
btnSSOGuest?.addEventListener('click', () => ssoModal.classList.add('hidden'));
document.querySelector('.modal-close')?.addEventListener('click', () => ssoModal.classList.add('hidden'));
window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') ssoModal.classList.add('hidden'); });

// Mobile preview toggle
mobilePreviewBtn?.addEventListener('click', () => document.body.classList.toggle('mobile-preview'));

// Points helper
function awardPoints(n){
  points += n; if(pointsBadge) pointsBadge.textContent = `${points} pts`;
}

// Theme toggle & persistence
(function initTheme(){
  const saved = localStorage.getItem('theme');
  if(saved === 'light') document.body.setAttribute('data-theme','light');
  updateThemeIcon();
})();
function updateThemeIcon(){
  if(!btnTheme) return;
  const isLight = document.body.getAttribute('data-theme') === 'light';
  btnTheme.innerHTML = `<i class="${isLight ? 'ri-moon-line' : 'ri-sun-line'}"></i>`;
}
btnTheme?.addEventListener('click', ()=>{
  const isLight = document.body.getAttribute('data-theme') === 'light';
  if(isLight){ document.body.removeAttribute('data-theme'); localStorage.setItem('theme','dark'); }
  else{ document.body.setAttribute('data-theme','light'); localStorage.setItem('theme','light'); }
  updateThemeIcon();
});

// Map init (Leaflet)
const map = L.map('map', { zoomControl: true, attributionControl: false }).setView([37.775, -122.4183], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Category color mapping
const iconColors = {
  classroom: '#60a5fa',
  lab: '#34d399',
  venue: '#f59e0b',
};

// Marker layer
const markers = VOLUNTEER_OPPS.map(opp => {
  const color = iconColors[opp.venueType] || '#a78bfa';
  const marker = L.circleMarker(opp.location, {
    radius: 8,
    color: color,
    weight: 2,
    fillColor: color,
    fillOpacity: 0.8,
  }).addTo(map);
  marker.bindPopup(`<b>${opp.title}</b><br/><span style="opacity:0.8">${opp.category.toUpperCase()} • ${opp.program}</span>`);
  return marker;
});

// Fit bounds once markers added
if(markers.length){
  const group = L.featureGroup(markers);
  map.fitBounds(group.getBounds().pad(0.2));
}

// Landmarks layer
const LANDMARKS = [
  { name: 'Library', type: 'landmark', icon: 'ri-bookmark-3-line', coord: [37.7742, -122.417] },
  { name: 'Cafeteria', type: 'landmark', icon: 'ri-restaurant-2-line', coord: [37.7768, -122.420] },
  { name: 'Shuttle Stop', type: 'transport', icon: 'ri-bus-2-line', coord: [37.7734, -122.422] },
  { name: 'Restrooms', type: 'facility', icon: 'ri-restroom-line', coord: [37.7755, -122.415] },
];
let landmarkLayer = L.layerGroup();
function renderLandmarks(){
  landmarkLayer.clearLayers();
  LANDMARKS.forEach(l => {
    const mk = L.marker(l.coord).bindPopup(`<i class="${l.icon}"></i> ${l.name}`);
    landmarkLayer.addLayer(mk);
  });
}
toggleLandmarks?.addEventListener('change', (e)=>{
  if(e.target.checked){ renderLandmarks(); landmarkLayer.addTo(map); }
  else{ map.removeLayer(landmarkLayer); }
});

// Accessibility route (prototype polyline)
const accessibleRoute = L.polyline([
  [37.7722, -122.4251], [37.7732, -122.4230], [37.7744, -122.4205], [37.7755, -122.4180]
], { color: '#34d399', weight: 4, opacity: 0.8, dashArray: '6,6' });
toggleAccessible?.addEventListener('change', (e)=>{
  if(e.target.checked){ accessibleRoute.addTo(map); map.fitBounds(accessibleRoute.getBounds().pad(0.2)); }
  else{ map.removeLayer(accessibleRoute); }
});

// Scroll reveal animation for cards using IntersectionObserver (progressive enhancement)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('appear');
  });
}, { threshold: 0.04 });

// Expose to new cards on render
const _renderCards = renderCards;
renderCards = function(){
  _renderCards();
  document.querySelectorAll('.card').forEach(card => observer.observe(card));
}

// Initial renders
renderEvents();
renderCards();

// Recommendations (simple scoring)
function recommend(){
  if(!recoGrid) return;
  const scored = VOLUNTEER_OPPS.map(o => ({
    o,
    score: (o.program === userProfile.program ? 2 : 0) + (userProfile.interests.includes(o.category) ? 2 : 0) + (userProfile.past.includes(o.title) ? 1 : 0)
  }))
  .sort((a,b)=> b.score - a.score)
  .slice(0, 3)
  .map(s => s.o);
  recoGrid.innerHTML = '';
  scored.forEach((opp, i)=>{
    const el = document.createElement('div');
    el.className = 'card appear';
    el.style.transitionDelay = `${i*60}ms`;
    el.innerHTML = `
      <div class="header"><div class="icon"><i class="${opp.icon}"></i></div><div><div class="title">${opp.title}</div><div class="meta"><span>${opp.category}</span> • <span>${opp.program}</span></div></div></div>
      <div class="actions"><button class="btn primary action-vol"><i class="ri-hand-heart-line"></i> Volunteer</button><button class="btn ghost action-map"><i class="ri-map-pin-2-line"></i> View</button></div>
    `;
    el.querySelector('.action-map').addEventListener('click', ()=> map.setView(opp.location, 16, {animate:true}));
    el.querySelector('.action-vol').addEventListener('click', ()=> { pushMessage('Organizer', `You are on the list for ${opp.title}!`); openDrawer(); awardPoints(5); });
    recoGrid.appendChild(el);
  });
}
recommend();

// Gallery populate
function renderGallery(){
  if(!galleryGrid) return;
  const imgs = [
    'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496302662116-35cc4f36df92?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format&fit=crop'
  ];
  galleryGrid.innerHTML = '';
  imgs.forEach((src, i)=>{
    const c = document.createElement('div'); c.className = 'card appear'; c.style.backgroundImage = `url(${src})`; c.style.transitionDelay = `${i*60}ms`;
    galleryGrid.appendChild(c);
  });
}
renderGallery();

// Stories Wall
function renderStories(){
  if(!storiesGrid) return;
  const stories = [
    { user:'Aarav', title:'Beach Clean-up', text:'We removed 120kg of trash in 3 hours!', icon:'ri-quill-pen-line' },
    { user:'Meera', title:'Mentor Night', text:'Helped 15 freshmen debug their first apps.', icon:'ri-lightbulb-flash-line' },
    { user:'Ravi', title:'Tree Plantation', text:'Planted 50 saplings around Hall C.', icon:'ri-plant-line' },
  ];
  storiesGrid.innerHTML = '';
  stories.forEach((s, i)=>{
    const el = document.createElement('div'); el.className='card appear'; el.style.transitionDelay=`${i*60}ms`;
    el.innerHTML = `<div class="header"><div class="icon"><i class="${s.icon}"></i></div><div><div class="title">${s.title}</div><div class="meta">by ${s.user}</div></div></div><p style="margin:8px 0 0;color:var(--muted)">${s.text}</p>`;
    storiesGrid.appendChild(el);
  });
}
renderStories();

// Highlights Feed
function renderHighlights(){
  if(!highlightsFeed) return;
  const items = [
    { icon:'ri-camera-3-line', text:'Photo contest winners announced for Green Day!' },
    { icon:'ri-megaphone-line', text:'NGO collaboration: RiverAid this weekend.' },
    { icon:'ri-sparkling-line', text:'Hack for Good submissions now open.' },
  ];
  highlightsFeed.innerHTML = '';
  items.forEach(it=>{
    const row = document.createElement('div'); row.className='item';
    row.innerHTML = `<i class="${it.icon}"></i><span>${it.text}</span>`;
    highlightsFeed.appendChild(row);
  });
}
renderHighlights();

// Lost & Found
function renderLostFound(){
  if(!lostFoundGrid) return;
  const items = [
    { title:'Blue Backpack', meta:'Found at Library', icon:'ri-backpack-line' },
    { title:'Water Bottle', meta:'Found at Gym', icon:'ri-cup-line' },
    { title:'USB Drive', meta:'Found at Lab 2B', icon:'ri-usb-line' },
  ];
  lostFoundGrid.innerHTML = '';
  items.forEach((it,i)=>{
    const el = document.createElement('div'); el.className='card appear'; el.style.transitionDelay = `${i*60}ms`;
    el.innerHTML = `<div class="header"><div class="icon"><i class="${it.icon}"></i></div><div><div class="title">${it.title}</div><div class="meta">${it.meta}</div></div></div>`;
    lostFoundGrid.appendChild(el);
  });
}
renderLostFound();

// Utilities
function renderUtilities(){
  if(!utilitiesGrid) return;
  const utils = [
    { title:'Parking Availability', meta:'Lot A: 32 spots', icon:'ri-parking-box-line' },
    { title:'Shuttle Tracker', meta:'Next shuttle in 5 min', icon:'ri-bus-2-line' },
    { title:'Green Monitor', meta:'Energy use -6% today', icon:'ri-leaf-line' },
  ];
  utilitiesGrid.innerHTML = '';
  utils.forEach((u,i)=>{
    const el = document.createElement('div'); el.className='card appear'; el.style.transitionDelay=`${i*60}ms`;
    el.innerHTML = `<div class="header"><div class="icon"><i class="${u.icon}"></i></div><div><div class="title">${u.title}</div><div class="meta">${u.meta}</div></div></div>`;
    utilitiesGrid.appendChild(el);
  });
}
renderUtilities();

// Leaderboard & Certificates
function renderLeaderAndCerts(){
  if(leaderboardGrid){
    const leaders = [
      { name:'Aarav', pts: 240 }, { name:'Meera', pts: 220 }, { name:'Ravi', pts: 180 }
    ];
    leaderboardGrid.innerHTML = '';
    leaders.forEach((p,i)=>{
      const el = document.createElement('div'); el.className='card appear'; el.style.transitionDelay=`${i*60}ms`;
      el.innerHTML = `<div class="title">#${i+1} ${p.name}</div><div class="meta">${p.pts} pts</div>`;
      leaderboardGrid.appendChild(el);
    });
  }
  if(certificatesGrid){
    const certs = [
      { title:'Community Service (20 hrs)', icon:'ri-award-line' },
      { title:'Event Organizer', icon:'ri-medal-line' }
    ];
    certificatesGrid.innerHTML = '';
    certs.forEach((c,i)=>{
      const el = document.createElement('div'); el.className='card appear'; el.style.transitionDelay=`${i*60}ms`;
      el.innerHTML = `<div class="header"><div class="icon"><i class="${c.icon}"></i></div><div><div class="title">${c.title}</div><div class="meta">Auto-generated</div></div></div>`;
      certificatesGrid.appendChild(el);
    });
  }
}
renderLeaderAndCerts();

// Messaging drawer
function openDrawer(){ drawer?.classList.remove('hidden'); }
function closeDrawer(){ drawer?.classList.add('hidden'); }
closeDrawerBtn?.addEventListener('click', closeDrawer);
pointsBadge?.addEventListener('click', openDrawer); // quick entry
sendMessageBtn?.addEventListener('click', ()=>{
  const txt = (messageInput?.value || '').trim(); if(!txt) return;
  pushMessage('You', txt, true); messageInput.value=''; awardPoints(1);
});
messageInput?.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); sendMessageBtn.click(); }});
function pushMessage(author, text, isUser=false){
  if(!messagesList) return;
  const div = document.createElement('div');
  div.className = `message ${isUser?'user':''}`.trim();
  div.textContent = `${author}: ${text}`;
  messagesList.appendChild(div);
  messagesList.scrollTop = messagesList.scrollHeight;
}

// Chatbot
function botRespond(q){
  const lower = q.toLowerCase();
  if(lower.includes('navigate') || lower.includes('route')) return 'Try enabling Accessibility Routes or click View on Map on any opportunity.';
  if(lower.includes('event') || lower.includes('calendar')) return 'Use Add to Calendar on a card, or check Upcoming Events.';
  if(lower.includes('tech')) return 'You might like Makerspace Robotics Assist or Open Lab Night Mentor.';
  return 'I can help you find events or navigate campus. Try: "Find tech volunteering this weekend"';
}
function pushBot(text, isUser=false){
  const div = document.createElement('div');
  div.className = isUser ? 'user' : 'bot';
  div.textContent = text; chatbotBody?.appendChild(div);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}
chatbotToggle?.addEventListener('click', ()=> chatbotPanel?.classList.toggle('hidden'));
chatbotClose?.addEventListener('click', ()=> chatbotPanel?.classList.add('hidden'));
chatbotSend?.addEventListener('click', ()=>{
  const q = (chatbotText?.value||'').trim(); if(!q) return;
  pushBot(q, true); chatbotText.value='';
  setTimeout(()=> pushBot(botRespond(q)), 300);
});
chatbotText?.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); chatbotSend.click(); }});

// i18n minimal demo
const I18N = {
  en: {
    title: 'Your vibrant gateway to campus engagement',
    searchPH: 'Search Volunteer Opportunities (e.g., Tutoring, Clean-up, Tech Club)'
  },
  hi: {
    title: 'कैंपस एंगेजमेंट का आपका जीवंत द्वार',
    searchPH: 'स्वयंसेवी अवसर खोजें (जैसे ट्यूशन, क्लीन-अप, टेक क्लब)'
  }
};
langSelect?.addEventListener('change', ()=>{
  const lang = langSelect.value in I18N ? langSelect.value : 'en';
  document.querySelector('.hero-copy h2').textContent = I18N[lang].title;
  searchInput.placeholder = I18N[lang].searchPH;
});

// Calendar export (ICS + Google URL)
function addToCalendar(opp){
  const dtStart = new Date();
  const dtEnd = new Date(Date.now() + 2*60*60*1000);
  const pad = s => s.toString().padStart(2,'0');
  const toICS = (d)=> `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${opp.title}\nDTSTART:${toICS(dtStart)}\nDTEND:${toICS(dtEnd)}\nLOCATION:Campus\nDESCRIPTION:${opp.category.toUpperCase()} • ${opp.program}\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download = `${opp.title.replace(/\s+/g,'_')}.ics`; a.click();
  setTimeout(()=> URL.revokeObjectURL(url), 1000);
  // Also open Google Calendar template in new tab
  const fmt = (d)=> `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  const gcal = new URL('https://calendar.google.com/calendar/render');
  gcal.searchParams.set('action','TEMPLATE');
  gcal.searchParams.set('text', opp.title);
  gcal.searchParams.set('details', `${opp.category.toUpperCase()} • ${opp.program}`);
  gcal.searchParams.set('location', 'Campus');
  gcal.searchParams.set('dates', `${fmt(dtStart)}/${fmt(dtEnd)}`);
  window.open(gcal.toString(), '_blank');
}

// Service worker registration
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  });
}

// Loading progress bar
(function loadingBar(){
  const barWrap = document.getElementById('loadingBar');
  const bar = barWrap?.querySelector('.bar');
  if(!barWrap || !bar) return;
  bar.style.transition = 'width 900ms ease';
  requestAnimationFrame(()=> bar.style.width = '100%');
  setTimeout(()=> { barWrap.style.opacity = '0'; barWrap.style.transition = 'opacity 400ms ease'; }, 950);
  setTimeout(()=> { barWrap.style.display = 'none'; }, 1400);
})();

// Topbar scroll glow
const _topbar = document.querySelector('.topbar');
window.addEventListener('scroll', ()=>{
  if(!_topbar) return;
  if(window.scrollY > 8) _topbar.classList.add('scrolled'); else _topbar.classList.remove('scrolled');
});

// Parallax scroll (subtle)
const parallaxEls = [document.querySelector('.hero-art'), document.querySelector('.content-grid .right')].filter(Boolean);
window.addEventListener('scroll', ()=>{
  const y = window.scrollY;
  parallaxEls.forEach((el, i)=>{
    const depth = (i+1) * 0.04;
    el.style.transform = `translateY(${y * depth}px)`;
  });
});

// Particles background (lightweight)
(function particles(){
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h; const dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize(){ w = canvas.width = window.innerWidth * dpr; h = canvas.height = window.innerHeight * dpr; canvas.style.width = window.innerWidth+'px'; canvas.style.height = window.innerHeight+'px'; }
  window.addEventListener('resize', resize); resize();
  const colors = ['#6c8cff','#9b6bff','#ff7a45','#14b8a6','#60a5fa'];
  const N = 60; const pts = Array.from({length:N}, ()=>({
    x: Math.random()*w, y: Math.random()*h,
    vx: (Math.random()-0.5)*0.2*dpr, vy: (Math.random()-0.5)*0.2*dpr,
    r: (2 + Math.random()*3) * dpr, c: colors[Math.floor(Math.random()*colors.length)]
  }));
  function step(){
    ctx.clearRect(0,0,w,h);
    pts.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0) p.x = w; if(p.x > w) p.x = 0; if(p.y < 0) p.y = h; if(p.y > h) p.y = 0;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*3);
      g.addColorStop(0, p.c + 'aa'); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r*3, 0, Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(step);
  }
  step();
})();
