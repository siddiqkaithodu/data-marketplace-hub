import { Database, Lightning, Code, CurrencyDollar, User, List } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'

interface NavbarProps {
  currentPage: string
  onNavigate: (page: string) => void
  onAuthClick: (mode: 'signin' | 'signup') => void
}

export function Navbar({ currentPage, onNavigate, onAuthClick }: NavbarProps) {
  const { isAuthenticated, signOut, user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { id: 'home', label: 'Datasets', icon: Database },
    { id: 'scraper', label: 'Custom Scraping', icon: Lightning },
    { id: 'api', label: 'API Docs', icon: Code },
    { id: 'pricing', label: 'Pricing', icon: CurrencyDollar }
  ]

  const handleNavigate = (page: string) => {
    onNavigate(page)
    setMobileOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-2 transition-transform hover:scale-105"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Database className="text-white" size={20} weight="bold" />
              </div>
              <span className="text-xl font-bold tracking-tight">DataFlow</span>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      currentPage === item.id
                        ? 'bg-secondary text-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2">
                  <User size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <Button onClick={signOut} variant="outline" size="sm">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => onAuthClick('signin')} variant="outline" size="sm">
                  Sign In
                </Button>
                <Button onClick={() => onAuthClick('signup')} size="sm" className="bg-accent hover:bg-accent/90">
                  Get Started
                </Button>
              </>
            )}
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="sm">
                <List size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-6 pt-8">
                <div className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                          currentPage === item.id
                            ? 'bg-secondary text-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <Icon size={20} />
                        {item.label}
                      </button>
                    )
                  })}
                </div>

                <div className="border-t border-border pt-6">
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-3">
                        <User size={16} className="text-muted-foreground" />
                        <span className="text-sm font-medium">{user?.name}</span>
                      </div>
                      <Button onClick={signOut} variant="outline" className="w-full">
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button onClick={() => { onAuthClick('signin'); setMobileOpen(false) }} variant="outline" className="w-full">
                        Sign In
                      </Button>
                      <Button onClick={() => { onAuthClick('signup'); setMobileOpen(false) }} className="w-full bg-accent hover:bg-accent/90">
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
