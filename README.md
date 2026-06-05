# 🏠 HouseSearch - Moteur de Recherche Immobilière Intelligent

Un outil de recherche immobilière moderne et puissant qui agrège les annonces des plus grands sites immobiliers français.

## ✨ Fonctionnalités

### 🔍 Filtres Avancés
- **Budget**: Filtrez par plage de prix
- **Surface**: Cherchez par superficie en m²
- **Chambres**: Sélectionnez le nombre de chambres
- **Style de bien**: Maison, Appartement, Villa, Loft
- **Localisation**: Recherche par ville avec rayon de 100km
- **Département**: Filtrez par département français
- **Population**: Rural, Petit village, Ville moyenne, Grande ville

### 🗺️ Critères de Proximité
- 🛍️ **Commerce proche**: Commerces et magasins accessibles
- 👨‍⚕️ **Médecin**: Praticiens à proximité
- 🏥 **Hôpital**: Hôpitaux et cliniques

### ⚠️ Critères de Risques
- 🌍 **Retrait d'argile et gonflement**: Informations géotechniques
- 🔥 **Zones à risque incendie**: Prévention des risques

### 📱 Interface
- Design moderne et responsive
- Interface intuitive avec icônes
- Pagination intelligente
- Visualisation des résultats en grille
- Support mobile, tablette et desktop

### 🌐 Sources Multiples
Agrégation depuis:
- **Leboncoin**: Le leader français du classifieds
- **SeLoger**: Major portal immobilier
- **Bien ici**: Plateforme immobilière
- **Immobilier.com**: Portail de référence

## 🚀 Installation

### Prérequis
- Python 3.8+
- pip (gestionnaire de paquets Python)
- Git

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/TheoFRA-dev/HouseSearch.git
cd HouseSearch
```

2. **Créer un environnement virtuel**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

4. **Lancer le serveur**

**Option 1: Serveur statique simple (développement)**
```bash
python server.py
```

**Option 2: Avec API Flask (production)**
```bash
python api.py
```

Accédez à `http://localhost:8080` ou `http://localhost:5000`

## 🐳 Utilisation avec Docker

### Build et run
```bash
docker build -t housesearch .
docker run -p 8080:8080 housesearch
```

### Avec Docker Compose
```bash
docker-compose up -d
```

## 📖 Utilisation

### 1. **Accueil**
- Ouvrez votre navigateur sur `http://localhost:8080`
- Vous verrez l'interface HouseSearch avec les filtres à gauche

### 2. **Configurer les filtres**
- Sélectionnez votre budget (min/max)
- Choisissez la surface minimale
- Indiquez le nombre de chambres
- Sélectionnez le style de bien
- Choisissez une localisation
- Cochez les proximités désirées
- Sélectionnez les risques à éviter

### 3. **Rechercher**
- Cliquez sur "Rechercher" pour lancer la recherche
- Les résultats s'affichent dans la grille
- Utilisez la pagination pour voir plus de résultats

### 4. **Réinitialiser**
- Cliquez sur "Réinitialiser" pour effacer tous les filtres

## 🔧 Architecture

```
HouseSearch/
├── index.html           # Interface utilisateur
├── app.js              # Logique frontend
├── styles.css          # Design responsive
├── server.py           # Serveur statique
├── api.py              # Backend API avec scrapers
├── requirements.txt    # Dépendances Python
├── Dockerfile          # Configuration Docker
└── README.md          # This file
```

## 🔌 API Endpoints

### GET `/api/health`
Vérifier l'état du serveur
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00"
}
```

### POST `/api/search`
Rechercher des biens immobiliers
```json
{
  "city": "Paris",
  "price_min": 200000,
  "price_max": 500000,
  "bedrooms": 2,
  "surface_min": 60
}
```

### GET `/api/listings`
Récupérer les annonces avec filtres
```
/api/listings?city=Paris&price_min=200000&price_max=500000
```

### GET `/api/suggestions/cities`
Obtenir les suggestions de villes

### GET `/api/stats`
Statistiques sur les annonces

## 🛠️ Développement

### Ajouter une nouvelle source immobilière

Modifiez `api.py` et ajoutez une nouvelle méthode scraper:

```python
def scrape_ma_source(self, city, price_min=0, price_max=1000000):
    """Scrape Ma Source"""
    try:
        url = f"https://example.com/search?city={city}"
        response = requests.get(url, headers=HEADERS, timeout=10)
        # Implémenter le parsing HTML avec BeautifulSoup
        # Ajouter les annonces à self.listings
    except Exception as e:
        logger.error(f"Error scraping Ma Source: {e}")
```

### Améliorer les filtres

Les filtres sont gérés dans `app.js`. Pour ajouter un nouveau filtre:

1. Ajouter le HTML dans `index.html`
2. Ajouter la logique de filtrage dans `filterListings()` dans `app.js`
3. Mettre à jour la structure de données dans `listings`

## 📊 Données d'Exemple

L'application inclut des données d'exemple pour tester les fonctionnalités. Ces données peuvent être remplacées par des données réelles provenant des scrapers une fois implémentés.

## 🤝 Contribution

Les contributions sont les bienvenues! Pour contribuer:

1. Fork le repository
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## ⚖️ Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 📝 Notes Légales

- HouseSearch scrape les données publiques des sites immobiliers
- Respectez les conditions d'utilisation et les robots.txt de chaque site
- Les données sont agrégées à titre informatif uniquement
- Vérifiez toujours les annonces directement sur les sites officiels

## 🐛 Bugs & Suggestions

Pour signaler un bug ou suggérer une amélioration:
- Créez une issue sur GitHub
- Décrivez le problème/suggestion en détail
- Incluez des captures d'écran si nécessaire

## 📞 Support

Pour plus d'aide:
- Consultez la documentation dans ce README
- Ouvrez une issue sur le repository
- Visitez https://github.com/TheoFRA-dev/HouseSearch

## 🚀 Roadmap

- [ ] Implémenter les scrapers pour les 4 sources principales
- [ ] Ajouter une base de données pour persister les annonces
- [ ] Authentification utilisateur
- [ ] Sauvegarde de favoris
- [ ] Alertes par email
- [ ] Intégration carte interactive
- [ ] Comparaison de prix
- [ ] Export CSV/PDF
- [ ] API GraphQL
- [ ] Application mobile

---

Fait avec ❤️ par l'équipe HouseSearch

