#!/usr/bin/env python3
"""
HouseSearch - Serveur de fichiers statiques avec intégration API
"""

import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CORSRequestHandler(SimpleHTTPRequestHandler):
    """Handler HTTP avec support CORS et gestion des erreurs"""
    
    def end_headers(self):
        """Ajouter les headers CORS"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Gérer les requêtes OPTIONS pour CORS"""
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        """Gérer les requêtes GET"""
        if self.path == '/':
            self.path = '/index.html'
        
        try:
            super().do_GET()
        except Exception as e:
            logger.error(f"Error handling GET {self.path}: {e}")
            self.send_response(500)
            self.end_headers()
            self.wfile.write(b'Internal Server Error')
    
    def log_message(self, format, *args):
        """Personnaliser les logs"""
        logger.info("%s - - [%s] %s" % (
            self.client_address[0],
            self.log_date_time_string(),
            format % args
        ))


def main():
    """Démarrer le serveur"""
    port = int(os.environ.get("PORT", 8080))
    
    # Changer le répertoire de travail vers le répertoire du script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    server_address = ("0.0.0.0", port)
    httpd = HTTPServer(server_address, CORSRequestHandler)
    
    logger.info(f"🚀 Serveur HouseSearch lancé sur http://localhost:{port}")
    logger.info(f"📁 Serveur les fichiers depuis: {script_dir}")
    logger.info("✅ Appuyez sur CTRL+C pour arrêter le serveur")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("\n👋 Serveur arrêté")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Erreur serveur: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
