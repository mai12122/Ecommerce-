#!/bin/sh
set -e

# Generate .env file from environment variables
cat > /app/.env << EOF
VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID:-}
VITE_DJANGO_BASE_URL=${VITE_DJANGO_BASE_URL:-http://localhost:8000}
EOF

echo "Generated .env file:"
cat /app/.env

# Start the dev server
npm run dev -- --host 0.0.0.0 --port 5173
