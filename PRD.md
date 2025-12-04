# Planning Guide

A comprehensive data marketplace platform that enables users to discover, preview, and access scraped e-commerce datasets through an intuitive interface with custom scraping capabilities and flexible API access.

**Experience Qualities**: 
1. **Professional** - Enterprise-grade interface that conveys trust and reliability for data consumers
2. **Efficient** - Streamlined workflows that let users quickly find, preview, and access the data they need
3. **Transparent** - Clear pricing, API documentation, and data previews that eliminate uncertainty

**Complexity Level**: Complex Application (advanced functionality, accounts)
  - Multi-page application with user authentication, dataset browsing, custom scraping interface, API documentation, and pricing/plan management requiring coordinated state management across features.

## Essential Features

### User Authentication
- **Functionality**: Sign up and sign in system with session management
- **Purpose**: Control access to premium features and API keys
- **Trigger**: Accessing protected routes or clicking Sign In/Sign Up buttons
- **Progression**: Click auth button → Modal opens → Enter credentials → Validation → Success state → Modal closes → User authenticated
- **Success criteria**: Users can create accounts, sign in, and see authenticated state reflected in UI

### Dataset Marketplace Browser
- **Functionality**: Browse and search available pre-scraped datasets organized by e-commerce platform
- **Purpose**: Allow users to discover and preview available data before purchase/access
- **Trigger**: Landing on homepage or clicking "Browse Datasets" navigation
- **Progression**: View dataset grid → Filter by platform/category → Click dataset card → See detailed preview → View sample data → Access/download options
- **Success criteria**: Users can filter, preview, and understand dataset contents without friction

### Custom URL Scraper Interface
- **Functionality**: Submit custom URLs for specific e-commerce platforms to get scraped data
- **Purpose**: Enable on-demand data collection beyond pre-scraped datasets
- **Trigger**: Click "Custom Scraping" in navigation
- **Progression**: Select e-commerce platform → Enter target URL → Configure options → Submit request → See progress → Preview results → Download/API access
- **Success criteria**: Clear workflow from URL submission to data retrieval with visual feedback

### API Documentation Center
- **Functionality**: Comprehensive API reference with endpoints, parameters, and code examples
- **Purpose**: Enable developers to integrate marketplace data into their applications
- **Trigger**: Click "API Docs" in navigation
- **Progression**: View endpoint categories → Select endpoint → See request/response specs → Copy code examples → Test with API key
- **Success criteria**: Developers can understand and implement API calls with provided examples

### Pricing & Plans Page
- **Functionality**: Comparison of subscription tiers with feature breakdown
- **Purpose**: Convert users by clearly showing value at different price points
- **Trigger**: Click "Pricing" in navigation or upgrade prompts
- **Progression**: View plan comparison → Evaluate features → Select plan → Sign in if needed → Confirmation
- **Success criteria**: Clear differentiation between tiers with compelling CTAs

## Edge Case Handling

- **Unauthenticated Access**: Show limited previews and prominent sign-in prompts for protected features
- **Empty Search Results**: Display helpful message with suggestions to modify filters
- **Invalid URL Format**: Real-time validation with clear error messages in custom scraper
- **Missing API Key**: Provide clear instructions to generate key in API docs
- **Plan Limitations**: Show usage warnings and upgrade prompts when approaching limits
- **Network Errors**: Graceful loading states and retry options for failed requests

## Design Direction

The design should evoke a sense of cutting-edge technology meets enterprise reliability - think sophisticated data platform with modern SaaS polish. The interface should feel both powerful (for technical users) and accessible (for business users), using clean layouts, strategic color accents, and micro-interactions that make complex data operations feel effortless.

## Color Selection

A modern, tech-forward palette built around deep teals and electric purples that conveys innovation in data technology, with bright accents for calls-to-action.

