# 📊 DataFlow - Data Marketplace Hub

A comprehensive data marketplace platform that enables users to discover, preview, and access scraped e-commerce datasets through an intuitive interface with custom scraping capabilities and flexible API access.

## ✨ Features

### 🏠 Dataset Marketplace Browser
Browse and search available pre-scraped datasets organized by e-commerce platform (Amazon, Shopify, eBay, Walmart, Etsy). Users can filter, preview sample data, and access/download datasets.

### ⚡ Custom URL Scraper
Submit custom URLs from supported e-commerce platforms to get scraped data on-demand. Track scraping progress in real-time and download results when complete.

### 📚 API Documentation Center
Comprehensive API reference with endpoints, parameters, code examples, and response formats. Includes API key management for authenticated users.

### 💳 Pricing & Plans
Flexible subscription tiers (Free, Starter, Professional, Enterprise) with clear feature breakdowns and upgrade paths.

### 🔐 User Authentication
Secure sign up/sign in system with session management for accessing protected features and API keys.

## 🐳 Docker Setup (Recommended)

The application is fully containerized with Docker, including the FastAPI backend and PostgreSQL database.

### Prerequisites
- Docker and Docker Compose

### Quick Start

```bash
# Start all services (database, backend, frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 5173 | React application |
| Backend | 8000 | FastAPI REST API |
| Database | 5432 | PostgreSQL database |

### Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/v1/docs
- **ReDoc**: http://localhost:8000/api/v1/redoc

## 🚀 Local Development (Without Docker)

### Prerequisites
- Node.js 18+
- Python 3.12+
- PostgreSQL 16+

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL=postgresql://dataflow:dataflow@localhost:5432/dataflow
export SECRET_KEY=your-super-secret-key

# Start the server
uvicorn app.main:app --reload --port 8000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend development server |
| `npm run build` | Build frontend for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, shadcn/ui
- **Icons**: Phosphor Icons
- **Build Tool**: Vite 7
- **State Management**: React Context, TanStack Query
- **Forms**: React Hook Form, Zod validation

### Backend
- **Framework**: FastAPI (Python 3.12)
- **ORM**: SQLModel
- **Database**: PostgreSQL 16
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt (passlib)

## 🔌 Backend API Endpoints

All API endpoints are implemented in the FastAPI backend:

### Authentication APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/signup` | Register a new user account |
| `POST` | `/api/v1/auth/signin` | Authenticate user and return JWT token |
| `POST` | `/api/v1/auth/signout` | Invalidate user session |
| `GET` | `/api/v1/auth/me` | Get current authenticated user details |
| `POST` | `/api/v1/auth/refresh` | Refresh authentication token |
| `POST` | `/api/v1/auth/reset-password` | Request password reset |

### Dataset APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/datasets` | List all available datasets with filtering |
| `GET` | `/api/v1/datasets/{id}` | Get detailed dataset information |
| `GET` | `/api/v1/datasets/{id}/preview` | Get sample preview data |
| `POST` | `/api/v1/datasets/{id}/download` | Generate download link for dataset |
| `GET` | `/api/v1/datasets/search` | Search datasets by keyword/tags |
| `POST` | `/api/v1/datasets/{id}/export` | Export dataset in specified format |

### Scraping APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/scrape` | Submit a new scraping request |
| `GET` | `/api/v1/scrape/{requestId}` | Get scraping request status |
| `GET` | `/api/v1/scrape/{requestId}/results` | Get scraping results |
| `GET` | `/api/v1/scrape/history` | Get user's scraping history |
| `DELETE` | `/api/v1/scrape/{requestId}` | Cancel pending scraping request |

### Account & Billing APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/account` | Get account details |
| `PUT` | `/api/v1/account` | Update account information |
| `GET` | `/api/v1/account/usage` | Get API usage statistics |
| `GET` | `/api/v1/account/api-key` | Get current API key |
| `POST` | `/api/v1/account/api-key/regenerate` | Generate new API key |
| `GET` | `/api/v1/billing/plans` | List available subscription plans |
| `POST` | `/api/v1/billing/subscribe` | Subscribe to a plan |
| `PUT` | `/api/v1/billing/subscription` | Update subscription |
| `DELETE` | `/api/v1/billing/subscription` | Cancel subscription |
| `GET` | `/api/v1/billing/invoices` | Get billing history |

### Webhook APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/webhooks` | Register a new webhook |
| `GET` | `/api/v1/webhooks` | List registered webhooks |
| `DELETE` | `/api/v1/webhooks/{id}` | Delete a webhook |

## 📁 Project Structure

```
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API route handlers
│   │   │   ├── auth.py     # Authentication endpoints
│   │   │   ├── datasets.py # Dataset endpoints
│   │   │   ├── scrape.py   # Scraping endpoints
│   │   │   ├── account.py  # Account & billing endpoints
│   │   │   └── webhooks.py # Webhook endpoints
│   │   ├── core/           # Core configuration
│   │   │   ├── config.py   # Settings management
│   │   │   ├── database.py # Database connection
│   │   │   └── security.py # Authentication utilities
│   │   ├── models/         # SQLModel database models
│   │   │   ├── user.py
│   │   │   ├── dataset.py
│   │   │   ├── scrape_request.py
│   │   │   └── pricing_plan.py
│   │   ├── schemas/        # Pydantic schemas
│   │   └── main.py         # FastAPI application
│   ├── requirements.txt
│   └── Dockerfile
├── src/                     # React frontend
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── HomePage.tsx
│   │   ├── ScraperPage.tsx
│   │   ├── ApiDocsPage.tsx
│   │   ├── PricingPage.tsx
│   │   ├── AuthDialog.tsx
│   │   └── Navbar.tsx
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── types/              # TypeScript definitions
│   └── App.tsx
├── docker-compose.yml       # Docker orchestration
├── Dockerfile              # Frontend container
└── package.json
```

## 🔐 Environment Variables

### Backend Configuration

Create a `.env` file in the project root (see `.env.example` for reference):

```env
# Database Configuration
POSTGRES_USER=dataflow
POSTGRES_PASSWORD=your-secure-database-password
POSTGRES_DB=dataflow

# JWT Secret Key - Generate with: python -c "import secrets; print(secrets.token_urlsafe(32))"
SECRET_KEY=your-super-secret-key-change-in-production

# Debug mode - set to true to enable SQL logging
DEBUG=false

# CORS Origins - comma-separated list of allowed origins
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:5000,http://localhost:3000
```

**Note**: The `BACKEND_CORS_ORIGINS` accepts either:
- A comma-separated string of allowed origins (recommended for environment variables): `"http://localhost:5173,http://localhost:3000"`
- A list of strings (for programmatic configuration): `["http://localhost:5173", "http://localhost:3000"]`

The validator automatically normalizes the input by stripping whitespace and filtering empty values.

### Frontend Configuration

```env
VITE_API_BASE_URL=http://localhost:8000
```

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
