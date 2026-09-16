"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRight, Loader2, Radar } from "lucide-react"
import { PredictionResults } from "@/components/prediction-results"

export function PredictionForm() {
  const [center, setCenter] = useState("")
  const [commodity, setCommodity] = useState("")
  const [days, setDays] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [predictionData, setPredictionData] = useState<any>(null)
  const [availableOptions, setAvailableOptions] = useState<
   { centre_name: string; commodity_name: string }[]
  >([])

  useEffect(() => {
  const loadOptions = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/available-options`
      )

      if (!response.ok) {
        throw new Error("Failed to load available options")
      }

      const data = await response.json()
      setAvailableOptions(data)
    } catch (error) {
      console.error("Failed to load available options:", error)
      setError("Unable to load centers and commodities.")
    }
  }

  loadOptions()
}, [])

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setError("")
    setPredictionData(null)

    // Validate inputs
    if (!center || !commodity || !days) {
      setError("Please fill in all fields")
      return
    }

    const numDays = Number.parseInt(days)

    if (numDays <= 0 || numDays > 30) {
      setError("Number of days must be between 1 and 30")
      return
    }

    setIsLoading(true)

    try {
      // Send request to our FastAPI backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/predict`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            center: center,

            // Match frontend names with dataset names
            commodity:
              commodity === "Tea (Loose)"
                ? "Tea Loose"
                : commodity === "Tur Arhar Dal"
                  ? "Tur/Arhar Dal"
                  : commodity,

            days: numDays,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || "Prediction failed"
        )
      }

      // Backend may return an error inside a 200 response
      if (data.error) {
        setError(data.error)
        return
      }

      // Store actual backend prediction
      setPredictionData(data)

    } catch (err) {
      console.error("Prediction error:", err)

      setError(
        "Failed to generate prediction. Please make sure the backend is running."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="dashboard-card overflow-hidden rounded-2xl">
        <CardHeader className="border-b border-stone-100 bg-stone-50/70 p-6 sm:p-7 dark:border-emerald-700/70 dark:bg-emerald-700/35">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-800"><Radar className="h-5 w-5" /></div>
            <div><CardTitle className="font-display text-2xl">Create a forecast</CardTitle>
              <CardDescription className="mt-1.5">Choose a market and commodity to turn historical prices into a practical outlook.</CardDescription></div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-7">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

              {/* Center */}
              <div className="space-y-2">
                <Label htmlFor="center">
                  Center
                </Label>

                <Select
                  value={center}
                  onValueChange={(value) => {
  setCenter(value)
  setCommodity("")
}}
                >
                  <SelectTrigger id="center" className="h-11">
                    <SelectValue placeholder="Select center" />
                  </SelectTrigger>

                  <SelectContent>
  {[...new Set(availableOptions.map((option) => option.centre_name))].map(
    (c) => (
      <SelectItem key={c} value={c}>
        {c}
      </SelectItem>
    )
  )}
</SelectContent>
                </Select>
              </div>

              {/* Commodity */}
              <div className="space-y-2">
                <Label htmlFor="commodity">
                  Commodity
                </Label>

 <Select
  value={commodity}
  onValueChange={setCommodity}
  disabled={!center}
>
  <SelectTrigger id="commodity" className="h-11">
    <SelectValue placeholder="Select commodity" />
  </SelectTrigger>

  <SelectContent>
    {[
      ...new Set(
        availableOptions
          .filter((option) => option.centre_name === center)
          .map((option) => option.commodity_name)
      ),
    ].map((c) => (
      <SelectItem key={c} value={c}>
        {c}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
              </div>

              {/* Days */}
              <div className="space-y-2">
                <Label htmlFor="days">
                  Forecast horizon
                </Label>

                <Input
                  id="days"
                  type="number"
                  min="1"
                  max="30"
                  placeholder="1–30 days"
                  className="h-11"
                  value={days}
                  onChange={(e) =>
                    setDays(e.target.value)
                  }
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="h-11 w-full bg-emerald-800 text-base shadow-lg shadow-emerald-900/15 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Prediction...
                </>
              ) : (
                <><span>Generate forecast</span><ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Show backend results */}
      {predictionData && (
        <PredictionResults data={predictionData} />
      )}
    </div>
  )
}
