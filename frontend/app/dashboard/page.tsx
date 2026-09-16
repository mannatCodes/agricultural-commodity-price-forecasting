"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { PredictionForm } from "@/components/prediction-form"
import { Activity, ArrowUpRight, CalendarDays, MapPin, Sparkles } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const userEmail = sessionStorage.getItem("userEmail")

    if (!userEmail) {
      router.replace("/")
      return
    }

    setIsAuthenticated(true)
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">
          Checking authentication...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-10">
        <section className="grain-grid relative mb-8 overflow-hidden rounded-3xl border border-emerald-900/10 bg-[#e5f0e5] px-6 py-7 sm:px-9 sm:py-9">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-[#d3a94c]/25 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-900">
                <Sparkles className="h-3.5 w-3.5 text-[#b88625]" /> Market intelligence desk
              </div>
              <h1 className="max-w-2xl font-display text-4xl font-semibold tracking-tight text-emerald-950 sm:text-5xl">See the market before it moves.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-900/70 sm:text-base">Build a focused forecast from market-level price signals and make the next procurement decision with confidence.</p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-emerald-950">
              <div className="flex items-center gap-2 rounded-xl bg-white/75 px-3.5 py-2.5 shadow-sm"><CalendarDays className="h-4 w-4 text-emerald-700" />Updated daily</div>
              <div className="flex items-center gap-2 rounded-xl bg-white/75 px-3.5 py-2.5 shadow-sm"><MapPin className="h-4 w-4 text-emerald-700" />550+ markets</div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="dashboard-card rounded-2xl p-5"><div className="flex items-center justify-between"><span className="text-sm font-medium text-muted-foreground">Markets monitored</span><MapPin className="h-4 w-4 text-emerald-700" /></div><p className="mt-4 font-display text-3xl font-semibold">550<span className="text-lg text-emerald-700">+</span></p><p className="mt-1 text-xs text-muted-foreground">Reporting centres across India</p></div>
          <div className="dashboard-card rounded-2xl p-5"><div className="flex items-center justify-between"><span className="text-sm font-medium text-muted-foreground">Active commodities</span><Activity className="h-4 w-4 text-emerald-700" /></div><p className="mt-4 font-display text-3xl font-semibold">22</p><p className="mt-1 text-xs text-muted-foreground">Essential produce categories tracked</p></div>
          <div className="rounded-2xl bg-emerald-900 p-5 text-emerald-50 shadow-[0_14px_30px_-18px_rgba(6,78,59,0.8)]"><div className="flex items-center justify-between text-emerald-100/70"><span className="text-sm font-medium">Market momentum</span><ArrowUpRight className="h-4 w-4" /></div><p className="mt-4 font-display text-3xl font-semibold">+2.5%</p><p className="mt-1 text-xs text-emerald-100/70">Average movement in the last 30 days</p></div>
        </section>

        <PredictionForm />
      </main>
    </div>
  )
}
