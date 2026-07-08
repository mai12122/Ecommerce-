# Demo Runbook

This runbook is for a live demo of the ecommerce app end to end.
It covers:
- commit → pipeline → deploy → app update
- one deep-dive topic (security)
- failure handling and self-healing or rollback
- screenshots to capture as backup evidence

## 1. Live end-to-end run

### Goal
Show the full path from source change to running application.

### Suggested flow
1. Make a small change in the repo, such as a text update in [README.md](README.md) or a harmless UI tweak.
2. Commit and push the change.
3. Let the CI workflow run from [.github/workflows/ci.yml](.github/workflows/ci.yml).
4. Build and deploy the app to the local Docker Swarm stack using [docker-stack.yml](docker-stack.yml).
5. Verify the app is live:
   - Backend health: http://127.0.0.1:8000/health/
   - Frontend: http://127.0.0.1:5173/

### Commands
```bash
git add .
git commit -m "Demo update"
git push

docker stack deploy -c docker-stack.yml ecommerce
docker service ls
docker service ps ecommerce_backend
docker service ps ecommerce_frontend
```

### What to show
- GitHub Actions/CI success
- Running Swarm services with replicas
- The app responding on the published ports

### Screenshot backup list
- CI run summary
- docker service ls output
- browser showing the frontend
- backend health response

---

## 2. Deep-dive topic: security

### Why this matters
Security is the bridge from delivery to production readiness. For this stack, the important discussion is how to reduce attack surface and keep secrets out of code.

### Demo points
- Keep secrets out of source control and use environment variables or Docker secrets instead of hard-coded credentials.
- Only publish the ports that are truly needed.
- Keep the database service internal to the application network where possible.
- Use health checks and centralized logs so failures are visible quickly.
- Restrict admin routes and avoid exposing debug features in production.

### Concrete repo evidence
- The app already uses environment-based configuration in [backend/backend/settings.py](backend/backend/settings.py).
- The stack uses named services and published ports in [docker-stack.yml](docker-stack.yml).
- Backup and logging are handled separately from the app runtime, which supports safer operations.

### Suggested talking points
- “We do not want credentials embedded in the repo.”
- “We expose only the frontend/backend ports needed by users.”
- “We collect logs centrally so suspicious activity is easier to investigate.”

---

## 3. Failure and recovery demo

### Option A: self-healing after container crash
This is the easiest live demo because it is already supported by Swarm.

```bash
docker ps --filter label=com.docker.swarm.service.name=ecommerce_backend --format "{{.ID}}"
docker kill <container-id>
docker service ps ecommerce_backend
```

### Expected result
- One backend replica is killed.
- Swarm starts a replacement task.
- The app continues to respond through the service endpoint.

### Verification
```bash
curl http://127.0.0.1:8000/health/
```

### Option B: rollback path
If a bad image is deployed, rollback by redeploying the previous image tag or previous stack definition.

```bash
docker service update --image ecommerce-backend:local ecommerce_backend
```

### Screenshot backup list
- service ps output before and after the crash
- health endpoint response during and after recovery
- logs showing the replacement task

---

## 4. Verified evidence already captured

The following checks were verified during the live run:
- Swarm stack deployed successfully
- Backend health endpoint returned 200
- Frontend responded on port 5173
- Backend and frontend were scaled up and back down live
- One backend replica was killed and the app stayed available
- Database backup was created successfully
- Logs were collected centrally and searched through Loki

## 5. Demo script summary

Use this as a short live presentation script:
1. “Here is the app running behind a Swarm service.”
2. “I will trigger a small change and show the pipeline and deploy flow.”
3. “I will explain one security hardening point.”
4. “I will crash one replica and show that the service self-heals.”
5. “I will show the app still responding and the logs/backup workflow.”
