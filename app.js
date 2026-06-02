// Données simples avec départements
const listings = [
  { title: 'Maison à Lyon', price: 385000, dept: '69', city: 'Lyon', coords: { lat: 45.76, lng: 4.84 }, bedrooms: 4, surface: 120 },
  { title: 'Appartement à Paris', price: 565000, dept: '75', city: 'Paris', coords: { lat: 48.86, lng: 2.35 }, bedrooms: 3, surface: 82 },
  { title: 'Villa à Bordeaux', price: 520000, dept: '33', city: 'Bordeaux', coords: { lat: 44.84, lng: -0.58 }, bedrooms: 5, surface: 180 },
  { title: 'Maison à Nantes', price: 310000, dept: '44', city: 'Nantes', coords: { lat: 47.22, lng: -1.55 }, bedrooms: 4, surface: 102 },
  { title: 'Appartement à Marseille', price: 242000, dept: '13', city: 'Marseille', coords: { lat: 43.30, lng: 5.37 }, bedrooms: 2, surface: 68 },
  { title: 'Maison à Toulouse', price: 348000, dept: '31', city: 'Toulouse', coords: { lat: 43.60, lng: 1.44 }, bedrooms: 3, surface: 96 },
  { title: 'Maison à Nice', price: 450000, dept: '06', city: 'Nice', coords: { lat: 43.70, lng: 7.26 }, bedrooms: 3, surface: 110 },
  { title: 'Appartement à Lyon (Presqu\'île)', price: 295000, dept: '69', city: 'Lyon', coords: { lat: 45.76, lng: 4.84 }, bedrooms: 2, surface: 75 },
];

// Départements disponibles
const departments = [
  { code: '75', name: 'Paris (75)' },
  { code: '69', name: 'Rhône (69)' },
  { code: '13', name: 'Bouches-du-Rhône (13)' },
  { code: '31', name: 'Haute-Garonne (31)' },
  { code: '33', name: 'Gironde (33)' },
  { code: '44', name: 'Loire-Atlantique (44)' },
  { code: '06', name: 'Alpes-Maritimes (06)' },
];

// Coordonnées approximatives pour localisation
const cityCoords = {
  'Paris': { lat: 48.86, lng: 2.35 },
  'Lyon': { lat: 45.76, lng: 4.84 },
  'Marseille': { lat: 43.30, lng: 5.37 },
  'Toulouse': { lat: 43.60, lng: 1.44 },
  'Nice': { lat: 43.70, lng: 7.26 },
  'Bordeaux': { lat: 44.84, lng: -0.58 },
  'Nantes': { lat: 47.22, lng: -1.55 },
};

const ITEMS_PER_PAGE = 9;
let currentPage = 1;
let filteredResults = [];

// Distance calculée en km
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Initialiser les checkboxes des départements
function initDepartments() {
  const container = document.getElementById('departmentsList');
  departments.forEach(dept => {
    const div = document.createElement('div');
    div.className = 'checkbox-item';
    div.innerHTML = `
      <input type="checkbox" name="dept" value="${dept.code}" id="dept-${dept.code}" />
      <label for="dept-${dept.code}">${dept.name}</label>
    `;
    container.appendChild(div);
  });
}

// Filtrer les résultats
function filterListings() {
  const selectedDepts = Array.from(document.querySelectorAll('input[name="dept"]:checked')).map(e => e.value);
  const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
  const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;
  const location = document.getElementById('location').value.trim();

  filteredResults = listings.filter(item => {
    const matchDept = selectedDepts.length === 0 || selectedDepts.includes(item.dept);
    const matchPrice = item.price >= minPrice && item.price <= maxPrice;
    
    let matchLocation = true;
    if (location) {
      const refCoords = cityCoords[location] || null;
      if (refCoords) {
        const dist = calculateDistance(refCoords.lat, refCoords.lng, item.coords.lat, item.coords.lng);
        matchLocation = dist <= 100; // Dans un rayon de 100km
      } else {
        matchLocation = item.city.toLowerCase().includes(location.toLowerCase());
      }
    }

    return matchDept && matchPrice && matchLocation;
  });

  currentPage = 1;
  displayResults();
}

// Afficher les résultats avec pagination
function displayResults() {
  const grid = document.getElementById('resultsGrid');
  const countEl = document.getElementById('resultCount');
  const titleEl = document.getElementById('resultTitle');

  countEl.textContent = `${filteredResults.length} bien(s) trouvé(s)`;
  titleEl.textContent = filteredResults.length > 0 ? 'Résultats' : 'Aucun résultat';

  if (filteredResults.length === 0) {
    grid.innerHTML = '<div class="empty-state"><p>Aucun bien ne correspond à vos critères.</p></div>';
    document.getElementById('pagination').innerHTML = '';
    return;
  }

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const pageItems = filteredResults.slice(startIdx, endIdx);

  grid.innerHTML = pageItems.map(item => `
    <div class="card-property">
      <div class="card-image">🏠</div>
      <div class="card-body">
        <div class="card-title">${item.title}</div>
        <div class="card-price">${item.price.toLocaleString('fr-FR')} €</div>
        <div class="card-tags">
          <span class="tag">${item.bedrooms} ch.</span>
          <span class="tag">${item.surface} m²</span>
          <span class="tag">Dept ${item.dept}</span>
        </div>
        <div class="card-location">${item.city}</div>
      </div>
    </div>
  `).join('');

  renderPagination();
}

// Pagination
function renderPagination() {
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const paginationEl = document.getElementById('pagination');

  if (totalPages <= 1) {
    paginationEl.innerHTML = '';
    return;
  }

  let html = '';
  if (currentPage > 1) {
    html += `<button onclick="goToPage(${currentPage - 1})">← Précédent</button>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      html += `<button class="active">${i}</button>`;
    } else {
      html += `<button onclick="goToPage(${i})">${i}</button>`;
    }
  }

  if (currentPage < totalPages) {
    html += `<button onclick="goToPage(${currentPage + 1})">Suivant →</button>`;
  }

  paginationEl.innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  displayResults();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Événements
document.getElementById('searchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  filterListings();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('searchForm').reset();
  Array.from(document.querySelectorAll('input[name="dept"]')).forEach(e => e.checked = false);
  currentPage = 1;
  filteredResults = listings;
  displayResults();
});

// Initialisation
initDepartments();
displayResults();
