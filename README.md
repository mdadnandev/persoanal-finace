# 💰 FinTrack — Personal Finance Tracker

A full-stack Personal Finance Tracker web application built with **Spring Boot 3**, **PostgreSQL**, **React 18**, **Tailwind CSS**, and **Recharts**.

---

## 🌟 Features

- 🔐 **Secure Authentication**: JWT-based user registration and login with BCrypt password encryption.
- 📊 **Dynamic Dashboard**:
  - Total Income, Total Expenses, and Net Balance stat cards.
  - Interactive Income vs Expense Trends chart (Area / Bar charts).
  - Expense Breakdown by Category (Donut chart).
  - Recent transactions list with quick action modals.
- 💳 **Transaction Management**:
  - Add, edit, and delete Income and Expense transactions.
  - Filter transactions by type, category, date range, and search.
  - Server-side pagination.
  - **One-click CSV Export** of all transaction records.
- 🏷️ **Category Management**:
  - 15 auto-seeded default categories with customizable icons & colors.
  - Create and manage custom categories.
- 📈 **Visual Analytics**:
  - Spending trends over time (switchable between Bar and Line charts).
  - Income and Expense category distributions.
  - Automatic savings rate calculation.
- 🎨 **Modern Dark UI**:
  - Sleek glassmorphism aesthetic with tailored Slate & Indigo palettes.
  - Fully responsive for mobile, tablet, and desktop screens.
  - Toast feedback for all user actions.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 18, Vite | Single-page application |
| **Styling** | Tailwind CSS | Custom dark mode glassmorphism design |
| **Icons & Charts** | Lucide React, Recharts | Interactive visualizations and icon system |
| **Backend** | Java 17+, Spring Boot 3.2 | RESTful API with JPA & Spring Security |
| **Security** | JJWT (io.jsonwebtoken) | Stateless JWT Bearer token authentication |
| **Database** | PostgreSQL | Relational storage for users, categories & transactions |
| **CSV Export** | OpenCSV | Formatted transaction report generation |

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- **PostgreSQL** running on `localhost:5432` with database `finance_tracker`
- **Node.js** (v18+) and **npm**
- **Java** (JDK 17+) and **Maven**

### 1. One-Click Launch (Windows)
Double-click:
```bash
run-all.bat
```
This starts both the Spring Boot backend (`http://localhost:8080`) and Vite frontend (`http://localhost:3000`) in separate windows.

### 2. Manual Start

#### Backend (`/server`):
```bash
cd server
# Ensure PostgreSQL is running and DB 'finance_tracker' exists
mvn spring-boot:run
# Server runs on http://localhost:8080
```

#### Frontend (`/client`):
```bash
cd client
npm install
npm run dev
# Web app runs on http://localhost:3000
```

---

## 🔌 API Endpoints Summary

### Auth (`/api/auth`)
- `POST /api/auth/register` — Register new user & seed default categories
- `POST /api/auth/login` — Authenticate and receive JWT token
- `GET /api/auth/me` — Get current user profile *(Protected)*

### Transactions (`/api/transactions`)
- `GET /api/transactions` — Get paginated transactions (supports filters: `type`, `categoryId`, `startDate`, `endDate`, `page`, `size`)
- `POST /api/transactions` — Create a new transaction
- `GET /api/transactions/{id}` — Get transaction details
- `PUT /api/transactions/{id}` — Update existing transaction
- `DELETE /api/transactions/{id}` — Delete transaction
- `GET /api/transactions/export/csv` — Download CSV report

### Categories (`/api/categories`)
- `GET /api/categories` — Get user categories + default categories
- `POST /api/categories` — Create custom category
- `DELETE /api/categories/{id}` — Delete custom category

### Dashboard & Analytics (`/api/dashboard`)
- `GET /api/dashboard?year=YYYY` — Dashboard stats, monthly trends, and category distribution

---

## 🌐 Deployment Guide

### Frontend Deployment (Vercel)
1. Push your code to GitHub.
2. In [Vercel](https://vercel.com), click **Add New Project** and select your repository.
3. Configure the Root Directory to `client`.
4. Add environment variable:
   - `VITE_API_URL`: `https://<your-backend-url>/api`
5. Click **Deploy**. (The included `client/vercel.json` ensures client-side routing works on refresh).

### Backend Deployment (Render or Railway)

#### Deploying on Render:
1. Create a **PostgreSQL Database** on Render (free tier).
2. Copy the **External Connection String**.
3. Create a new **Web Service** on Render, choose your repository, and set Root Directory to `server`.
4. Select **Docker** environment (the included `server/Dockerfile` will build and containerize the app).
5. Set the Environment Variables:
   - `DB_URL`: `jdbc:postgresql://<render-db-host>:5432/<dbname>`
   - `DB_USERNAME`: `<db-user>`
   - `DB_PASSWORD`: `<db-password>`
   - `app.jwt.secret`: `<your-secure-random-secret-key>`
   - `app.cors.allowed-origins`: `https://<your-vercel-domain>.vercel.app`
6. Click **Create Web Service**.

#### Deploying on Railway:
1. Create a project in [Railway](https://railway.app).
2. Add a **PostgreSQL** database service.
3. Add a service from GitHub repo pointing to `/server`.
4. Reference the PostgreSQL connection variables (`${{Postgres.DATABASE_URL}}`).
5. Deploy!