- **Primary Color**: Deep teal `oklch(0.45 0.12 200)` - Communicates trust, technology, and data-driven intelligence
- **Secondary Colors**: Dark slate `oklch(0.25 0.02 240)` for depth and grounding, lighter teal `oklch(0.92 0.02 200)` for backgrounds
- **Accent Color**: Electric purple `oklch(0.60 0.22 290)` - High-energy highlight for CTAs and important interactions
- **Foreground/Background Pairings**: 
  - Background (Light teal #EBF5F7 / oklch(0.92 0.02 200)): Dark slate text (#1E2432 / oklch(0.25 0.02 240)) - Ratio 11.2:1 ✓
  - Primary (Deep Teal): White text (#FFFFFF / oklch(1 0 0)) - Ratio 6.8:1 ✓
  - Accent (Electric Purple #A855F7): White text (#FFFFFF / oklch(1 0 0)) - Ratio 5.1:1 ✓
  - Card (White): Dark slate text - Ratio 14.5:1 ✓

## Font Selection

Typography should balance technical precision with modern approachability - a geometric sans-serif that feels both cutting-edge and highly readable for data-heavy interfaces.

- **Primary Font**: Space Grotesk - Modern geometric sans with technical character perfect for a data marketplace
- **Typographic Hierarchy**: 
  - H1 (Page Titles): Space Grotesk Bold/36px/tight (-0.02em)
  - H2 (Section Headers): Space Grotesk SemiBold/28px/tight (-0.01em)
  - H3 (Card Titles): Space Grotesk Medium/20px/normal
  - Body (Main Content): Space Grotesk Regular/16px/relaxed (1.6em line-height)
  - Small (Meta Info): Space Grotesk Regular/14px/normal
  - Code (API Docs): JetBrains Mono Regular/14px/1.5em

## Animations

Animations should emphasize data flow and technological precision - smooth transitions that feel instant while providing clear feedback, with occasional delightful micro-interactions on hover states and data loading sequences. Card reveals use gentle fade-up, navigation is immediate with subtle easing, and data previews expand with purposeful spring physics that never delays user actions.

## Component Selection

- **Components**: 
  - Navigation: Custom navbar with shadcn `Button` components for auth CTAs
  - Dataset Cards: shadcn `Card` with hover lift effect (Tailwind transform/shadow)
  - Authentication: shadcn `Dialog` with `Form`, `Input`, `Label` for modals
  - Data Tables: shadcn `Table` for dataset previews with custom header styling
  - Pricing: Custom cards using shadcn `Card` with shadcn `Button` CTAs and `Badge` for highlights
  - API Docs: shadcn `Tabs` for endpoint categories, custom code blocks with copy buttons
  - Filters: shadcn `Select`, `Checkbox` for dataset filtering
  - Scraper Form: shadcn `Form`, `Input`, `Select`, `Button` with validation
  - Toast Notifications: shadcn `sonner` for success/error feedback
  
- **Customizations**: 
  - Gradient overlays on dataset category cards using CSS
  - Custom data table with sticky headers and alternating row colors
  - API code block component with syntax highlighting simulation and copy functionality
  - Progress indicator for scraping simulation with animated gradient
  
- **States**: 
  - Buttons: Hover grows scale slightly (1.02) with shadow increase, active shows quick press effect
  - Cards: Hover lifts with shadow (translateY -4px), border glow on focus
  - Inputs: Focus shows accent ring with subtle scale, error state shows destructive border
  - Navigation: Active page shows accent underline, hover shows muted background
  
- **Icon Selection**: 
  - Database/Dataset: `Database` icon
  - Custom Scraping: `Lightning` icon  
  - API: `Code` icon
  - Authentication: `User`, `UserPlus`
  - Download: `Download` or `ArrowDown`
  - Search/Filter: `MagnifyingGlass`, `Funnel`
  - Success: `Check`, `CheckCircle`
  - Settings: `Gear`
  - Pricing: `CurrencyDollar`
  
- **Spacing**: 
  - Page containers: `px-6 md:px-12 py-8`
  - Section gaps: `space-y-12`
  - Card padding: `p-6`
  - Grid gaps: `gap-6`
  - Button padding: `px-6 py-3`
  
- **Mobile**: 
  - Navigation collapses to hamburger menu at `<768px` with slide-in drawer (shadcn `Sheet`)
  - Dataset grid: 1 column mobile → 2 tablet → 3 desktop (Tailwind responsive grid)
  - Pricing cards stack vertically on mobile with full width
  - API docs tabs become accordion-style dropdown on small screens
  - Form inputs maintain full width with adjusted padding for touch targets
