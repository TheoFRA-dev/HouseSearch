const listings = [
  {
    title: 'Maison familiale lumineuse à Lyon',
    price: 385000,
    city: 'Lyon',
    bedrooms: 4,
    surface: 120,
    type: 'Maison',
    source: 'SeLoger',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    blurb: 'Grand jardin, 2 salles de bain et école à 10 minutes.'
  },
  {
    title: 'Appartement moderne en centre-ville',
    price: 265000,
    city: 'Lyon',
    bedrooms: 3,
    surface: 82,
    type: 'Appartement',
    source: 'LeBonCoin',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    blurb: 'Cuisine équipée, balcon, proche transports et commerces.'
  },
  {
    title: 'Villa avec piscine à Bordeaux',
    price: 520000,
    city: 'Bordeaux',
    bedrooms: 5,
    surface: 180,
    type: 'Villa',
    source: 'Bien’ici',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
    blurb: 'Espaces de vie ouverts, piscine, très belle vue sur le quartier.'
  },
  {
    title: 'Maison contemporaine à Nantes',
    price: 310000,
    city: 'Nantes',
    bedrooms: 4,
    surface: 102,
    type: 'Maison',
    source: 'Logic-Immo',
    image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=900&q=80',
    blurb: 'Très bon rendement locatif et proche de la zone commerciale.'
  },
  {
    title: 'Appartement lumineux à Marseille',
    price: 242000,
    city: 'Marseille',
    bedrooms: 2,
    surface: 68,
    type: 'Appartement',
    source: 'SeLoger',
    image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80',
    blurb: 'Vue mer, parking et ascenseur, proche du centre.'
  },
  {
    title: 'Maison traditionnelle à Toulouse',
    price: 348000,
    city: 'Toulouse',
    bedrooms: 3,
    surface: 96,
    type: 'Maison',
    source: 'LeBonCoin',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    blurb: 'Jardin, garage et ambiance familiale dans un quartier calme.'
  }
];

const form = document.getElementById('searchForm');
const resultsGrid = document.getElementById('resultsGrid');
const resultCount = document.getElementById('resultCount');
const resultTitle = document.getElementById('resultTitle');
const resetBtn = document.getElementById('resetBtn');

function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

function renderListings(items) {
  resultsGrid.innerHTML = '';
  resultCount.textContent = `${items.length} bien(s) correspondant`;
  resultTitle.textContent = items.length ? 'Résultats de recherche' : 'Aucun résultat ne correspond à vos critères';

  if (!items.length) {
    resultsGrid.innerHTML = '<div class="empty-state">Aucune maison ne correspond à vos critères. Essayez d’élargir vos filtres.</div>';
    return;
  }

  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'listing-card';
    card.innerHTML = `
      <div class="thumb" style="background-image:url('${item.image}')"></div>
      <div class="listing-body">
        <strong>${item.title}</strong>
        <span class="price-tag">${formatPrice(item.price)}</span>
        <div class="badges">
          <span>${item.city}</span>
          <span>${item.bedrooms} chambres</span>
          <span>${item.surface} m²</span>
          <span>${item.type}</span>
        </div>
        <p class="small-note">${item.blurb}</p>
        <span class="source-chip">📍 ${item.source}</span>
      </div>
    `;
    resultsGrid.appendChild(card);
  });
}

function filterListings(formData) {
  const city = formData.get('city')?.trim().toLowerCase() || '';
  const maxBudget = Number(formData.get('maxBudget')) || Infinity;
  const minBedrooms = Number(formData.get('minBedrooms')) || 0;
  const minSurface = Number(formData.get('minSurface')) || 0;
  const propertyType = formData.get('propertyType') || 'all';
  const sourceFilter = formData.get('sourceFilter') || 'all';

  return listings.filter((item) => {
    const matchesCity = !city || item.city.toLowerCase().includes(city);
    const matchesBudget = item.price <= maxBudget;
    const matchesBedrooms = item.bedrooms >= minBedrooms;
    const matchesSurface = item.surface >= minSurface;
    const matchesType = propertyType === 'all' || item.type === propertyType;
    const matchesSource = sourceFilter === 'all' || item.source === sourceFilter;

    return matchesCity && matchesBudget && matchesBedrooms && matchesSurface && matchesType && matchesSource;
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const filtered = filterListings(formData);
  renderListings(filtered);
});

resetBtn.addEventListener('click', () => {
  form.reset();
  document.getElementById('minBedrooms').value = '2';
  document.getElementById('propertyType').value = 'all';
  document.getElementById('sourceFilter').value = 'all';
  renderListings(listings);
});

renderListings(listings);
