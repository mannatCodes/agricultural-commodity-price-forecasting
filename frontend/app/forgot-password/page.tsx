"use client"

import { useState } from "react"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [resetLink, setResetLink] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setMessage("")
    setError("")
    setResetLink("")
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Unable to generate reset link.")
      }

      setMessage("Reset link generated successfully.")
      setResetLink(data.reset_link)
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
          Forgot Password
        </h1>

        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Enter your registered email address to reset your password.
        </p>

        {message && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {resetLink && (
          <div className="mb-4 rounded-md border bg-card p-4">
            <p className="mb-2 text-sm font-medium">
              Your password reset link:
            </p>

            <a
              href={resetLink}
              className="break-all text-sm text-green-600 underline hover:text-green-700"
            >
              {resetLink}
            </a>

            <p className="mt-3 text-xs text-gray-500">
              This development reset link expires after a short period.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded border bg-background p-3"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-green-600 p-3 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Generating reset link..." : "Generate reset link"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-4 block text-center text-green-600 hover:text-green-700"
        >
          Back to login
        </Link>
      </div>
    </div>
  )
}