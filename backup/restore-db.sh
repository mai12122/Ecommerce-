#!/bin/bash
set -euo pipefail

BACKUP_FILE="${1:-}"
if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 /path/to/backup.sql" >&2
  exit 1
fi

CONTAINER_ID=$(docker ps -q --filter label=com.docker.swarm.service.name=ecommerce_db | head -n 1)
if [ -z "$CONTAINER_ID" ]; then
  echo "No running database container found for ecommerce_db" >&2
  exit 1
fi

cat "$BACKUP_FILE" | docker exec -i "$CONTAINER_ID" psql -U postgres -d ecommerce_db

echo "Restore completed from $BACKUP_FILE"
