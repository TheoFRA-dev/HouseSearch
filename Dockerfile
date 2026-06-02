FROM python:3.13-slim

WORKDIR /app

COPY . /app

RUN chmod +x /app/start.sh

ENV PORT=3000
EXPOSE 3000

CMD ["/app/start.sh"]
