"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, ChevronDown, LogOut, Menu, Sprout, User, X } from "lucide-react"

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

useEffect(() => {
  if (typeof window !== "undefined") {
    const email = sessionStorage.getItem("userEmail")
    setUserEmail(email)

    // Get name from signup data
    const savedUser = localStorage.getItem("agriPredictUser")

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setUserName(user.name)
      } catch (error) {
        console.error("Failed to read user data:", error)
      }
    }
  }
}, [])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("userEmail")
    }
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-[#fffcf6]/85 backdrop-blur-xl dark:bg-background/85">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-[4.5rem] items-center justify-between">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-800 text-amber-100 shadow-md shadow-emerald-900/20"><Sprout className="h-5 w-5" /></span>
              <span className="font-display text-xl font-semibold tracking-tight">Mandi<span className="text-emerald-700">Scope</span></span>
            </Link>

            <nav className="hidden md:ml-10 md:flex md:items-center md:gap-1">
              <Link
                href="/dashboard"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-emerald-100/70 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "text-muted-foreground hover:bg-stone-100 hover:text-emerald-800 dark:hover:bg-muted"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/project-details"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === "/project-details"
                    ? "bg-emerald-100/70 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "text-muted-foreground hover:bg-stone-100 hover:text-emerald-800 dark:hover:bg-muted"
                }`}
              >
                Project Details
              </Link>
              <Link
                href="/market-guide"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === "/market-guide"
                    ? "bg-emerald-100/70 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "text-muted-foreground hover:bg-stone-100 hover:text-emerald-800 dark:hover:bg-muted"
                }`}
              >
                Forecast guide
              </Link>
            </nav>
          </div>

          {/* User menu and mobile menu button */}
          <div className="flex items-center gap-2">
            <ModeToggle />

            <Button variant="ghost" size="icon" className="mr-1 rounded-xl">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center rounded-xl">
                  <User className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">
                     {userName || (userEmail ? userEmail.split("@")[0] : "User")}
                  </span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                     <div className="flex flex-col">
                     <span>{userName || "User"}</span>
                     <span className="text-xs text-muted-foreground">
                     {userEmail || "No email"}
                     </span>
                     </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-2 pb-4">
            <nav className="flex flex-col space-y-1">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-base font-medium ${
                  pathname === "/dashboard"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                    : "text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/project-details"
                className={`px-3 py-2 rounded-md text-base font-medium ${
                  pathname === "/project-details"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                    : "text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Project Details
              </Link>
              <Link
                href="/market-guide"
                className={`px-3 py-2 rounded-md text-base font-medium ${
                  pathname === "/market-guide"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                    : "text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Forecast guide
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
