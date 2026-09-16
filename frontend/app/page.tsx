import Link from "next/link"
import { LoginForm } from "@/components/login-form"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowUpRight, ChartNoAxesCombined, Sprout } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fffcf6] text-emerald-950 dark:bg-background">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
      <section className="grain-grid relative hidden overflow-hidden bg-[#dcebdc] p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-amber-300/25 blur-3xl" />
        <div className="relative flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-800 text-amber-100"><Sprout className="h-5 w-5" /></span><span className="font-display text-2xl font-semibold">Mandi<span className="text-emerald-700">Scope</span></span></div>
        <div className="relative max-w-xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800/70">Agricultural market intelligence</p>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight xl:text-6xl">A clearer view of tomorrow&apos;s market.</h1>
          <p className="mt-6 max-w-md text-base leading-7 text-emerald-950/70">Forecast commodity prices by market, identify movement early, and plan from evidence instead of instinct.</p>
          <div className="mt-10 flex gap-3"><div className="rounded-2xl bg-white/75 p-4 shadow-sm"><ChartNoAxesCombined className="mb-3 h-5 w-5 text-emerald-700" /><p className="text-2xl font-semibold">550+</p><p className="text-xs text-muted-foreground">markets mapped</p></div><div className="rounded-2xl bg-emerald-900 p-4 text-emerald-50 shadow-sm"><ArrowUpRight className="mb-3 h-5 w-5 text-amber-200" /><p className="text-2xl font-semibold">30 days</p><p className="text-xs text-emerald-100/70">forecast horizon</p></div></div>
        </div>
        <p className="relative text-sm text-emerald-950/55">Better signals for better agricultural decisions.</p>
      </section>

      <section className="relative flex items-center justify-center p-6 sm:p-10">
          <div className="absolute right-5 top-5">
            <ModeToggle/>
          </div>
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden"><div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-800 text-amber-100"><Sprout className="h-5 w-5" /></span><span className="font-display text-xl font-semibold">MandiScope</span></div></div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.17em] text-emerald-700">Welcome back</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">Sign in to your workspace</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Access your market forecasts and commodity outlooks.</p>
          </div>

          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_45px_-30px_rgba(20,83,45,0.35)] sm:p-7"><LoginForm /></div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-400">
                Sign up  
              </Link>
            </p>
          </div>
        </div>
      </section>
      </div>
    </div>
  )
}
