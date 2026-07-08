#!/bin/bash
set -euo pipefail

BACKUP_DIR="${1:-/d/Ecommerce-/backup/out}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="${BACKUP_DIR}/ecommerce_pg_dump_${TIMESTAMP}.sql"
mkdir -p "$BACKUP_DIR"

CONTAINER_ID=$(docker ps -q --filter label=com.docker.swarm.service.name=ecommerce_db | head -n 1)
if [ -z "$CONTAINER_ID" ]; then
  echo "No running database container found for ecommerce_db" >&2
  exit 1
fi

docker exec "$CONTAINER_ID" pg_dump -U postgres -d ecommerce_db > "$BACKUP_FILE"

echo "Backup created: $BACKUP_FILE"
