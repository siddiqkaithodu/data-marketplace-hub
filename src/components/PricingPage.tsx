import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Sparkle } from '@phosphor-icons/react'
import { pricingPlans } from '@/lib/data'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import * as api from '@/lib/api'
import { useState } from 'react'

interface PricingPageProps {
  onAuthClick: (mode: 'signin' | 'signup') => void
}

export function PricingPage({ onAuthClick }: PricingPageProps) {
  const { isAuthenticated, user, refreshUser } = useAuth()
  const [subscribing, setSubscribing] = useState<string | null>(null)

  const handleSelectPlan = async (planId: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to select a plan')
      onAuthClick('signup')
      return
    }

    setSubscribing(planId)
    try {
      const response = await api.subscribeToPlan(planId)
      toast.success(response.message)
      // Refresh user data to reflect new plan
      await refreshUser()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Subscription failed. Please try again or contact support if the issue persists.')
    } finally {
      setSubscribing(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 md:px-12 py-12">
        <div className="mb-16 text-center space-y-4">
          <Badge className="bg-accent/10 text-accent hover:bg-accent/20">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Scale your data needs with flexible pricing. Start free and upgrade anytime.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative transition-all ${
                plan.highlighted
                  ? 'border-accent shadow-lg scale-105 md:scale-110'
                  : 'hover:border-accent/50 hover:shadow-md'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-accent to-primary text-white gap-1 px-4 py-1">
                    <Sparkle size={14} weight="fill" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">
                  {plan.id === 'free' && 'Perfect for getting started'}
                  {plan.id === 'starter' && 'For small projects and startups'}
                  {plan.id === 'professional' && 'For growing businesses'}
                  {plan.id === 'enterprise' && 'For large-scale operations'}
                </CardDescription>
                <div className="pt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle
                        size={18}
                        weight="fill"
                        className="text-accent mt-0.5 flex-shrink-0"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-6">
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-accent hover:bg-accent/90'
                      : ''
                  }`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={(isAuthenticated && user?.plan === plan.id) || subscribing === plan.id}
                >
                  {subscribing === plan.id
                    ? 'Subscribing...'
                    : isAuthenticated && user?.plan === plan.id
                    ? 'Current Plan'
                    : plan.price === 0
                    ? 'Get Started'
                    : 'Subscribe'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>All Plans Include</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} weight="fill" className="text-accent mt-0.5" />
                  <span>RESTful API access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} weight="fill" className="text-accent mt-0.5" />
                  <span>JSON & CSV exports</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} weight="fill" className="text-accent mt-0.5" />
                  <span>Regular data updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} weight="fill" className="text-accent mt-0.5" />
                  <span>API documentation</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Money-Back Guarantee</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Try any paid plan risk-free for 14 days. If you're not satisfied, we'll refund your payment, no questions asked.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enterprise Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Need custom data pipelines, dedicated infrastructure, or white-label solutions? Contact us for enterprise pricing.
              </p>
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5">
          <CardContent className="p-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4 text-left">
                <div>
                  <h3 className="font-semibold mb-1">Can I change plans at any time?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">What happens if I exceed my API limit?</h3>
                  <p className="text-sm text-muted-foreground">
                    Requests beyond your plan limit will receive a 429 rate limit error. You can upgrade your plan or wait for your quota to reset.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Do you offer annual billing?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes! Annual billing saves you 20% compared to monthly plans. Contact us to switch to annual billing.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
