# Docker Setup

Run the whole project (PostgreSQL + Django backend + React frontend) with Docker.

## Prerequisites
- Docker Desktop installed and running

## Environment File
Use a single `.env` file in the project root.

1. Copy `.env.example` to `.env`.
2. Update values only if needed.

## Start Project
From the project root (`Ecommerce-final`):

```bash
docker compose up --build
```

## Open App
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api/`
- Django Admin: `http://localhost:8000/admin/`
# admin password and username
- username = admin
- password = Admin@12345

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
