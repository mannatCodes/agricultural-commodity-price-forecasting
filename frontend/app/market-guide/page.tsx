import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgeCheck, CalendarRange, ChartNoAxesCombined, CircleAlert, MapPinned, Sprout } from "lucide-react"

const steps = [
  { icon: MapPinned, title: "Pick a reporting centre", text: "Start with the market whose local pricing matters to your decision." },
  { icon: Sprout, title: "Choose a commodity", text: "The available list is tailored to the centre you selected, keeping forecasts relevant." },
  { icon: CalendarRange, title: "Set the outlook window", text: "Forecast from 1 to 30 days ahead depending on the planning cycle you need." },
  { icon: ChartNoAxesCombined, title: "Read the trend", text: "Compare historical movement with the projected price path before acting." },
]

export default function MarketGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <section className="grain-grid overflow-hidden rounded-3xl border border-emerald-900/10 bg-[#e5f0e5] px-6 py-8 sm:px-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Using MandiScope</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-emerald-950 sm:text-5xl">A practical guide to better forecasts.</h1>
          <p className="mt-4 max-w-2xl leading-7 text-emerald-950/70">Use the forecast as a decision signal: review the trend, consider local conditions, and pair it with your on-ground market knowledge.</p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <Card key={title} className="dashboard-card rounded-2xl">
              <CardHeader className="p-5 pb-2"><div className="flex items-center justify-between"><span className="font-display text-xl text-emerald-950">0{index + 1}</span><div className="rounded-xl bg-emerald-100 p-2 text-emerald-800"><Icon className="h-4 w-4" /></div></div><CardTitle className="pt-4 text-base">{title}</CardTitle></CardHeader>
              <CardContent className="p-5 pt-1 text-sm leading-6 text-muted-foreground">{text}</CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="dashboard-card rounded-2xl"><CardHeader><CardTitle className="font-display text-2xl">How to interpret a forecast</CardTitle></CardHeader><CardContent className="space-y-5 text-sm leading-6 text-muted-foreground"><div><h2 className="font-semibold text-foreground">Historical line</h2><p className="mt-1">Shows recorded pricing leading up to the forecast. Look for stability, recent shifts, and repeating patterns.</p></div><div><h2 className="font-semibold text-foreground">Predicted line</h2><p className="mt-1">Shows the model&apos;s expected direction after the last observed value. It is an estimate, not a guaranteed market price.</p></div><div><h2 className="font-semibold text-foreground">Forecast horizon</h2><p className="mt-1">Shorter windows are generally more actionable. Use longer windows for planning, with more caution around sudden market events.</p></div></CardContent></Card>
          <Card className="rounded-2xl border-amber-200 bg-amber-50/70"><CardHeader><div className="flex items-center gap-2 text-amber-800"><CircleAlert className="h-5 w-5" /><CardTitle className="text-xl">Use with context</CardTitle></div></CardHeader><CardContent className="space-y-4 text-sm leading-6 text-amber-950/75"><p>Weather, harvest timing, transport disruptions, and policy changes can affect prices faster than historical data can reflect.</p><div className="flex items-start gap-2 rounded-xl bg-white/60 p-3"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" /><span>Validate a forecast against current local market information before making a high-impact decision.</span></div></CardContent></Card>
        </section>
      </main>
    </div>
  )
}
