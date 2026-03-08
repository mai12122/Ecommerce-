# Docker Setup

Run the whole project (PostgreSQL + Django backend + React frontend) with Docker.

## Prerequisites
- Docker Desktop installed and running

## Environment File
Use a single `.env` file in the project root.

1. Copy `.env.example` to `.env`.
2. Update values only if needed.

## Start Project
From the project root (`Ecommerce-`):

```bash
make up
```

## Open App
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api/products/`
- Django Admin: `http://localhost:8000/admin/`
# admin password and username
- username = admin
- password = Admin@12345

## Create Superuser
In a new terminal:

```bash
docker compose exec backend python manage.py createsuperuser
```

## Promote Team Accounts
Use these commands to promote the 4 team accounts (staff + superuser):

```bash
make promote-nara
make promote-chesda
make promote-manea
make promote-hai
```

Emails mapped in the Makefile:
- `promote-nara` -> `sn6024010087@camtech.edu.kh`
- `promote-chesda` -> `cm6024010084@camtech.edu.kh`
- `promote-manea` -> `vc6024020004@camtech.edu.kh`
- `promote-hai` -> `It6024010011@camtech.edu.kh`

After backend updates, run those promote commands again if user permissions need to be re-applied.

## Stop Project

```bash
make down
```

## Reset Database (Optional)
This deletes all Postgres data and starts fresh:

```bash
docker compose down -v
make up
```
