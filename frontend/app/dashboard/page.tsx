"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { PredictionForm } from "@/components/prediction-form"
import { Activity, ArrowRight, ArrowUpRight, MapPin, Sparkles } from "lucide-react"

type DashboardStats = {
  markets: number
  commodities: number
  forecastSeries: number
  average30DayMovement: number | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    const userEmail = sessionStorage.getItem("userEmail")

    if (!userEmail) {
      router.replace("/")
      return
    }

    setIsAuthenticated(true)
  }, [router])

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard-stats`)
        if (!response.ok) throw new Error("Unable to load dashboard stats")
        setStats(await response.json())
      } catch (error) {
        console.error("Failed to load dashboard stats:", error)
      }
    }

    loadStats()
  }, [])

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
              <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-900/70 sm:text-base">Choose a market and commodity below to generate a data-backed price forecast for the next 30 days.</p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-emerald-950">
              <a href="#forecast" className="flex items-center gap-2 rounded-xl bg-emerald-800 px-3.5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"><span>Create forecast</span><ArrowRight className="h-4 w-4" /></a>
              <div className="flex items-center gap-2 rounded-xl bg-white/75 px-3.5 py-2.5 shadow-sm"><MapPin className="h-4 w-4 text-emerald-700" />{stats?.forecastSeries ?? "..."} forecast series</div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#c2c8cf] bg-[#cfd4da]/90 p-5 text-slate-900 shadow-[0_12px_35px_-22px_rgba(20,83,45,0.35)] backdrop-blur"><div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-600">Markets monitored</span><MapPin className="h-4 w-4 text-emerald-700" /></div><p className="mt-4 font-display text-3xl font-semibold">{stats?.markets ?? "—"}</p><p className="mt-1 text-xs text-slate-600">Reporting centres in this dataset</p></div>
          <div className="rounded-2xl border border-[#c2c8cf] bg-[#cfd4da]/90 p-5 text-slate-900 shadow-[0_12px_35px_-22px_rgba(20,83,45,0.35)] backdrop-blur"><div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-600">Active commodities</span><Activity className="h-4 w-4 text-emerald-700" /></div><p className="mt-4 font-display text-3xl font-semibold">{stats?.commodities ?? "—"}</p><p className="mt-1 text-xs text-slate-600">Produce categories available to explore</p></div>
          <div className="rounded-2xl bg-emerald-800 p-5 text-emerald-50 shadow-[0_14px_30px_-18px_rgba(6,78,59,0.8)]"><div className="flex items-center justify-between text-emerald-100/70"><span className="text-sm font-medium">30-day price movement</span><ArrowUpRight className="h-4 w-4" /></div><p className="mt-4 font-display text-3xl font-semibold">{stats?.average30DayMovement == null ? "—" : `${stats.average30DayMovement >= 0 ? "+" : ""}${stats.average30DayMovement}%`}</p><p className="mt-1 text-xs text-emerald-100/70">Average change across tracked market series</p></div>
        </section>

        <section id="forecast" className="scroll-mt-6">
          <PredictionForm />
        </section>
      </main>
    </div>
  )
}
