import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Code, Copy, CheckCircle, Key } from '@phosphor-icons/react'
import { apiEndpoints } from '@/lib/data'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export function ApiDocsPage() {
  const { isAuthenticated, user } = useAuth()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const categories = Array.from(new Set(apiEndpoints.map(e => e.category)))

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const methodColors: Record<string, string> = {
    GET: 'bg-blue-100 text-blue-700',
    POST: 'bg-green-100 text-green-700',
    PUT: 'bg-yellow-100 text-yellow-700',
    DELETE: 'bg-red-100 text-red-700'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 md:px-12 py-12">
        <div className="mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Code className="text-white" size={24} weight="bold" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">API Documentation</h1>
              <p className="text-muted-foreground">Complete reference for integrating DataFlow into your applications</p>
            </div>
          </div>
        </div>

        {isAuthenticated && user?.apiKey && (
          <Card className="mb-8 border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key size={20} />
                Your API Key
              </CardTitle>
              <CardDescription>Use this key to authenticate your API requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-muted px-4 py-3 font-mono text-sm">
                  {user.apiKey}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(user.apiKey || '', 'api-key')}
                >
                  {copiedId === 'api-key' ? (
                    <CheckCircle size={18} className="text-green-600" weight="fill" />
                  ) : (
                    <Copy size={18} />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!isAuthenticated && (
          <Card className="mb-8 border-accent/20">
            <CardContent className="p-6 text-center">
              <Key size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">Authentication Required</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sign in to get your API key and start making requests
              </p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue={categories[0]} className="space-y-6">
          <TabsList className="inline-flex">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-6">
              {apiEndpoints
                .filter((endpoint) => endpoint.category === category)
                .map((endpoint) => (
                  <Card key={endpoint.id}>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={methodColors[endpoint.method]}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono text-muted-foreground">
                          {endpoint.path}
                        </code>
                      </div>
                      <CardTitle className="text-xl">{endpoint.description}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {endpoint.parameters.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Parameters</h4>
                          <div className="space-y-3">
                            {endpoint.parameters.map((param) => (
                              <div
                                key={param.name}
                                className="rounded-lg border border-border p-4"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <code className="font-mono text-sm font-semibold">
                                    {param.name}
                                  </code>
                                  <Badge variant="outline" className="text-xs">
                                    {param.type}
                                  </Badge>
                                  {param.required && (
                                    <Badge variant="destructive" className="text-xs">
                                      required
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {param.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold mb-3">Response</h4>
                        <div className="rounded-lg bg-muted p-4">
                          <pre className="font-mono text-sm overflow-x-auto">
                            {endpoint.response}
                          </pre>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">Example Request</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(endpoint.example, endpoint.id)
                            }
                          >
                            {copiedId === endpoint.id ? (
                              <>
                                <CheckCircle
                                  size={16}
                                  className="text-green-600 mr-2"
                                  weight="fill"
                                />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy size={16} className="mr-2" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="rounded-lg bg-slate-900 p-4">
                          <pre className="font-mono text-sm text-green-400 overflow-x-auto">
                            {endpoint.example}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          ))}
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Rate Limits</CardTitle>
            <CardDescription>API usage limits by plan tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">Free</div>
                <div className="text-2xl font-bold">1,000</div>
                <div className="text-xs text-muted-foreground">calls/month</div>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">Starter</div>
                <div className="text-2xl font-bold">50,000</div>
                <div className="text-xs text-muted-foreground">calls/month</div>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">Professional</div>
                <div className="text-2xl font-bold">500,000</div>
                <div className="text-xs text-muted-foreground">calls/month</div>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">Enterprise</div>
                <div className="text-2xl font-bold">Unlimited</div>
                <div className="text-xs text-muted-foreground">custom limits</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
