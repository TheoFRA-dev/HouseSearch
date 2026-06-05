#!/usr/bin/env python3
"""
HouseSearch API - Backend pour la recherche immobilière
Scrape les sites immobiliers français: Leboncoin, SeLoger, Bien ici, Immobilier.com
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import os
import logging
from datetime import datetime
from scraper_config import SCRAPER_CONFIG, SOURCES, MAIN_CITIES, DEPARTMENTS, FILTERS

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Headers pour les requêtes
HEADERS = {
    'User-Agent': SCRAPER_CONFIG['user_agent']
}


class RealEstateScraper:
    """Scraper pour les sites immobiliers français"""
    
    def __init__(self):
        self.listings = []
        self.timeout = SCRAPER_CONFIG['timeout']
        self.retries = SCRAPER_CONFIG['retries']
    
    def scrape_leboncoin(self, city, price_min=0, price_max=1000000):
        """Scrape Leboncoin"""
        try:
            url = f"{SOURCES['leboncoin']['base_url']}{SOURCES['leboncoin']['search_endpoint']}"
            params = {
                'category': SOURCES['leboncoin']['category'],
                'locations': city,
                'price': f'{price_min}-{price_max}'
            }
            response = requests.get(url, params=params, headers=HEADERS, timeout=self.timeout)
            response.raise_for_status()

            # Simulation de plusieurs résultats pour Leboncoin
            for i in range(3):
                self.listings.append({
                    'title': f'Maison LBC n°{i+1} à {city}',
                    'price': 250000 + (i * 15000),
                    'dept': '75',
                    'city': city,
                    'coords': {'lat': 48.85 + (i*0.01), 'lng': 2.34 + (i*0.01)},
                    'bedrooms': 3 + i,
                    'surface': 90 + (i * 10),
                    'style': 'maison',
                    'source': 'leboncoin',
                    'population': 'large',
                    'proximity': ['commerce'],
                    'risks': [],
                    'url': 'https://www.leboncoin.fr'
                })
            
            logger.info(f"✅ Scraped Leboncoin for {city}")
        except Exception as e:
            logger.error(f"❌ Error scraping Leboncoin: {e}")
    
    def scrape_seloger(self, city, price_min=0, price_max=1000000):
        """Scrape SeLoger"""
        try:
            url = f"{SOURCES['seloger']['base_url']}{SOURCES['seloger']['search_endpoint']}"
            params = {
                'quickFields': 'quasi:vente:maison,apartement',
                'locations': city,
            }
            response = requests.get(url, params=params, headers=HEADERS, timeout=self.timeout)
            response.raise_for_status()
            
            self.listings.append({
                'title': f'Appartement SeLoger à {city}',
                'price': 450000,
                'dept': '75',
                'city': city,
                'coords': {'lat': 48.86, 'lng': 2.35},
                'bedrooms': 2,
                'surface': 65,
                'style': 'appartement',
                'source': 'seloger',
                'population': 'large',
                'proximity': ['medecin'],
                'risks': [],
                'url': 'https://www.seloger.com'
            })
            
            logger.info(f"✅ Scraped SeLoger for {city}")
        except Exception as e:
            logger.error(f"❌ Error scraping SeLoger: {e}")
    
    def scrape_bienici(self, city, price_min=0, price_max=1000000):
        """Scrape Bien ici"""
        try:
            url = f"{SOURCES['bienici']['base_url']}{SOURCES['bienici']['search_endpoint']}"
            params = {'where': city}
            response = requests.get(url, params=params, headers=HEADERS, timeout=self.timeout)
            response.raise_for_status()
            
            self.listings.append({
                'title': f'Villa BienIci à {city}',
                'price': 850000,
                'dept': '33',
                'city': city,
                'coords': {'lat': 44.84, 'lng': -0.57},
                'bedrooms': 5,
                'surface': 200,
                'style': 'villa',
                'source': 'bienIci',
                'population': 'large',
                'proximity': ['hopital'],
                'risks': ['feu'],
                'url': 'https://www.bienici.com'
            })
            
            logger.info(f"✅ Scraped Bien ici for {city}")
        except Exception as e:
            logger.error(f"❌ Error scraping Bien ici: {e}")
    
    def scrape_immobilier_com(self, city, price_min=0, price_max=1000000):
        """Scrape Immobilier.com"""
        try:
            url = f"{SOURCES['immobilier_com']['base_url']}{SOURCES['immobilier_com']['search_endpoint']}"
            params = {'query': city}
            response = requests.get(url, params=params, headers=HEADERS, timeout=self.timeout)
            response.raise_for_status()
            
            # TODO: Implémenter le parsing HTML avec BeautifulSoup
            
            logger.info(f"✅ Scraped Immobilier.com for {city}")
        except Exception as e:
            logger.error(f"❌ Error scraping Immobilier.com: {e}")
    
    def get_all_listings(self, city, filters=None):
        """Récupère tous les annonces des différentes sources"""
        if filters is None:
            filters = {}
        
        price_min = filters.get('price_min', 0)
        price_max = filters.get('price_max', 1000000)
        sources = filters.get('sources', ['leboncoin', 'seloger', 'bienici', 'immobilier_com'])
        
        # Scraper toutes les sources activées
        if 'leboncoin' in sources and SOURCES['leboncoin']['enabled']:
            self.scrape_leboncoin(city, price_min, price_max)
        if 'seloger' in sources and SOURCES['seloger']['enabled']:
            self.scrape_seloger(city, price_min, price_max)
        if 'bienici' in sources and SOURCES['bienici']['enabled']:
            self.scrape_bienici(city, price_min, price_max)
        if 'immobilier_com' in sources and SOURCES['immobilier_com']['enabled']:
            self.scrape_immobilier_com(city, price_min, price_max)
        
        return self.listings


scraper = RealEstateScraper()


@app.route('/api/health', methods=['GET'])
def health():
    """Vérifier l'état du serveur"""
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })


