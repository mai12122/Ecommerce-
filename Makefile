COMPOSE := docker compose
BACKEND_SERVICE := backend

.PHONY: help up down restart logs promote-nara promote-chesda promote-manea promote-hai pormote-hai promote-all

help:
	@echo "Available commands:"
	@echo "  make up              # Start all services with build"
	@echo "  make down            # Stop all services"
	@echo "  make restart         # Restart all services"
	@echo "  make logs            # Follow docker compose logs"
	@echo "  make promote-nara    # Promote nara account"
	@echo "  make promote-chesda  # Promote chesda account"
	@echo "  make promote-manea   # Promote manea account"
	@echo "  make promote-hai     # Promote hai account"
	@echo "  make pormote-hai     # Alias for promote-hai"
	@echo "  make promote-all     # Promote all four accounts"

up:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down

restart: down up

logs:
	$(COMPOSE) logs -f

promote-nara:
	$(COMPOSE) exec -T $(BACKEND_SERVICE) python manage.py shell -c "from django.contrib.auth import get_user_model; User=get_user_model(); u, created = User.objects.get_or_create(username='nara', defaults={'email':'sn6024010087@camtech.edu.kh'}); u.email='sn6024010087@camtech.edu.kh'; u.is_staff=True; u.is_superuser=True; u.save(); print('nara promoted')"

promote-chesda:
	$(COMPOSE) exec -T $(BACKEND_SERVICE) python manage.py shell -c "from django.contrib.auth import get_user_model; User=get_user_model(); u, created = User.objects.get_or_create(username='chesda', defaults={'email':'cm6024010084@camtech.edu.kh'}); u.email='cm6024010084@camtech.edu.kh'; u.is_staff=True; u.is_superuser=True; u.save(); print('chesda promoted')"

promote-manea:
	$(COMPOSE) exec -T $(BACKEND_SERVICE) python manage.py shell -c "from django.contrib.auth import get_user_model; User=get_user_model(); u, created = User.objects.get_or_create(username='manea', defaults={'email':'vc6024020004@camtech.edu.kh'}); u.email='vc6024020004@camtech.edu.kh'; u.is_staff=True; u.is_superuser=True; u.save(); print('manea promoted')"

promote-hai:
	$(COMPOSE) exec -T $(BACKEND_SERVICE) python manage.py shell -c "from django.contrib.auth import get_user_model; User=get_user_model(); u, created = User.objects.get_or_create(username='hai', defaults={'email':'It6024010011@camtech.edu.kh'}); u.email='It6024010011@camtech.edu.kh'; u.is_staff=True; u.is_superuser=True; u.save(); print('hai promoted')"

pormote-hai: promote-hai

promote-all: promote-nara promote-chesda promote-manea promote-hai
	@echo "All four users are promoted."
