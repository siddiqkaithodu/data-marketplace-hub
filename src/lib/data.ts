import { Dataset, PricingPlan, ApiEndpoint } from '@/types'

export const mockDatasets: Dataset[] = [
  {
    id: '1',
    name: 'Amazon Best Sellers - Electronics',
    platform: 'amazon',
    category: 'Electronics',
    description: 'Comprehensive dataset of top-selling electronics on Amazon, including product details, pricing, ratings, and reviews.',
    recordCount: 15420,
    lastUpdated: '2024-01-15',
    size: '2.3 GB',
    isPremium: false,
    tags: ['electronics', 'bestsellers', 'reviews', 'pricing'],
    previewData: [
      { product_name: 'Wireless Earbuds Pro', price: '$89.99', rating: '4.5', reviews: 12543, category: 'Audio' },
      { product_name: 'Smart Watch Ultra', price: '$299.99', rating: '4.7', reviews: 8921, category: 'Wearables' },
      { product_name: '4K Webcam HD', price: '$129.99', rating: '4.3', reviews: 5632, category: 'Computer Accessories' }
    ]
  },
  {
    id: '2',
    name: 'Shopify Store Analytics',
    platform: 'shopify',
    category: 'E-commerce',
    description: 'Detailed analytics from thousands of Shopify stores including traffic data, conversion rates, and product performance metrics.',
    recordCount: 8750,
    lastUpdated: '2024-01-14',
    size: '1.8 GB',
    isPremium: true,
    tags: ['analytics', 'conversion', 'traffic', 'performance'],
    previewData: [
      { store_name: 'Fashion Hub Store', monthly_visitors: 45230, conversion_rate: '3.2%', avg_order_value: '$67.50', top_product: 'Summer Dress' },
      { store_name: 'Tech Gadgets Plus', monthly_visitors: 89120, conversion_rate: '2.8%', avg_order_value: '$124.30', top_product: 'Phone Case' },
      { store_name: 'Home Decor Central', monthly_visitors: 23450, conversion_rate: '4.1%', avg_order_value: '$89.20', top_product: 'Wall Art' }
    ]
  },
  {
    id: '3',
    name: 'eBay Auction Data - Collectibles',
    platform: 'ebay',
    category: 'Collectibles',
    description: 'Historical auction data for collectible items, including bid patterns, final prices, and seller information.',
    recordCount: 23100,
    lastUpdated: '2024-01-13',
    size: '3.1 GB',
    isPremium: false,
    tags: ['auctions', 'collectibles', 'pricing', 'historical'],
    previewData: [
      { item_name: 'Vintage Baseball Card', starting_bid: '$50.00', final_price: '$347.00', bids: 23, seller_rating: '99.8%' },
      { item_name: 'Rare Comic Book Issue', starting_bid: '$100.00', final_price: '$892.00', bids: 41, seller_rating: '100%' },
      { item_name: 'Antique Watch', starting_bid: '$200.00', final_price: '$1250.00', bids: 18, seller_rating: '98.5%' }
    ]
  },
  {
    id: '4',
    name: 'Walmart Product Catalog',
    platform: 'walmart',
    category: 'General Merchandise',
    description: 'Complete product catalog with SKUs, descriptions, pricing, inventory levels, and customer ratings.',
    recordCount: 42300,
    lastUpdated: '2024-01-15',
    size: '5.2 GB',
    isPremium: true,
    tags: ['catalog', 'inventory', 'pricing', 'ratings'],
    previewData: [
      { sku: 'WM-8472934', product: 'Organic Coffee Beans 2lb', price: '$18.99', stock: 'In Stock', rating: '4.6' },
      { sku: 'WM-2938471', product: 'LED Desk Lamp', price: '$34.99', stock: 'Low Stock', rating: '4.4' },
      { sku: 'WM-7461823', product: 'Yoga Mat Premium', price: '$29.99', stock: 'In Stock', rating: '4.8' }
    ]
  },
  {
    id: '5',
    name: 'Etsy Handmade Trends',
    platform: 'etsy',
    category: 'Handmade',
    description: 'Trending handmade products with seller insights, pricing strategies, and seasonal demand patterns.',
    recordCount: 12890,
    lastUpdated: '2024-01-12',
    size: '1.5 GB',
    isPremium: false,
    tags: ['handmade', 'trends', 'seasonal', 'sellers'],
    previewData: [
      { product: 'Personalized Name Necklace', price: '$45.00', sales_30d: 342, trend: 'Rising', seller_location: 'USA' },
      { product: 'Handwoven Basket', price: '$68.00', sales_30d: 156, trend: 'Stable', seller_location: 'Morocco' },
      { product: 'Custom Pet Portrait', price: '$125.00', sales_30d: 89, trend: 'Rising', seller_location: 'UK' }
    ]
  },
  {
    id: '6',
    name: 'Amazon Fashion & Apparel',
    platform: 'amazon',
    category: 'Fashion',
    description: 'Fashion and apparel data including size charts, color variants, seasonal trends, and customer fit feedback.',
    recordCount: 28640,
    lastUpdated: '2024-01-14',
    size: '3.8 GB',
    isPremium: true,
    tags: ['fashion', 'apparel', 'trends', 'sizing'],
    previewData: [
      { item: 'Cotton T-Shirt Basic', colors: 12, sizes: '8 (XS-XXL)', price_range: '$12.99-$19.99', avg_rating: '4.2' },
      { item: 'Denim Jeans Slim Fit', colors: 5, sizes: '15 (26-40)', price_range: '$39.99-$59.99', avg_rating: '4.5' },
      { item: 'Running Sneakers', colors: 8, sizes: '20 (5-14)', price_range: '$79.99-$129.99', avg_rating: '4.7' }
    ]
  }
]

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'month',
    features: [
      '1,000 API calls/month',
      'Access to public datasets',
      'Basic data previews',
      'Community support',
      '7-day data freshness'
    ],
    apiCalls: 1000,
    datasets: 'Public only',
    support: 'Community'
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    period: 'month',
    features: [
      '50,000 API calls/month',
      'Access to all datasets',
      'Custom URL scraping (10/day)',
      'Email support',
      'Daily data updates',
      'Export to CSV/JSON'
    ],
    apiCalls: 50000,
    datasets: 'All datasets',
    support: 'Email',
    highlighted: false
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 199,
    period: 'month',
    features: [
      '500,000 API calls/month',
      'Priority API access',
      'Custom URL scraping (100/day)',
      'Priority support',
      'Real-time data updates',
      'Advanced filtering',
      'Webhook integrations',
      'Historical data access'
    ],
    apiCalls: 500000,
    datasets: 'All + Historical',
    support: 'Priority',
    highlighted: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    period: 'month',
    features: [
      'Unlimited API calls',
      'Dedicated infrastructure',
      'Custom scraping (unlimited)',
      '24/7 dedicated support',
      'Custom data pipelines',
      'SLA guarantees',
      'On-premise deployment option',
      'White-label API'
    ],
    apiCalls: -1,
    datasets: 'Custom',
    support: 'Dedicated',
    highlighted: false
  }
]

