"use client"

import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

const API_URL = "http://localhost:8000"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get("token") || ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setMessage("")
    setError("")

    if (!token) {
      setError("Invalid or missing reset token.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Unable to reset password.")
      }

      setMessage("Password reset successfully!")

      setPassword("")
      setConfirmPassword("")

      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <h1 className="mb-4 text-3xl font-bold">
          Reset Password
        </h1>

        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Enter your new password below.
        </p>

        {message && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {message}
            <br />
            Redirecting to login...
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              required
              className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirm New Password
            </label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              disabled={loading}
              required
              className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-green-600 py-2.5 font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 block text-center text-green-600 hover:text-green-700"
        >
          Back to login
        </Link>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
