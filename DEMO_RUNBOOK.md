# Demo Runbook

This runbook is a simple guide for presenting the ecommerce project as a live delivery demo.
It is meant to help you explain the full journey from code change to deployed application in a way that is easy to follow.

## What this demo should show
By the end of the presentation, the audience should understand:
- how a small change moves from Git to a running app
- how CI validates the change
- how Docker Swarm deploys and manages the app
- how the system handles failure and recovery
- why security and observability matter in production

---

## 1. Before you start

Make sure the following are ready:
- the repository is available locally
- Docker and Docker Swarm are running
- the app is already deployed or can be deployed quickly
- a browser tab is open to the frontend
- a terminal is open in the repository root

### Quick health check
Run these commands first:

```sh
docker service ls
curl http://127.0.0.1:8000/health/
```

Notes:
- If you are using PowerShell, run the same commands directly in the shell; no separate Bash terminal is required.
- If you are using WSL, make sure Docker Desktop is running and that WSL integration is enabled. The error `failed to connect to the docker API at unix:///var/run/docker.sock` means the Docker daemon is not available in that shell.

Expected result:
- Docker services are listed
- the backend health endpoint returns a successful response

---

## 2. Main demo flow: from change to deployment

### Goal
Show the full path from a code change to a live application update.

### Step 1: Make a tiny change
Use a harmless change such as updating the README or changing a small UI label.

```sh
git add .
git commit -m "Demo update"
git push
```

### Step 2: Show the CI pipeline
Explain that the pipeline in [.github/workflows/ci.yml](.github/workflows/ci.yml) will run automatically.

What the audience should see:
- backend tests run
- frontend build runs
- Docker images are built
- the compose configuration is validated

### Step 3: Deploy the update
Deploy the stack using the Swarm definition in [docker-stack.yml](docker-stack.yml):

```sh
docker stack deploy -c docker-stack.yml ecommerce
docker service ls
docker service ps ecommerce_backend
docker service ps ecommerce_frontend
```

### Step 4: Verify the app is live
Check both the backend and frontend:

```sh
curl http://127.0.0.1:8000/health/
```

Open the frontend in the browser:
- http://127.0.0.1:5173/

### What to highlight during this part
- the change was committed and pushed
- CI validated the change
- the deployment updated the running services
- the app is still available after deployment

---

## 3. Simple security talking points

Keep the explanation short and practical.

### Easy points to mention
- secrets should not be stored directly in the repository
- only the required ports should be exposed
- the database should stay on the internal application network where possible
- health checks and logs help detect problems early
- admin features should be restricted in production

### Repo evidence you can point to
- environment-based configuration in [backend/backend/settings.py](backend/backend/settings.py)
- service and port setup in [docker-stack.yml](docker-stack.yml)
- backup and logging support in the [backup](backup) and [monitoring](monitoring) folders

### Short phrases you can use
- “We do not want credentials embedded in the repo.”
- “We only expose the ports that users actually need.”
- “We use logs and health checks so issues are easier to spot.”

---

## 4. Failure and recovery demo

This is the easiest live demo because Docker Swarm can recover automatically.

### Step 1: Kill one backend container
```sh
docker ps --filter label=com.docker.swarm.service.name=ecommerce_backend --format "{{.ID}}"
docker kill <container-id>
```

### Step 2: Show that Swarm replaces it
```sh
docker service ps ecommerce_backend
```

### Step 3: Verify the app still works
```sh
curl http://127.0.0.1:8000/health/
```

### Expected result
- one backend replica is removed
- Swarm starts a replacement container
- the app continues to respond

This is a strong example of self-healing infrastructure.

---

## 5. Backup and monitoring demo

If you want to add one more operational story, show that backups and logs are part of the setup.

### Create a database backup
```sh
bash ./backup/backup-db.sh
```

### Show centralized logging
If the logging stack is running:

```sh
docker stack deploy -c docker-stack-logging.yml ecommerce-logging
```

Then mention:
- Grafana: http://127.0.0.1:3000
- Loki: http://127.0.0.1:3100

---

## 6. Suggested presenter script

Use this as a short script during the demo:

1. “Here is the application running behind a containerized deployment.”
2. “I will make a small change and show how it flows through CI.”
3. “I will deploy it to the running environment and verify that the app is still live.”
4. “I will highlight one security practice that improves production readiness.”
5. “I will simulate a container failure and show that the platform recovers automatically.”

---

## 7. Screenshot checklist

Capture these as backup evidence if needed:
- CI run summary
- Docker service list output
- the frontend in the browser
- backend health response
- Swarm service status after the container crash
- backup output or logging screen

