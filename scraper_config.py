"""
Configuration centralisée pour les scrapers HouseSearch
"""

import os
from dotenv import load_dotenv

load_dotenv()

# Configuration générale
SCRAPER_CONFIG = {
    'timeout': int(os.getenv('SCRAPER_TIMEOUT', 10)),
    'retries': int(os.getenv('SCRAPER_RETRIES', 3)),
    'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

# Configuration des sources
SOURCES = {
    'leboncoin': {
        'name': 'Leboncoin',
        'base_url': 'https://www.leboncoin.fr',
        'search_endpoint': '/recherche',
        'enabled': True,
        'category': 10,  # 10 = Immobilier
    },
    'seloger': {
        'name': 'SeLoger',
        'base_url': 'https://www.seloger.com',
        'search_endpoint': '/list.htm',
        'enabled': True,
    },
    'bienici': {
        'name': 'Bien ici',
        'base_url': 'https://www.bienici.com',
        'search_endpoint': '/search.html',
        'enabled': True,
    },
    'immobilier_com': {
        'name': 'Immobilier.com',
        'base_url': 'https://www.immobilier.com',
        'search_endpoint': '/search',
        'enabled': True,
    },
}

# Filtres supportés
FILTERS = {
    'price': {
        'min': 0,
        'max': 10000000,
        'step': 10000,
    },
    'surface': {
        'min': 0,
        'max': 10000,
        'step': 10,
    },
    'bedrooms': [1, 2, 3, 4, 5, 6],
    'house_styles': ['maison', 'appartement', 'villa', 'loft', 'terrain'],
    'population': ['rural', 'small', 'medium', 'large'],
    'proximity': ['commerce', 'medecin', 'hopital', 'ecole', 'transport'],
    'risks': ['argile', 'feu', 'inondation', 'seisme'],
}

# Villes principales
MAIN_CITIES = [
    {'name': 'Paris', 'lat': 48.8566, 'lon': 2.3522, 'dept': '75'},
    {'name': 'Lyon', 'lat': 45.7640, 'lon': 4.8357, 'dept': '69'},
    {'name': 'Marseille', 'lat': 43.2965, 'lon': 5.3698, 'dept': '13'},
    {'name': 'Toulouse', 'lat': 43.6047, 'lon': 1.4442, 'dept': '31'},
    {'name': 'Nice', 'lat': 43.7102, 'lon': 7.2620, 'dept': '06'},
    {'name': 'Bordeaux', 'lat': 44.8378, 'lon': -0.5792, 'dept': '33'},
    {'name': 'Nantes', 'lat': 47.2184, 'lon': -1.5536, 'dept': '44'},
    {'name': 'Lille', 'lat': 50.6292, 'lon': 3.0573, 'dept': '59'},
    {'name': 'Rennes', 'lat': 48.1173, 'lon': -1.6778, 'dept': '35'},
    {'name': 'Strasbourg', 'lat': 48.5734, 'lon': 7.7521, 'dept': '67'},
]

# Départements français
DEPARTMENTS = {
    '01': 'Ain', '02': 'Aisne', '03': 'Allier', '04': 'Alpes-de-Haute-Provence',
    '05': 'Hautes-Alpes', '06': 'Alpes-Maritimes', '07': 'Ardèche', '08': 'Ardennes',
    '09': 'Ariège', '10': 'Aube', '11': 'Aude', '12': 'Aveyron', '13': 'Bouches-du-Rhône',
    '14': 'Calvados', '15': 'Cantal', '16': 'Charente', '17': 'Charente-Maritime',
    '18': 'Cher', '19': 'Corrèze', '2A': 'Corse-du-Sud', '2B': 'Haute-Corse',
    '21': 'Côte-d\'Or', '22': 'Côtes-d\'Armor', '23': 'Creuse', '24': 'Dordogne',
    '25': 'Doubs', '26': 'Drôme', '27': 'Eure', '28': 'Eure-et-Loir', '29': 'Finistère',
    '30': 'Gard', '31': 'Haute-Garonne', '32': 'Gers', '33': 'Gironde', '34': 'Hérault',
    '35': 'Ille-et-Vilaine', '36': 'Indre', '37': 'Indre-et-Loire', '38': 'Isère',
    '39': 'Jura', '40': 'Landes', '41': 'Loir-et-Cher', '42': 'Loire', '43': 'Haute-Loire',
    '44': 'Loire-Atlantique', '45': 'Loiret', '46': 'Lot', '47': 'Lot-et-Garonne',
    '48': 'Lozère', '49': 'Maine-et-Loire', '50': 'Manche', '51': 'Marne',
    '52': 'Haute-Marne', '53': 'Mayenne', '54': 'Meurthe-et-Moselle', '55': 'Meuse',
    '56': 'Morbihan', '57': 'Moselle', '58': 'Nièvre', '59': 'Nord', '60': 'Oise',
    '61': 'Orne', '62': 'Pas-de-Calais', '63': 'Puy-de-Dôme', '64': 'Pyrénées-Atlantiques',
    '65': 'Hautes-Pyrénées', '66': 'Pyrénées-Orientales', '67': 'Bas-Rhin', '68': 'Haut-Rhin',
    '69': 'Rhône', '70': 'Haute-Saône', '71': 'Saône-et-Loire', '72': 'Sarthe',
    '73': 'Savoie', '74': 'Haute-Savoie', '75': 'Paris', '76': 'Seine-Maritime',
    '77': 'Seine-et-Marne', '78': 'Yvelines', '79': 'Deux-Sèvres', '80': 'Somme',
    '81': 'Tarn', '82': 'Tarn-et-Garonne', '83': 'Var', '84': 'Vaucluse',
    '85': 'Vendée', '86': 'Vienne', '87': 'Haute-Vienne', '88': 'Vosges',
    '89': 'Yonne', '90': 'Territoire-de-Belfort', '91': 'Essonne', '92': 'Hauts-de-Seine',
    '93': 'Seine-Saint-Denis', '94': 'Val-de-Marne', '95': 'Val-d\'Oise',
}
