"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, ChevronDown, LogOut, Menu, Settings, TrendingUp, User } from "lucide-react"

export function DashboardHeader() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    router.push("/")
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AgriPredict</span>
            </Link>

            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/dashboard" className="text-gray-900 hover:text-green-600 px-3 py-2 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="#" className="text-gray-500 hover:text-green-600 px-3 py-2 text-sm font-medium">
                Commodities
              </Link>
              <Link href="#" className="text-gray-500 hover:text-green-600 px-3 py-2 text-sm font-medium">
                Predictions
              </Link>
              <Link href="#" className="text-gray-500 hover:text-green-600 px-3 py-2 text-sm font-medium">
                Analytics
              </Link>
              <Link href="#" className="text-gray-500 hover:text-green-600 px-3 py-2 text-sm font-medium">
                Reports
              </Link>
            </nav>
          </div>

          {/* User menu and mobile menu button */}
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">Admin User</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
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
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-2 pb-4">
            <nav className="flex flex-col space-y-1">
              <Link
                href="/dashboard"
                className="text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Commodities
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Predictions
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Analytics
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Reports
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
