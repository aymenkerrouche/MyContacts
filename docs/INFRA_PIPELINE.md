# Infrastructure & Pipeline Documentation

This document summarizes the infrastructure and CI/CD pipelines used for the MyContacts project, plus usage examples for local deploy and Jenkins.

**Overview**
- **Frontend**: Vite React app built to static `dist/` and served by `nginx` on a Linux VM (Ubuntu/Azure).
- **Backend**: Node/Express app using `mongoose` connecting to MongoDB (production DB outside scope).
- **CI/CD**: Jenkins pipelines (frontend and backend) provided via `frontend/Jenkinsfile` and `backend/Jenkinsfile`.

**Files of interest**
- Frontend deploy script: [frontend/deploy.sh](frontend/deploy.sh)
- Frontend Jenkinsfile: [frontend/Jenkinsfile](frontend/Jenkinsfile)
- Backend Jenkinsfile: [backend/Jenkinsfile](backend/Jenkinsfile)
- Frontend tests: [frontend/src/__tests__](frontend/src/__tests__)
- Backend tests: [backend/tests](backend/tests)

**Infrastructure (VM)**
- **OS**: Ubuntu (examples used Ubuntu 24.04)
- **HTTP server**: `nginx` serves static files from `/var/www/mycontacts` (config must include `try_files $uri $uri/ /index.html;` to support SPA routing)
- **SSH**: open port `22` in Azure Network Security Group for deploys (use SSH key authentication for security)

**Environment variables**
- Frontend (build time): `VITE_API_URL` — API base URL injected at build time. Example: `VITE_API_URL=https://mycontacts-sb39.onrender.com npm run build`.
- Backend (runtime): `MONGO_URI`, `JWT_SECRET`, `BCRYPT_SALT_ROUNDS`, `JWT_EXPIRES_IN`, `PORT`.

**Local deploy (frontend)**
- Use the provided script `frontend/deploy.sh` to build and push to a VM.
- Basic usage (password or key-based SSH):
  - Build & deploy (password):
    ```bash
    ./deploy.sh -h 20.199.138.74 -u aymen -p /var/www/mycontacts -a https://mycontacts-sb39.onrender.com
    ```
  - Build & deploy (SSH key):
    ```bash
    ./deploy.sh -h 20.199.138.74 -u aymen -p /var/www/mycontacts -i ~/.ssh/id_rsa -a https://mycontacts-sb39.onrender.com
    ```
- Options: `-s` skip build, `-r` set remote temp dir.

**Jenkins (frontend)**
- Image: Docker `node:18` agent. Ensure agent can run Docker or uses Docker-enabled nodes.
- Stages (see `frontend/Jenkinsfile`): `Checkout`, `Install`, `Lint`, `Test` (Vitest), `Build`, `Deploy` (optional).
- Deploy stage uses Jenkins credential `ssh-deploy-key` (type: SSH Username with private key). Set pipeline env vars:
  - `DEPLOY_HOST` — target VM IP/DNS
  - `DEPLOY_USER` — SSH user (default `aymen`)
  - `DEPLOY_PATH` — remote web root (default `/var/www/mycontacts`)
  - `API_URL` — optional `VITE_API_URL` used during build
- Jenkins will call `frontend/deploy.sh` and use the credential key file injected by Jenkins.

**Jenkins (backend)**
- Stages (see `backend/Jenkinsfile`): `Checkout`, `Install`, `Test` (Jest + `jest-junit` reporter), `Archive`, and optional `Deploy` which calls `deploy-backend.sh` if available.
- The pipeline publishes test results to Jenkins via `junit` step (`test-results.xml`). Ensure `jest-junit` is listed in `devDependencies` and `JEST_JUNIT_OUTPUT` env var configured.

**Running tests locally**
- Backend:
  ```bash
  cd backend
  npm test
  ```
- Frontend:
  ```bash
  cd frontend
  npm test
  ```

**Security & best practices**
- Use SSH keys and disable password authentication on the VM.
- Limit NSG rules to required IPs where possible.
- Do not store secrets in plain text — use Azure Key Vault or Jenkins credentials for CI secrets.
- Ensure `JWT_SECRET` and database credentials are rotated and stored securely.

**Troubleshooting**
- If SPA routes 404: verify `nginx` configuration contains `try_files $uri $uri/ /index.html;`.
- If deployment fails with permission errors: check `REMOTE_PATH` ownership; `deploy.sh` sets owner to `www-data`.
- If tests fail in Jenkins: inspect `test-results.xml` archived artifact and pipeline console logs.

**Next steps / Improvements**
- Add `deploy-backend.sh` to streamline backend deployment (I can add this file on request).
- Add automatic Blue/Green or canary deploy strategy for frontend.
- Add GitHub Actions as alternative CI for simpler integration with pull requests.

---
If you want, I can: add `deploy-backend.sh`, provide a sample `nginx` site config, or create a multibranch Jenkins pipeline with parameters. 
