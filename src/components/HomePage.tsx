import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Database, Download, Eye, MagnifyingGlass, Lock } from '@phosphor-icons/react'
import { mockDatasets } from '@/lib/data'
import { Dataset } from '@/types'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)
  const { isAuthenticated, user } = useAuth()

  const filteredDatasets = mockDatasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform = platformFilter === 'all' || dataset.platform === platformFilter
    return matchesSearch && matchesPlatform
  })

  const handleDownload = (dataset: Dataset) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to download datasets')
      return
    }
    if (dataset.isPremium && user?.plan === 'free') {
      toast.error('This is a premium dataset. Please upgrade your plan.')
      return
    }
    toast.success(`Downloading ${dataset.name}...`)
  }

  const platformColors: Record<string, string> = {
    amazon: 'bg-orange-100 text-orange-700',
    shopify: 'bg-green-100 text-green-700',
    ebay: 'bg-blue-100 text-blue-700',
    walmart: 'bg-yellow-100 text-yellow-700',
    etsy: 'bg-pink-100 text-pink-700'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 md:px-12 py-12">
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Discover Premium Datasets
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Access high-quality scraped data from major e-commerce platforms. Ready to use, regularly updated, and available via API.
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search datasets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="amazon">Amazon</SelectItem>
              <SelectItem value="shopify">Shopify</SelectItem>
              <SelectItem value="ebay">eBay</SelectItem>
              <SelectItem value="walmart">Walmart</SelectItem>
              <SelectItem value="etsy">Etsy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredDatasets.length === 0 ? (
          <div className="text-center py-16">
            <Database className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="text-xl font-semibold mb-2">No datasets found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDatasets.map((dataset) => (
              <Card 
                key={dataset.id} 
                className="group transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedDataset(dataset)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge className={platformColors[dataset.platform]}>
                      {dataset.platform}
                    </Badge>
                    {dataset.isPremium && (
                      <Badge variant="outline" className="gap-1">
                        <Lock size={12} />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                    {dataset.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {dataset.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Records</div>
                      <div className="font-semibold">{dataset.recordCount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Size</div>
                      <div className="font-semibold">{dataset.size}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Updated</div>
                      <div className="font-semibold">{dataset.lastUpdated}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Category</div>
                      <div className="font-semibold">{dataset.category}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedDataset(dataset)
                    }}
                  >
                    <Eye size={16} />
                    Preview
                  </Button>
                  <Button 
                    className="flex-1 gap-2 bg-accent hover:bg-accent/90"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload(dataset)
                    }}
                  >
                    <Download size={16} />
                    Access
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={selectedDataset !== null} onOpenChange={() => setSelectedDataset(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedDataset && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={platformColors[selectedDataset.platform]}>
                    {selectedDataset.platform}
                  </Badge>
                  {selectedDataset.isPremium && (
                    <Badge variant="outline" className="gap-1">
                      <Lock size={12} />
                      Premium
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-2xl">{selectedDataset.name}</DialogTitle>
                <DialogDescription>{selectedDataset.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-lg bg-secondary p-4">
                    <div className="text-sm text-muted-foreground">Records</div>
                    <div className="text-2xl font-bold">{selectedDataset.recordCount.toLocaleString()}</div>
                  </div>
                  <div className="rounded-lg bg-secondary p-4">
                    <div className="text-sm text-muted-foreground">Size</div>
                    <div className="text-2xl font-bold">{selectedDataset.size}</div>
                  </div>
                  <div className="rounded-lg bg-secondary p-4">
                    <div className="text-sm text-muted-foreground">Category</div>
                    <div className="text-2xl font-bold">{selectedDataset.category}</div>
                  </div>
                  <div className="rounded-lg bg-secondary p-4">
                    <div className="text-sm text-muted-foreground">Updated</div>
                    <div className="text-2xl font-bold">{selectedDataset.lastUpdated}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDataset.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Sample Data Preview</h3>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(selectedDataset.previewData[0] || {}).map((key) => (
                            <TableHead key={key} className="bg-muted font-semibold">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedDataset.previewData.map((row, idx) => (
                          <TableRow key={idx}>
                            {Object.values(row).map((value, cellIdx) => (
                              <TableCell key={cellIdx}>{value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1 gap-2 bg-accent hover:bg-accent/90"
                    onClick={() => handleDownload(selectedDataset)}
                  >
                    <Download size={18} />
                    Download Dataset
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedDataset(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
