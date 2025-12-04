export interface User {
  id: string
  email: string
  name: string
  plan: 'free' | 'starter' | 'professional' | 'enterprise'
  apiKey?: string
  createdAt: string
}

export interface Dataset {
  id: string
  name: string
  platform: 'amazon' | 'shopify' | 'ebay' | 'walmart' | 'etsy'
  category: string
  description: string
  recordCount: number
  lastUpdated: string
  size: string
  previewData: Record<string, any>[]
  isPremium: boolean
  tags: string[]
}

export interface ScrapeRequest {
  id: string
  url: string
  platform: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  resultCount?: number
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  period: 'month' | 'year'
  features: string[]
  apiCalls: number
  datasets: string
  support: string
  highlighted?: boolean
}

export interface ApiEndpoint {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  category: string
  description: string
  parameters: {
    name: string
    type: string
    required: boolean
    description: string
  }[]
  response: string
  example: string
}