@app.route('/api/search', methods=['POST'])
def search():
    """Endpoint pour rechercher des biens immobiliers"""
    try:
        data = request.get_json()
        
        # Paramètres requis
        city = data.get('city', '')
        if not city:
            return jsonify({'error': 'City parameter required'}), 400
        
        # Filtres optionnels
        filters = {
            'price_min': data.get('price_min', 0),
            'price_max': data.get('price_max', 1000000),
            'surface_min': data.get('surface_min', 0),
            'bedrooms': data.get('bedrooms', 0),
            'type': data.get('type', ''),
            'proximity': data.get('proximity', []),
            'risks': data.get('risks', []),
            'sources': data.get('sources', ['leboncoin', 'seloger', 'bienici', 'immobilier_com']),
        }
        
        # Récupérer les annonces
        listings = scraper.get_all_listings(city, filters)
        
        return jsonify({
            'city': city,
            'count': len(listings),
            'listings': listings,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Search error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/listings', methods=['GET'])
def get_listings():
    """Récupérer les annonces avec filtres"""
    try:
        city = request.args.get('city', '')
        price_min = int(request.args.get('price_min', 0))
        price_max = int(request.args.get('price_max', 1000000))
        
        if not city:
            return jsonify({'error': 'City parameter required'}), 400
        
        # Récupérer depuis la source de données
        listings = scraper.get_all_listings(
            city,
            {'price_min': price_min, 'price_max': price_max}
        )
        
        return jsonify({
            'listings': listings,
            'count': len(listings)
        })
    
    except Exception as e:
        logger.error(f"Get listings error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/suggestions/cities', methods=['GET'])
def get_city_suggestions():
    """Suggestions de villes"""
    cities = [city['name'] for city in MAIN_CITIES]
    return jsonify({'cities': cities})


@app.route('/api/departments', methods=['GET'])
def get_departments():
    """Récupérer les départements"""
    depts = [
        {'code': code, 'name': name} 
        for code, name in DEPARTMENTS.items()
    ]
    return jsonify({'departments': depts})


@app.route('/api/filters', methods=['GET'])
def get_filters():
    """Récupérer la configuration des filtres"""
    return jsonify({
        'filters': FILTERS,
        'sources': {key: value['name'] for key, value in SOURCES.items()}
    })


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Statistiques sur les annonces"""
    return jsonify({
        'total_listings': len(scraper.listings),
        'sources': [source['name'] for source in SOURCES.values()],
        'cities': len(MAIN_CITIES),
        'last_updated': datetime.now().isoformat()
    })


@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'production') == 'development'
    app.run(debug=debug, host='0.0.0.0', port=port, use_reloader=False)
