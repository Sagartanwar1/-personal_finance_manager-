FROM python:3.11-slim

WORKDIR /app

# system deps for psycopg2 if needed (keep small)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install -r requirements.txt

COPY . .

EXPOSE 8000

# Use the local module path (main:app) because the backend folder is the container's WORKDIR
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]