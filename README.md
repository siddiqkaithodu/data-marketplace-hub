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

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## 🔌 Backend API Endpoints (Placeholders)

The following API endpoints need to be implemented for full backend functionality:

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

### Scraping APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/scrape` | Submit a new scraping request |
| `GET` | `/api/v1/scrape/{requestId}` | Get scraping request status |
| `GET` | `/api/v1/scrape/{requestId}/results` | Get scraping results |
| `GET` | `/api/v1/scrape/history` | Get user's scraping history |
| `DELETE` | `/api/v1/scrape/{requestId}` | Cancel pending scraping request |

### Export APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/datasets/{id}/export` | Export dataset in specified format (CSV/JSON/Parquet) |
| `GET` | `/api/v1/exports/{exportId}` | Get export job status |
| `GET` | `/api/v1/exports/{exportId}/download` | Download exported file |

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

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, shadcn/ui
- **Icons**: Phosphor Icons
- **Build Tool**: Vite 7
- **State Management**: React Context, TanStack Query
- **Forms**: React Hook Form, Zod validation

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn)
│   ├── HomePage.tsx    # Dataset marketplace browser
│   ├── ScraperPage.tsx # Custom URL scraper interface
│   ├── ApiDocsPage.tsx # API documentation center
│   ├── PricingPage.tsx # Pricing & plans display
│   ├── AuthDialog.tsx  # Authentication modal
│   └── Navbar.tsx      # Navigation component
├── contexts/           # React context providers
│   └── AuthContext.tsx # Authentication state management
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and data
│   ├── data.ts        # Mock data for datasets, plans, APIs
│   └── utils.ts       # Helper utilities
├── types/              # TypeScript type definitions
│   └── index.ts       # Shared types (User, Dataset, etc.)
└── App.tsx            # Main application component
```

## 🔐 Environment Variables

For backend integration, the following environment variables will be needed:

```env
VITE_API_BASE_URL=https://api.dataflow.com
VITE_API_VERSION=v1
```

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
