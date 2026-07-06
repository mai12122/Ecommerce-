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

## Notes

- `make test` runs Django tests in the backend service.
- The CI workflow ensures both backend and frontend are validated on every push/PR.
