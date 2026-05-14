# 🎬 Cinelink Admin Console

<div align="center">

### Professional full-stack administration panel  
for managing cloud infrastructure, staff registry, and real-time system telemetry.

![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript)
![Go](https://img.shields.io/badge/Backend-Go-00ADD8?style=for-the-badge&logo=go)
![Node.js](https://img.shields.io/badge/Node.js-Server-339933?style=for-the-badge&logo=node.js)
![Tailwind](https://img.shields.io/badge/TailwindCSS-Styled-38B2AC?style=for-the-badge&logo=tailwind-css)

</div>

---

# ✨ Features

## 🖥 Infrastructure Control
Real-time management of:
- AWS instances
- Linux nodes (Kamatera)
- Windows servers

---

## 💻 Integrated Web Terminal
- Full SSH terminal access
- SFTP file upload support
- Browser-based infrastructure administration

---

## 📊 Real-time Telemetry
Dynamic monitoring dashboards powered by **Recharts**:
- CPU usage
- RAM consumption
- Temperature metrics
- Ping latency

---

## 👥 Staff Management
Advanced personnel registry system with:
- Smart filtering
- Search capabilities
- CSV export support

---

## 🚨 System Moderation
Centralized moderation and monitoring tools:
- Event registry
- Critical alert management
- Infrastructure activity tracking

---

## 🔒 Security
- Protected routes
- Session-based authentication
- Secure API communication

---

# 🛠 Tech Stack

## Frontend
```txt
React 18
TypeScript
Vite
Tailwind CSS
```

## Backend
```txt
Go (Golang)
Node.js
```

## UI & Libraries
```txt
Lucide React
Headless UI
Recharts
Xterm.js
```

---

# 🚀 Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone -b dev https://github.com/vladik-png/cinelinkadmfront.git
cd cinelinkadmfront
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory.

Example:

```env
VITE_API_URL=http://localhost:8080
```

> Refer to `.env.example` for full configuration details.

---

## 4️⃣ Start Development Server

```bash
npm run dev
```

---

# 📁 Project Structure

```txt
src/
├── api/          # Backend communication layer
├── components/   # Reusable UI components
├── hooks/        # Custom hooks & business logic
├── pages/        # Smart orchestrator components
├── types/        # TypeScript definitions
├── utils/        # Helper functions
```

---

# 🔗 Repositories

## Frontend Repository
```txt
https://github.com/vladik-png/cinelinkadmfront/tree/dev
```

## Backend Repository
```txt
https://github.com/vladik-png/cinelinkadmback/tree/dev
```

---

# 📌 Planned Improvements

- Centralized logging system (Grafana Loki / ELK)
- Kubernetes deployment support
- RBAC permission system
- Infrastructure automation workflows
- Real-time notification center

---

# 🧠 Expert Guide

Since the platform already manages distributed infrastructure across AWS, Linux, and Windows environments, implementing a centralized logging solution such as:

- Grafana Loki
- ELK Stack (Elasticsearch + Logstash + Kibana)

would significantly improve:
- incident tracking
- moderation visibility
- infrastructure debugging
- audit logging
- real-time observability

This could integrate directly into the future **Moderation Dashboard**.

---

# 📜 Commit Reference

```bash
docs: update README with project links and technical specifications
```

---

<div align="center">

## ❤️ Built by **vladik-png** © 2026

</div>