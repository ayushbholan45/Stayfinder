<img width="1675" height="963" alt="homepage" src="https://github.com/user-attachments/assets/2ec58e57-8f67-44e8-b840-666f030e5342" /># StayFinder

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
- [Roadmap](#-roadmap)

---

##  Overview

StayFinder is an Airbnb-inspired property rental ecosystem built with a **Next.js** frontend and a **Django REST Framework** backend. It supports real-time guest-host messaging, AI-generated property descriptions, advanced multi-criteria search, full booking management, and a guest review system — all containerized with Docker.

---

## Screenshots

###  Homepage — Property Listings
![Homepage]<img width="1675" height="963" alt="homepage" src="https://github.com/user-attachments/assets/a235b69f-50de-43d2-913f-12e3ae6cf1ec" />
> Browse properties across the globe with category filters (Beach, Villas, Cabins, Tiny Homes) and a responsive listings grid showing price per night.

---

### 🏡 Property Detail Page
![Property Detail](./screenshots/screenshot-property-detail.png)
> Full property view with hero image, host info, AI-generated description, interactive booking calendar, guest selector, fee breakdown, and a complete review system.

---

### Advanced Search — Location
![Search Location](./screenshots/screenshot-search-location.png)
> Step 1 of the guided search modal — enter your desired destination.

### Advanced Search — Date Picker
![Search Dates](./screenshots/screenshot-search-dates.png)
> Step 2 — interactive calendar for selecting check-in and check-out dates.

### Advanced Search — Guest & Room Details
![Search Details](./screenshots/screenshot-search-details.png)
> Step 3 — specify number of guests, bedrooms, and bathrooms to narrow results precisely.

---

### AI Description Generator
![AI Description](./screenshots/screenshot-ai-description.png)
> One click on **✦ Generate with AI** produces a professional property description based on your listing metadata — title, location, capacity, and price. Fully editable before publishing.

---

### Real-Time Messaging
![Chat](./screenshots/screenshot-chat.png)
> WebSocket-powered instant messaging between guests and hosts, scoped per property and per user pair. Messages appear live without any page refresh.

---

### Reservations Dashboard
![Reservations](./screenshots/screenshot-reservations.png)
> Guest-facing profile with upcoming trips, past trips, booking details, cancel booking, message host, and a "Book again" shortcut for returning guests.

---

## Features

### Property Ecosystem
- Dynamic property listings with rich media
- Category-based filtering: All, Beach, Villas, Cabins, Tiny Homes
- Favorites system — save and revisit properties across sessions
- Detailed property pages with availability, host info, and reviews

### Advanced Multi-Step Search
- Location search with country/city input
- Interactive date range picker (check-in & check-out calendar)
- Guest count, bedroom count, and bathroom count filters
- Guided multi-step modal UX for a clean search experience

### AI-Powered Descriptions
- One-click AI description generation during property creation
- LLM reads listing metadata: title, location, price, guest capacity, bedrooms, bathrooms
- Output is fully editable before the listing goes live

### Real-Time Messaging
- WebSocket-based instant messaging between guests and hosts
- Conversation threads scoped per property and per user pair
- Live message delivery with no page refresh required

### Reviews & Ratings
- Guests can leave star ratings and written reviews on any property
- Interactive star selector with text review input
- Empty state handling ("No reviews yet. Be the first to review!")
- Reviews displayed per property on the detail page

### User Management
- Login / Signup via modal-based auth flow (no page redirect)
- Personalized profiles with avatar image support and initials fallback
- Hamburger menu with quick access to all user actions
- "Switch to hosting" toggle for dual guest/host roles

### Dashboards
- **My Reservations** — upcoming trips, past trips, cancel booking, message host, book again
- **My Properties** — host view for managing listed properties
- **My Favorites** — saved properties grid

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
├── frontend/                  # Next.js application
│   ├── app/                   # App Router pages
│   │   ├── page.tsx           # Homepage / listings
│   │   ├── properties/        # Property detail pages
│   │   ├── inbox/             # Messaging UI
│   │   └── ...
│   ├── components/            # Reusable UI components
│   │   ├── modals/            # Auth, Search, AddProperty modals
│   │   ├── navbar/            # Top navigation bar
│   │   └── ...
│   └── .env.local             # Frontend environment variables
│
├── backend/                   # Django + DRF application
│   ├── stayfinder/            # Django project settings
│   ├── properties/            # Property CRUD, categories, favorites, reviews
│   ├── bookings/              # Reservation logic
│   ├── chat/                  # WebSocket consumers & routing
│   ├── useraccount/           # Custom user model & auth
│   └── requirements.txt
│
├── docker-compose.yml         # Local development orchestration
├── docker-compose.prod.yml    # Production orchestration
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

## 📡 API Reference

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


