// Données enrichies avec les nouveaux critères
const listings = [
  { 
    title: 'Maison à Lyon', 
    price: 385000, 
    dept: '69', 
    city: 'Lyon', 
    coords: { lat: 45.76, lng: 4.84 }, 
    bedrooms: 4, 
    surface: 120,
    style: 'maison',
    source: 'leboncoin',
    population: 'large',
    proximity: ['commerce', 'medecin', 'hopital'],
    risks: [],
    url: 'https://www.leboncoin.fr/recherche?category=9'
  },
  { 
    title: 'Appartement à Paris', 
    price: 565000, 
    dept: '75', 
    city: 'Paris', 
    coords: { lat: 48.86, lng: 2.35 }, 
    bedrooms: 3, 
    surface: 82,
    style: 'appartement',
    source: 'seloger',
    population: 'large',
    proximity: ['commerce', 'medecin', 'hopital'],
    risks: [],
    url: 'https://www.seloger.com'
  },
  { 
    title: 'Villa à Bordeaux', 
    price: 520000, 
    dept: '33', 
    city: 'Bordeaux', 
    coords: { lat: 44.84, lng: -0.58 }, 
    bedrooms: 5, 
    surface: 180,
    style: 'villa',
    source: 'bienIci',
    population: 'large',
    proximity: ['commerce', 'medecin'],
    risks: ['feu'],
    url: 'https://www.bienici.com'
  },
  { 
    title: 'Maison à Nantes', 
    price: 310000, 
    dept: '44', 
    city: 'Nantes', 
    coords: { lat: 47.22, lng: -1.55 }, 
    bedrooms: 4, 
    surface: 102,
    style: 'maison',
    source: 'leboncoin',
    population: 'large',
    proximity: ['commerce', 'medecin'],
    risks: [],
    url: 'https://www.leboncoin.fr'
  },
  { 
    title: 'Appartement à Marseille', 
    price: 242000, 
    dept: '13', 
    city: 'Marseille', 
    coords: { lat: 43.30, lng: 5.37 }, 
    bedrooms: 2, 
    surface: 68,
    style: 'appartement',
    source: 'seloger',
    population: 'large',
    proximity: ['commerce', 'hopital'],
    risks: [],
    url: 'https://www.seloger.com'
  },
  { 
    title: 'Maison à Toulouse', 
    price: 348000, 
    dept: '31', 
    city: 'Toulouse', 
    coords: { lat: 43.60, lng: 1.44 }, 
    bedrooms: 3, 
    surface: 96,
    style: 'maison',
    source: 'immo',
    population: 'large',
    proximity: ['commerce', 'medecin', 'hopital'],
    risks: ['argile'],
    url: 'https://www.immobilier.com'
  },
  { 
    title: 'Maison à Nice', 
    price: 450000, 
    dept: '06', 
    city: 'Nice', 
    coords: { lat: 43.70, lng: 7.26 }, 
    bedrooms: 3, 
    surface: 110,
    style: 'villa',
    source: 'bienIci',
    population: 'large',
    proximity: ['commerce'],
    risks: ['feu'],
    url: 'https://www.bienici.com'
  },
  { 
    title: 'Loft à Lyon (Presqu\'île)', 
    price: 295000, 
    dept: '69', 
    city: 'Lyon', 
    coords: { lat: 45.76, lng: 4.84 }, 
    bedrooms: 2, 
    surface: 75,
    style: 'loft',
    source: 'leboncoin',
    population: 'large',
    proximity: ['commerce', 'medecin'],
    risks: [],
    url: 'https://www.leboncoin.fr'
  },
  { 
    title: 'Maison de village à Sarlat', 
    price: 185000, 
    dept: '24', 
    city: 'Sarlat', 
    coords: { lat: 44.88, lng: 1.21 }, 
    bedrooms: 2, 
    surface: 85,
    style: 'maison',
    source: 'immo',
    population: 'small',
    proximity: ['commerce'],
    risks: [],
    url: 'https://www.immobilier.com'
  },
  { 
    title: 'Terrain constructible à Rennes', 
    price: 120000, 
    dept: '35', 
    city: 'Rennes', 
    coords: { lat: 48.11, lng: -1.67 }, 
    bedrooms: 0, 
    surface: 500,
    style: 'terrain',
    source: 'leboncoin',
    population: 'medium',
    proximity: ['ecole', 'transport'],
    risks: [],
    url: 'https://www.leboncoin.fr'
  }
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

// Coordonnées pour localisation
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

// Calcul de distance
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Initialiser les départements
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
  const selectedStyles = Array.from(document.querySelectorAll('input[name="houseStyle"]:checked')).map(e => e.value);
  const selectedProximity = Array.from(document.querySelectorAll('input[name="proximity"]:checked')).map(e => e.value);
  const selectedRisks = Array.from(document.querySelectorAll('input[name="risks"]:checked')).map(e => e.value);
  const selectedSources = Array.from(document.querySelectorAll('input[name="source"]:checked')).map(e => e.value);
  
  const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
  const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;
  const minSurface = parseInt(document.getElementById('minSurface').value) || 0;
  const maxSurface = parseInt(document.getElementById('maxSurface').value) || Infinity;
  const bedrooms = document.getElementById('bedrooms').value;
  const location = document.getElementById('location').value.trim();
  const population = document.getElementById('population').value;

  filteredResults = listings.filter(item => {
    const matchDept = selectedDepts.length === 0 || selectedDepts.includes(item.dept);
    const matchPrice = item.price >= minPrice && item.price <= maxPrice;
    const matchSurface = item.surface >= minSurface && item.surface <= maxSurface;
    const matchBedrooms = !bedrooms || (bedrooms === '5' ? item.bedrooms >= 5 : item.bedrooms == bedrooms);
    const matchStyle = selectedStyles.length === 0 || selectedStyles.includes(item.style);
    const matchSource = selectedSources.length === 0 || selectedSources.includes(item.source);
    const matchPopulation = !population || item.population === population;

    // Filtrer par proximité (au moins un des critères sélectionnés doit être présent)
    let matchProximity = true;
    if (selectedProximity.length > 0) {
      matchProximity = selectedProximity.some(prox => item.proximity.includes(prox));
    }

    // Filtrer par risques (exclure les biens avec les risques sélectionnés)
    let matchRisks = true;
    if (selectedRisks.length > 0) {
      matchRisks = !selectedRisks.some(risk => item.risks.includes(risk));
    }

    let matchLocation = true;
    if (location) {
      const refCoords = cityCoords[location] || null;
      if (refCoords) {
        const dist = calculateDistance(refCoords.lat, refCoords.lng, item.coords.lat, item.coords.lng);
        matchLocation = dist <= 100;
      } else {
        matchLocation = item.city.toLowerCase().includes(location.toLowerCase());
      }
    }

    return matchDept && matchPrice && matchSurface && matchBedrooms && matchStyle && matchSource && 
           matchPopulation && matchProximity && matchRisks && matchLocation;
  });

  currentPage = 1;
  displayResults();
}

