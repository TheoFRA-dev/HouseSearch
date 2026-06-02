#!/bin/sh

PORT=${PORT:-3000}
echo "Starting server on port ${PORT}"
exec python3 server.py
