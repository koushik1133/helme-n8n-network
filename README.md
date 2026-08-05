# Enterprise Event Operations Platform

An enterprise-grade, high-concurrency Event Operations Platform designed to manage thousands of workers and tasks during large-scale events (political rallies, stadiums, concerts, airports, hospitals, construction sites, factories, and industrial plants).

---

## 🏛️ System Architecture Overview

```
                          ┌───────────────────────────────────────┐
                          │    Next.js Manager Operations Web     │
                          │   (Tactical Map & Kanban Dashboard)   │
                          └───────────────────┬───────────────────┘
                                              │ REST / WebSockets
                                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               FASTAPI BACKEND SERVICE                                  │
│                                                                                        │
│  ┌──────────────┐   ┌──────────────┐   ┌─────────────────┐   ┌──────────────────────┐  │
│  │ Auth & RBAC  │   │ Task Machine │   │ Dispatch Engine │   │ Multi-Modal AI Engine│  │
│  └──────────────┘   └──────────────┘   └─────────────────┘   └──────────────────────┘  │
│                                                                                        │
└──────────┬──────────────────────┬──────────────────────┬──────────────────────┬────────┘
           │                      │                      │                      │
           ▼                      ▼                      ▼                      ▼
┌──────────────────┐    ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ PostgreSQL 15 +  │    │  Redis Cache &   │   │  Celery / Task   │   │  Prometheus &    │
│ PostGIS Spatial  │    │ WebSocket PubSub │   │   Queue Workers  │   │  Grafana Metrics │
└──────────────────┘    └──────────────────┘   └──────────────────┘   └──────────────────┘
```

---

## 🎯 Key Features & Modules

### 1. Algorithmic Dispatch Engine (`apps/backend/app/modules/dispatch/engine.py`)
Multi-factor candidate scoring formula evaluating:
$$\text{Score} = w_1 \cdot \text{DistanceScore} + w_2 \cdot \text{SkillMatch} + w_3 \cdot \text{WorkloadScore} + w_4 \cdot \text{BatteryScore} + w_5 \cdot \text{NetworkScore} + w_6 \cdot \text{ZoneMatch}$$

- **DistanceScore**: PostGIS spherical proximity calculation (`ST_DistanceSphere`).
- **SkillMatch**: Set-overlap algorithm matching required task skills against worker profile certifications.
- **Workload & Telemetry Penalty**: Dynamic scoring based on active tasks, battery level, and network quality (5G/4G/3G/WiFi).

### 2. Multi-Modal AI Engine (`apps/backend/app/modules/ai/engine.py`)
- **Voice-to-Task**: Speech transcript ingestion with AI parameter extraction (`category`, `priority`, `required_skills`, `required_equipment`).
- **Vision OCR Task Ingestion**: Photo inspection parsing infrastructure failure pictures into actionable tasks.
- **Spatial-Temporal Duplicate Prevention**: Checks proximity window ($\Delta d < 50 \text{m}, \Delta t < 15 \text{m}$) before creating duplicate task entries.
- **Executive Summaries**: AI incident summary generation.

### 3. Tactical Manager Dashboard (`apps/web/`)
- Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Zustand**.
- Live Map view with venue geofences, real-time worker telemetry pins, and emergency SOS alerts.
- Drag-and-drop operations Kanban board.

### 4. Offline-First Worker App (`apps/mobile/`)
- Built with **React Native / Expo**.
- Single-tap high-contrast emergency UI.
- Background location service sync, before/after photo verification, and SOS broadcast button.

---

## 🚀 Quickstart & Local Deployment

### Prerequisites
- Docker & Docker Compose
- Python 3.11+
- Node.js 18+

### 1. Start Infrastructure & Backend Containers
```bash
cd infra
docker-compose up -d --build
```
This boots:
- PostgreSQL 15 with PostGIS on port `5432`
- Redis on port `6379`
- FastAPI Backend on port `8000`
- Nginx Proxy on port `80`
- Prometheus on port `9090`

### 2. Run Backend Unit Tests
```bash
cd apps/backend
pip install -r requirements.txt
pytest tests/
```

### 3. Launch Web Dashboard
```bash
cd apps/web
npm install
npm run dev
```
Open `http://localhost:3000` to interact with the command dashboard.
