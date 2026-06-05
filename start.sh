#!/bin/bash

set -e

PORT=${PORT:-8080}
echo "🚀 Démarrage du serveur HouseSearch sur le port ${PORT}..."
exec python server.py

