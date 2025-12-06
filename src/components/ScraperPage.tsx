import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Lightning, CheckCircle, WarningCircle, Clock } from '@phosphor-icons/react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { ScrapeRequest } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import * as api from '@/lib/api'

export function ScraperPage() {
  const { isAuthenticated, user } = useAuth()
  const [url, setUrl] = useState('')
  const [platform, setPlatform] = useState('')
  const [processing, setProcessing] = useState(false)
  const [scrapeRequests, setScrapeRequests] = useState<ScrapeRequest[]>([])
  const [progress, setProgress] = useState(0)

  // Fetch scrape history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      if (!isAuthenticated) return
      try {
        const response = await api.getScrapeHistory()
        const transformedRequests: ScrapeRequest[] = response.requests.map(r => ({
          id: r.request_id,
          url: r.url,
          platform: r.platform,
          status: r.status,
          createdAt: r.created_at,
          completedAt: r.completed_at,
          resultCount: r.result_count
        }))
        setScrapeRequests(transformedRequests)
      } catch (error) {
        // API unavailable - scrape history will load when user makes new requests
        console.info('Scrape history unavailable:', error instanceof Error ? error.message : 'backend not connected')
      }
    }
    fetchHistory()
  }, [isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast.error('Please sign in to use custom scraping')
      return
    }

    if (user?.plan === 'free') {
      toast.error('Custom scraping is available for paid plans only')
      return
    }

    setProcessing(true)
    setProgress(0)

    try {
      // Submit to real API
      const response = await api.submitScrapeRequest({ url, platform })
      
      const newRequest: ScrapeRequest = {
        id: response.request_id,
        url,
        platform,
        status: response.status,
        createdAt: new Date().toISOString()
      }

      setScrapeRequests((current) => [newRequest, ...current])

      // Poll for status updates with retry limit
      let retryCount = 0
      const maxRetries = 10
      
      const pollStatus = async () => {
        try {
          const status = await api.getScrapeStatus(response.request_id)
          
          setScrapeRequests((current) =>
            current.map((req) =>
              req.id === response.request_id
                ? {
                    ...req,
                    status: status.status,
                    resultCount: status.record_count,
                    completedAt: status.status === 'completed' ? new Date().toISOString() : undefined
                  }
                : req
            )
          )

          if (status.status === 'processing') {
            setProgress((prev) => Math.min(prev + 15, 90))
            setTimeout(pollStatus, 1500)
          } else if (status.status === 'completed') {
            setProgress(100)
            setProcessing(false)
            setUrl('')
            toast.success('Scraping completed successfully!')
          } else if (status.status === 'failed') {
            setProcessing(false)
            toast.error(status.error_message || 'Scraping failed')
          }
        } catch (error) {
          // Log polling error and retry with limit
          console.warn('Status poll failed:', error instanceof Error ? error.message : 'unknown error')
          retryCount++
          if (retryCount < maxRetries) {
            setTimeout(pollStatus, 3000) // Increased delay on error
          } else {
            setProcessing(false)
            toast.error('Failed to get scrape status. Please check your scrape history.')
          }
        }
      }

      // Start polling after a short delay
      setTimeout(pollStatus, 1000)
      setProgress(10)

    } catch (error) {
      setProcessing(false)
      toast.error(error instanceof Error ? error.message : 'Failed to submit scraping request')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="text-green-600" weight="fill" />
      case 'processing':
        return <Clock size={20} className="text-blue-600" weight="fill" />
      case 'failed':
        return <WarningCircle size={20} className="text-red-600" weight="fill" />
      default:
        return <Clock size={20} className="text-yellow-600" weight="fill" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'processing':
        return 'bg-blue-100 text-blue-700'
      case 'failed':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 md:px-12 py-12">
        <div className="mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary">
              <Lightning className="text-white" size={24} weight="fill" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Custom URL Scraping</h1>
              <p className="text-muted-foreground">Extract data from any supported e-commerce URL</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Submit Scraping Request</CardTitle>
              <CardDescription>
                Enter a product or category URL from a supported platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">E-commerce Platform</Label>
                  <Select value={platform} onValueChange={setPlatform} required disabled={processing}>
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amazon">Amazon</SelectItem>
                      <SelectItem value="shopify">Shopify</SelectItem>
                      <SelectItem value="ebay">eBay</SelectItem>
                      <SelectItem value="walmart">Walmart</SelectItem>
                      <SelectItem value="etsy">Etsy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Target URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://www.amazon.com/product/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    disabled={processing}
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste the full URL of the product, category, or search results page
                  </p>
                </div>

                {processing && (
                  <div className="space-y-2 rounded-lg bg-muted p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Processing request...</span>
                      <span className="text-muted-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full gap-2 bg-accent hover:bg-accent/90"
                  disabled={processing || !isAuthenticated}
                >
                  <Lightning size={18} weight="fill" />
                  {processing ? 'Scraping...' : 'Start Scraping'}
                </Button>

                {!isAuthenticated && (
                  <p className="text-sm text-center text-muted-foreground">
                    Please sign in to use custom scraping
                  </p>
                )}
                {isAuthenticated && user?.plan === 'free' && (
                  <p className="text-sm text-center text-muted-foreground">
                    Upgrade to a paid plan to access custom scraping
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Requests</h2>
              <Badge variant="secondary">{scrapeRequests.length} total</Badge>
            </div>

            {scrapeRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Lightning size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No scraping requests yet. Submit your first URL above!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {scrapeRequests.slice(0, 10).map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getStatusIcon(request.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {request.platform}
                            </Badge>
                            <Badge className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium truncate mb-1">{request.url}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{new Date(request.createdAt).toLocaleString()}</span>
                            {request.resultCount && (
                              <span>{request.resultCount} records</span>
                            )}
                          </div>
                        </div>
                        {request.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toast.success('Download started')}
                          >
                            Download
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <Card className="mt-8 border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">How Custom Scraping Works</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span>Select the e-commerce platform and paste any product or category URL</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span>Our system extracts structured data including prices, ratings, descriptions, and more</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span>Results are typically ready within 30-60 seconds and available via API or download</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span>Daily limits vary by plan: Starter (10), Professional (100), Enterprise (unlimited)</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