// Afficher les résultats
function displayResults() {
  const grid = document.getElementById('resultsGrid');
  const countEl = document.getElementById('resultCount');
  const titleEl = document.getElementById('resultTitle');

  countEl.textContent = `${filteredResults.length} bien(s) trouvé(s)`;
  titleEl.textContent = filteredResults.length > 0 ? 'Résultats' : 'Aucun résultat';

  if (filteredResults.length === 0) {
    grid.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>Aucun bien ne correspond à vos critères.</p></div>';
    document.getElementById('pagination').innerHTML = '';
    return;
  }

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const pageItems = filteredResults.slice(startIdx, endIdx);

  grid.innerHTML = pageItems.map(item => {
    const proximityTags = item.proximity.map(p => {
      const labels = { 'commerce': '🛍️ Commerce', 'medecin': '👨‍⚕️ Médecin', 'hopital': '🏥 Hôpital' };
      return `<span class="tag proximity">${labels[p]}</span>`;
    }).join('');

    const riskTags = item.risks.map(r => {
      const labels = { 'argile': '⚠️ Retrait d\'argile', 'feu': '🔥 Zone incendie' };
      return `<span class="tag risk">${labels[r]}</span>`;
    }).join('');

    const sourceLabels = {
      'leboncoin': 'Leboncoin',
      'seloger': 'SeLoger',
      'bienIci': 'Bien ici',
      'immo': 'Immobilier.com'
    };

    return `
      <a href="${item.url}" target="_blank" class="card-link">
        <div class="card-property">
        <div class="card-image">
          ${item.style === 'maison' ? '🏠' : item.style === 'appartement' ? '🏢' : item.style === 'villa' ? '🏰' : '🏗️'}
          <span class="card-source">${sourceLabels[item.source]}</span>
        </div>
        <div class="card-body">
          <div class="card-title">${item.title}</div>
          <div class="card-price">${item.price.toLocaleString('fr-FR')} €</div>
          <div class="card-tags">
            ${proximityTags}
            ${riskTags}
          </div>
          <div class="card-details">
            <div class="card-detail">
              <i class="fas fa-bed"></i>
              <span>${item.bedrooms} chambre(s)</span>
            </div>
            <div class="card-detail">
              <i class="fas fa-ruler-combined"></i>
              <span>${item.surface} m²</span>
            </div>
            <div class="card-detail">
              <i class="fas fa-building"></i>
              <span>${item.style}</span>
            </div>
            <div class="card-detail">
              <i class="fas fa-users"></i>
              <span>${item.population}</span>
            </div>
          </div>
          <div class="card-location">
            <i class="fas fa-map-pin"></i> ${item.city} (${item.dept})
          </div>
        </div>
      </div>
      </a>
    `;
  }).join('');

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
    html += `<button onclick="goToPage(${currentPage - 1})"><i class="fas fa-chevron-left"></i> Précédent</button>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      html += `<button class="active">${i}</button>`;
    } else {
      html += `<button onclick="goToPage(${i})">${i}</button>`;
    }
  }

  if (currentPage < totalPages) {
    html += `<button onclick="goToPage(${currentPage + 1})">Suivant <i class="fas fa-chevron-right"></i></button>`;
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
  Array.from(document.querySelectorAll('input[type="checkbox"]')).forEach(e => e.checked = e.name === 'source');
  currentPage = 1;
  filteredResults = listings;
  displayResults();
});

// Initialisation
initDepartments();
filteredResults = [...listings]; // Initialiser avec toutes les annonces
displayResults();
