# 🚀 CI/CD Pipeline with GitHub Actions for React + Flask Using Docker

## 📘 Overview

This guide documents the setup of a Continuous Integration and Continuous Deployment (CI/CD) pipeline for a full-stack application using **React (frontend)** and **Flask (backend)**. The pipeline is powered by **GitHub Actions** and leverages **Docker** for containerization and deployment.

---

## 📁 Project Structure

```
/your-project-root
│
├── frontend/               # React application
│   └── Dockerfile
│
├── backend/                # Flask API
│   └── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml
└── .github/
    └── workflows/
        └── docker-ci-cd.yml
```

---

## ⚙️ Docker Setup

### 🔹 Flask Backend Dockerfile (`backend/Dockerfile`)

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY . /app

RUN pip install --upgrade pip && pip install -r requirements.txt

CMD ["python", "app.py"]
```

### 🔹 React Frontend Dockerfile (`frontend/Dockerfile`)

```dockerfile
FROM node:18

WORKDIR /app
COPY . /app

RUN npm install && npm run build
```

### 🔹 Docker Compose File (`docker-compose.yml`)

```yaml
version: '3'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
```

---

## 🤖 GitHub Actions Workflow

### 📄 Workflow File: `.github/workflows/docker-ci-cd.yml`

```yaml
name: CI/CD with Docker for React + Flask

on:
  push:
    branches: [ main ]

jobs:
  docker-build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Flask backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/flask-backend:latest

      - name: Build and push React frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/react-frontend:latest
```

---

## 🔐 Secrets Configuration

Navigate to **GitHub Repository > Settings > Secrets and Variables > Actions**, and add the following:

| Name             | Description                  |
|------------------|------------------------------|
| `DOCKER_USERNAME` | Your Docker Hub username     |
| `DOCKER_PASSWORD` | Your Docker Hub access token |

> ⚠️ Use [Docker Hub access tokens](https://hub.docker.com/settings/security) instead of your password for better security.

---

## ✅ CI/CD Pipeline Flow

1. ✅ On every `push` to the `main` branch:
2. 🔄 GitHub Actions checks out the latest code.
3. 🐳 Docker Buildx is configured for multi-platform builds.
4. 🔐 Logs into Docker Hub using secrets.
5. 🏗 Builds and pushes the **Flask backend** Docker image.
6. 🏗 Builds and pushes the **React frontend** Docker image.

---

## 🚀 Deployment (Optional)

You can deploy these images by pulling them to your server or container orchestration service:

```bash
docker pull yourusername/react-frontend:latest
docker pull yourusername/flask-backend:latest
```

Then run:

```bash
docker-compose up -d
```

---

## 📌 Next Steps

- ✅ Add tests inside Docker before push (unit testing).
- 🔐 Use GitHub Container Registry (GHCR) for private images.
- 🚀 Auto-deploy to VPS (via SSH) or cloud (AWS/GCP/DO).

---

If you'd like, I can generate a PDF or add deployment examples for Heroku, Render, EC2, or Firebase Hosting too. Want that?