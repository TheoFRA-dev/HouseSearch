FROM python:3.13-slim

WORKDIR /app

COPY . /app

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

ENV PORT=8080
EXPOSE 8080

CMD ["python", "server.py"]

