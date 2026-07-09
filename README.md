# Ecommerce Project

This repository contains a Django backend and a React frontend for an ecommerce application.

## CI / Delivery pipeline

A GitHub Actions workflow is configured in `.github/workflows/ci.yml`.
It runs on `push` to `main`/`master` and on pull requests.

The workflow includes:
- backend dependency install
- Django system checks
- backend unit tests
- frontend dependency install
- frontend build
- Docker image builds for backend and frontend
- `docker compose config` validation

## Local test commands

### Start the stack

Use Docker Compose to run the full application locally:

```bash
make up
```

Stop the stack with:

```bash
make down
```

### Run backend tests

You can run backend tests locally with either:

```bash
make test
```

or from the backend folder directly:

```bash
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt
python manage.py test
```

### Useful Makefile commands

```bash
make up          # Start all services with docker compose
make down        # Stop all services
make logs        # Follow service logs
make test        # Run backend tests in the backend container
```

### Build frontend locally

From the `frontend` folder:

```bash
npm ci
npm run build
```

### Validate Docker Compose

Run this command to validate the compose configuration:

```bash
docker compose -f docker-compose.yml config
```

### Deploy with Docker Swarm

Build the images and deploy the stack with multiple replicas:

```bash
docker swarm init --advertise-addr 127.0.0.1
docker build -t ecommerce-backend:local ./backend
docker build -t ecommerce-frontend:local ./frontend
docker stack deploy -c docker-stack.yml ecommerce
```

Verify the running services and replicas:

```bash
docker service ls
docker service ps ecommerce_backend
docker service ps ecommerce_frontend
```

The app will be available at:
- Backend: http://127.0.0.1:8000/health/
- Frontend: http://127.0.0.1:5173/

### Live scaling

You can change replica counts without stopping the app:

```bash
docker service scale ecommerce_backend=3 ecommerce_frontend=3
docker service scale ecommerce_backend=2 ecommerce_frontend=2
```

A practical autoscaling rule for this stack would be based on backend CPU usage, for example:
- scale out when CPU stays above 70% for 5 minutes
- scale in when CPU stays below 40% for 10 minutes
- sensible bounds: backend min 2 / max 5, frontend min 2 / max 4

To remove the stack later:

```bash
docker stack rm ecommerce
```

### Database backup and restore

The PostgreSQL data is backed up as a logical SQL dump from the running database container. The backup includes all application data in the ecommerce_db database, including users, products, carts, orders, and media references.

Backup cadence:
- On-demand: run the script whenever you need a fresh backup
- Suggested schedule: daily at 02:00 via cron or a scheduled task
- Storage location: the backup files are written to the backup/out folder in the repository

Create a backup:

```bash
bash ./backup/backup-db.sh
```

Restore from a backup:

```bash
bash ./backup/restore-db.sh ./backup/out/ecommerce_pg_dump_YYYYMMDD_HHMMSS.sql
```

If you want a scheduled backup on Linux/macOS, a cron example is:

```bash
0 2 * * * /d/Ecommerce-/backup/backup-db.sh /d/Ecommerce-/backup/out >> /d/Ecommerce-/backup/backup.log 2>&1
```

### Centralized logs with Loki + Grafana

The stack now includes centralized logging with Loki and Grafana so container logs from the app and supporting services can be searched in one place.

How it works:
- Promtail collects logs from Docker containers and forwards them to Loki
- Loki stores the logs centrally
- Grafana provides a searchable UI for filtering by service, container, and log content

Access points:
- Grafana: http://127.0.0.1:3000
- Loki API: http://127.0.0.1:3100

Example search:
- Search for `Not Found: /api/products/does-not-exist/` to find the generated error from the backend

To deploy the logging stack:

```bash
docker stack deploy -c docker-stack-logging.yml ecommerce-logging
```

## Notes

- `make test` runs Django tests in the backend service.
- The CI workflow ensures both backend and frontend are validated on every push/PR.
