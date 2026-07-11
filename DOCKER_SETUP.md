# Docker Setup

Run the whole project (PostgreSQL + Django backend + React frontend) with Docker.

## Prerequisites
- Docker Desktop installed and running

## Environment Files
Use separate env files for each app:

1. Copy `backend/.env.example` to `backend/.env`.
2. Copy `frontend/.env.example` to `frontend/.env`.
2. Update values only if needed.

## Start Project
From the project root (`Ecommerce-`):

```bash
make up
```
## Load the product catalog fixture
The fixture file is already in the backend folder and is mounted into the container at `/app/catalog.json`, so you can load it directly:

```bash
docker compose cp backend/catalog.json backend:/app/catalog.json
docker compose exec -T backend python manage.py loaddata catalog.json
docker compose exec -T backend python manage.py shell -c "from store.models import Product, Category; print('products=', Product.objects.count(), 'categories=', Category.objects.count())"
```

> Note: On Windows/Git Bash, use the container-relative fixture name `catalog.json` instead of `/app/catalog.json` to avoid host path translation issues.

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
