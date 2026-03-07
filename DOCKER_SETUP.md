# Docker Setup

Run the whole project (PostgreSQL + Django backend + React frontend) with Docker.

## Prerequisites
- Docker Desktop installed and running

## Start Project
From the project root (`Ecommerce-final`):

```bash
docker compose up --build
```

## Open App
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api/`
- Django Admin: `http://localhost:8000/admin/`

## Create Superuser
In a new terminal:

```bash
docker compose exec backend python manage.py createsuperuser
```

## Stop Project

```bash
docker compose down
```

## Reset Database (Optional)
This deletes all Postgres data and starts fresh:

```bash
docker compose down -v
docker compose up --build
```
