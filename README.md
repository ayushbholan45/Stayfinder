

> A full-stack property rental platform — find and host unique stays around the world.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Django](https://img.shields.io/badge/Django-4.x-092E20?style=flat-square&logo=django)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)
![WebSockets](https://img.shields.io/badge/WebSockets-Real--time-010101?style=flat-square)

---

##  Table of Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)

---

##  Overview

StayFinder is an Airbnb-inspired property rental ecosystem built with a **Next.js** frontend and a **Django REST Framework** backend. It supports real-time guest-host messaging, AI-generated property descriptions, advanced multi-criteria search, full booking management, and a guest review system — all containerized with Docker.

---

## Screenshots

###  Homepage — Property Listings
![Homepage] <img width="3360" height="3232" alt="image" src="https://github.com/user-attachments/assets/6017c2b0-6cb1-4239-95f7-152d9a173264" />

> Browse properties across the globe with category filters (Beach, Villas, Cabins, Tiny Homes) and a responsive listings grid showing price per night.

---

### 🏡 Property Detail Page
![Property Detail] <img width="3360" height="4018" alt="image" src="https://github.com/user-attachments/assets/75f0cb1e-ddf1-4976-b4fd-458b33b60ed1" />

> Full property view with hero image, host info, AI-generated description, interactive booking calendar, guest selector, fee breakdown, and a complete review system.

---

### Advanced Search — Location
![Search Location] <img width="3360" height="3232" alt="image" src="https://github.com/user-attachments/assets/721c9c77-eeb1-48e9-a641-5dac94dd6706" />  

> Step 1 of the guided search modal — enter your desired destination.

### Advanced Search — Date Picker 
![Search Dates] <img width="3360" height="3232" alt="image" src="https://github.com/user-attachments/assets/c86dbf60-7883-4bd1-8961-3e903237bf9b" /> <img width="3360" height="3232" alt="image" src="https://github.com/user-attachments/assets/3a873500-5ef4-4655-83c7-c875f89d6901" />
> Step 2 — interactive calendar for selecting check-in and check-out dates.

### Advanced Search — Guest & Room Details
![Search Details] <img width="3360" height="3232" alt="image" src="https://github.com/user-attachments/assets/41fd0148-447b-45c0-8315-4cf7fb64a532" />
> Step 3 — specify number of guests, bedrooms, and bathrooms to narrow results precisely.

---

### AI Description Generator
![AI Description] <img width="3360" height="3232" alt="image" src="https://github.com/user-attachments/assets/f9d5d6d9-c023-4c96-b301-877d42117061" />

> One click on **✦ Generate with AI** produces a professional property description based on your listing metadata — title, location, capacity, and price. Fully editable before publishing.

---

### Real-Time Messaging
![Chat] <img width="1678" height="963" alt="inbox messages" src="https://github.com/user-attachments/assets/423ef53d-f070-4841-8dbd-9fbbf656d959" />

> WebSocket-powered instant messaging between guests and hosts, scoped per property and per user pair. Messages appear live without any page refresh.

---

### Reservations Dashboard
![Reservations] <img width="3360" height="2746" alt="image" src="https://github.com/user-attachments/assets/f7a0e068-c51e-460f-9e83-5a0782ad387f" /> <img width="3360" height="2470" alt="image" src="https://github.com/user-attachments/assets/7faeff9c-7a5e-4e13-888e-a8e52cd6cf6f" /> 


> Guest-facing profile with upcoming trips, past trips, booking details, cancel booking, message host, and a "Book again" shortcut for returning guests.

---

## Features
Property & Search
Dynamic Listings: Category-based filtering (Beach, Villas, Tiny Homes) with persistent favorites.

Multi-Step Search: Guided modal for location, interactive date picking, and guest requirements.

Property Details: Comprehensive views for availability, host profiles, and reviews.

AI & Real-Time Tech
AI Descriptions: One-click LLM generation of listing descriptions from metadata.

Instant Messaging: Real-time, WebSocket-based chat between guests and hosts.

User & Host Management
Dual Dashboards: Centralized views for managing reservations, hosted properties, and favorites.

Seamless Auth: Modal-based login/signup and instant guest-to-host role switching.

Reviews & Ratings: Interactive star-rating system with text feedback for all properties.
---

---

## Technical Challenges

<details>
<summary><b>Click to view Technical Learnings & Solutions</b></summary>

* **WebSocket Synchronization:** Solved state management hurdles to ensure messages deliver instantly without page refreshes or duplicate entries.
* **Containerized Orchestration:** Configured Docker Compose networking to allow seamless communication between the Next.js frontend, Django API, Redis, and PostgreSQL.
</details>

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | Django 4, Django REST Framework |
| Database | PostgreSQL 15 |
| Real-time | Django Channels + WebSockets |
| AI Integration | OpenAI API |
| Auth | JWT (via DRF SimpleJWT) |
| Containerization | Docker, Docker Compose |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway / Render |

---

##  Project Structure

```
stayfinder/
├── frontend/                
│   ├── app/                 # Page routing & Next.js Server Components
│   ├── components/          # Modular UI (Modals, Navigation, Listings)
│   ├── hooks/               # Custom React hooks for WebSockets & state
│   └── lib/                 # Fetch API configurations & global constants
│
├── backend/                 
│   ├── property/            # Listings, Categories, Reviews, & Favorites
│   ├── bookings/            # Reservation management & logic
│   ├── chat/                # Real-time WebSocket Consumers & Models
│   ├── useraccount/         # Custom User Model & JWT Authentication
│   └── requirements.txt     # Python dependencies
│
├── docker-compose.yml       # Container orchestration
└── README.md
```

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) 18+
- [Python](https://www.python.org/) 3.11+

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/stayfinder.git
cd stayfinder
```

### 2. Configure Environment Variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 3. Start the Backend with Docker

```bash
docker-compose up --build
```

This starts:
- Django API on `http://localhost:8000`
- PostgreSQL on port `5432`
- Redis on port `6379` (WebSocket channel layer)

### 4. Run Database Migrations

```bash
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
```

### 5. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

---

## Environment Variables

### Backend (`backend/.env`)

```env
DEBUG=True
SECRET_KEY=your-django-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://postgres:password@db:5432/stayfinder

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# AI
OPENAI_API_KEY=your-openai-api-key

# Redis (WebSockets)
REDIS_URL=redis://redis:6379
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register/` | Register a new user |
| `POST` | `/api/auth/login/` | Login and receive JWT tokens |
| `GET` | `/api/properties/` | List all properties (supports filters) |
| `POST` | `/api/properties/` | Create a new property listing |
| `GET` | `/api/properties/:id/` | Get property detail |
| `POST` | `/api/properties/:id/book/` | Book a property |
| `GET` | `/api/bookings/` | List current user's bookings |
| `DELETE` | `/api/bookings/:id/` | Cancel a booking |
| `POST` | `/api/properties/generate-description/` | AI description generation |
| `GET` | `/api/properties/:id/reviews/` | Get reviews for a property |
| `POST` | `/api/properties/:id/reviews/` | Submit a review |
| `GET` | `/api/chat/:id/` | Get conversation messages |
| `WS` | `ws://host/ws/chat/:id/` | WebSocket chat connection |

---

## Deployment

### Frontend → Vercel

1. Push your repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Set the root directory to `frontend/`
4. Add environment variables in the Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NEXT_PUBLIC_WS_URL=wss://your-backend.railway.app
   ```
5. Deploy — Vercel auto-deploys on every push to `main`

---

### Backend → Railway / Render (Docker)

#### Railway

1. Create a new project on [railway.app](https://railway.app)
2. Add a **PostgreSQL** plugin and a **Redis** plugin
3. Connect your GitHub repo, set root to `backend/`
4. Add your environment variables from `.env`
5. Railway auto-detects the `Dockerfile` and deploys

#### Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Select **Docker** as the environment
3. Set the Dockerfile path to `backend/Dockerfile`
4. Add environment variables
5. Add a **PostgreSQL** database and **Redis** instance from Render's dashboard
6. Deploy

---


