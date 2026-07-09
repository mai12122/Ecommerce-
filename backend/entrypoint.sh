#!/bin/sh
set -e

if [ -n "$DB_HOST" ]; then
  echo "Waiting for PostgreSQL at $DB_HOST:$DB_PORT"
  until python - <<'PY'
import os
import sys
import psycopg2
conn = None
try:
    conn = psycopg2.connect(
        dbname=os.getenv('DB_NAME', 'ecommerce_db'),
        user=os.getenv('DB_USER', 'postgres'),
        password=os.getenv('DB_PASSWORD', 'admin'),
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5432'),
    )
    conn.close()
    sys.exit(0)
except Exception:
    sys.exit(1)
PY
  do
    sleep 2
  done
fi

python manage.py migrate --noinput
exec python manage.py runserver 0.0.0.0:8000
