FROM python:3.11-slim

WORKDIR /app

# Copy backend requirements and install
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code, models, data, and scripts
COPY backend/ ./backend/
COPY tools/ ./tools/

WORKDIR /app/backend

EXPOSE 5000

CMD ["python", "app.py"]
