"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface PricePoint {
  date: string
  price: number
}

interface Prediction extends PricePoint {
  day: number
}

interface PredictionData {
  center: string
  commodity: string
  days: number
  history: PricePoint[]
  predictions: Prediction[]
  modelInfo: {
    name: string
    order: string
    description: string
    validationMae?: number
    naiveMae?: number
    validationDays?: number
    trainingObservations?: number
  }
}

export function PredictionResults({ data }: { data: PredictionData }) {
  const [view, setView] = useState("chart")
  const lastActual = data.history.at(-1)
  const chartData = [
    ...data.history.map((point) => ({ date: point.date, actual: point.price, forecast: null })),
    // Repeat the final observed point only to visually join forecast to history.
    ...(lastActual ? [{ date: lastActual.date, actual: null, forecast: lastActual.price }] : []),
    ...data.predictions.map((point) => ({ date: point.date, actual: null, forecast: point.price })),
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Results</CardTitle>
        <CardDescription>Price forecast for {data.commodity} in {data.center} for the next {data.days} days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 rounded-md bg-muted p-3 text-sm">
          <p><span className="font-semibold">Model:</span> {data.modelInfo.name} {data.modelInfo.order}</p>
          <p>{data.modelInfo.description}</p>
          {data.modelInfo.validationMae !== undefined && (
            <p className="mt-1 text-muted-foreground">
              Validation MAE: ₹{data.modelInfo.validationMae.toFixed(2)} over {data.modelInfo.validationDays} days
              {data.modelInfo.naiveMae !== undefined && ` (last-price baseline: ₹${data.modelInfo.naiveMae.toFixed(2)})`}
            </p>
          )}
        </div>

        <Tabs defaultValue="chart" className="space-y-4" onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="chart">Chart View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>

          <TabsContent value="chart">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} minTickGap={40} />
                  <YAxis label={{ value: "Price (₹)", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }} />
                  <Tooltip formatter={(value) => [`₹${value}`, "Price"]} />
                  <Legend />
                  <Line type="monotone" dataKey="actual" name="Historical price" stroke="#64748b" dot={false} strokeWidth={2} connectNulls />
                  <Line type="monotone" dataKey="forecast" name="Predicted price" stroke="#22c55e" strokeDasharray="6 4" activeDot={{ r: 6 }} strokeWidth={2} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="table">
            <div className="rounded-md border">
              <Table>
                <TableHeader><TableRow><TableHead>Day</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Predicted Price (₹)</TableHead></TableRow></TableHeader>
                <TableBody>{data.predictions.map((prediction) => <TableRow key={prediction.day}><TableCell>{prediction.day}</TableCell><TableCell>{prediction.date}</TableCell><TableCell className="text-right">₹{prediction.price.toFixed(2)}</TableCell></TableRow>)}</TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
