import { useState } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { Navbar } from '@/components/Navbar'
import { HomePage } from '@/components/HomePage'
import { ScraperPage } from '@/components/ScraperPage'
import { ApiDocsPage } from '@/components/ApiDocsPage'
import { PricingPage } from '@/components/PricingPage'
import { AuthDialog } from '@/components/AuthDialog'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setAuthDialogOpen(true)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'scraper':
        return <ScraperPage />
      case 'api':
        return <ApiDocsPage />
      case 'pricing':
        return <PricingPage onAuthClick={handleAuthClick} />
      default:
        return <HomePage />
    }
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Navbar 
          currentPage={currentPage} 
          onNavigate={setCurrentPage}
          onAuthClick={handleAuthClick}
        />
        {renderPage()}
        <AuthDialog 
          open={authDialogOpen} 
          onOpenChange={setAuthDialogOpen}
          mode={authMode}
        />
        <Toaster />
      </div>
    </AuthProvider>
  )
}

export default App