export const apiEndpoints: ApiEndpoint[] = [
  {
    id: 'get-datasets',
    method: 'GET',
    path: '/api/v1/datasets',
    category: 'Datasets',
    description: 'Retrieve a list of all available datasets with filtering options',
    parameters: [
      { name: 'platform', type: 'string', required: false, description: 'Filter by e-commerce platform (amazon, shopify, ebay, walmart, etsy)' },
      { name: 'category', type: 'string', required: false, description: 'Filter by product category' },
      { name: 'limit', type: 'number', required: false, description: 'Maximum number of results (default: 50)' },
      { name: 'offset', type: 'number', required: false, description: 'Pagination offset (default: 0)' }
    ],
    response: '{ "datasets": [...], "total": 123, "page": 1 }',
    example: `curl -X GET "https://api.dataflow.com/v1/datasets?platform=amazon&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
  },
  {
    id: 'get-dataset',
    method: 'GET',
    path: '/api/v1/datasets/{id}',
    category: 'Datasets',
    description: 'Get detailed information about a specific dataset including sample data',
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'Dataset unique identifier' },
      { name: 'preview', type: 'boolean', required: false, description: 'Include preview data (default: true)' }
    ],
    response: '{ "id": "...", "name": "...", "platform": "...", "previewData": [...] }',
    example: `curl -X GET "https://api.dataflow.com/v1/datasets/abc123" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
  },
  {
    id: 'scrape-url',
    method: 'POST',
    path: '/api/v1/scrape',
    category: 'Scraping',
    description: 'Submit a custom URL for scraping from supported e-commerce platforms',
    parameters: [
      { name: 'url', type: 'string', required: true, description: 'Target URL to scrape' },
      { name: 'platform', type: 'string', required: true, description: 'E-commerce platform identifier' },
      { name: 'fields', type: 'array', required: false, description: 'Specific fields to extract' },
      { name: 'webhook', type: 'string', required: false, description: 'Webhook URL for completion notification' }
    ],
    response: '{ "requestId": "...", "status": "processing", "estimatedTime": "30s" }',
    example: `curl -X POST "https://api.dataflow.com/v1/scrape" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://amazon.com/product/...", "platform": "amazon"}'`
  },
  {
    id: 'get-scrape-status',
    method: 'GET',
    path: '/api/v1/scrape/{requestId}',
    category: 'Scraping',
    description: 'Check the status and retrieve results of a scraping request',
    parameters: [
      { name: 'requestId', type: 'string', required: true, description: 'Scraping request ID from POST /scrape' }
    ],
    response: '{ "requestId": "...", "status": "completed", "data": {...}, "recordCount": 1 }',
    example: `curl -X GET "https://api.dataflow.com/v1/scrape/req_abc123" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
  },
  {
    id: 'export-dataset',
    method: 'POST',
    path: '/api/v1/datasets/{id}/export',
    category: 'Export',
    description: 'Export a dataset in your preferred format (CSV, JSON, Parquet)',
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'Dataset unique identifier' },
      { name: 'format', type: 'string', required: true, description: 'Export format: csv, json, or parquet' },
      { name: 'filters', type: 'object', required: false, description: 'Optional filters to apply before export' }
    ],
    response: '{ "exportId": "...", "downloadUrl": "...", "expiresAt": "..." }',
    example: `curl -X POST "https://api.dataflow.com/v1/datasets/abc123/export" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"format": "csv"}'`
  },
  {
    id: 'get-usage',
    method: 'GET',
    path: '/api/v1/account/usage',
    category: 'Account',
    description: 'Get current API usage statistics and remaining quota',
    parameters: [
      { name: 'period', type: 'string', required: false, description: 'Time period: current, last_month, last_year' }
    ],
    response: '{ "apiCalls": 12450, "quota": 50000, "remaining": 37550, "resetDate": "..." }',
    example: `curl -X GET "https://api.dataflow.com/v1/account/usage" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
  }
]
