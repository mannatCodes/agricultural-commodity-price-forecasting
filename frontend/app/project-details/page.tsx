import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartNoAxesCombined, CircleAlert, Database, ScanSearch } from "lucide-react"

export default function ProjectDetailsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Project Details</h1>
          <p className="mt-2 text-muted-foreground">
            Learn more about the Agri-Horticultural Commodity Price Prediction System
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Abstract</CardTitle>
              <CardDescription>Overview of the project goals and methodology</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Department of Consumer Affairs monitors the daily prices of 22 essential food commodities through
                550 price reporting centres across the country. The Department also maintains buffer stock of pulses,
                viz., gram, tur, urad, moon and masur, and onion for strategic market interventions to stabilize the
                volatility in prices.
              </p>
              <p>
                Decisions for market interventions such as release of stocks from the buffer are taken on the basis of
                the price trends and outlook. At present, the analyses of prices are based on the seasonality,
                historical and emerging trends, market intelligence inputs, crop sowing and production estimates. ARIMA
                based economic models have also been used to examine and forecast prices of pulses.
              </p>
              <h3 className="text-xl font-semibold mt-4">PROBLEM IDENTIFIED</h3>
              <p>
                The project aims to develop an AI-driven agricultural commodity price prediction system that enhances
                forecasting accuracy and aids in strategic market interventions. By integrating deep learning models
                (LSTM, XGBoost, ARIMA, SARIMA) with real-time data, the system will analyze historical trends, seasonal
                patterns, and external market factors to predict price fluctuations. The goal is to provide farmers,
                traders, and policy makers with data-driven insights for better buffer stock management, price
                stability, and risk mitigation, ultimately reducing economic uncertainty in the agricultural sector.
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="commodities">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="commodities">Commodities</TabsTrigger>
              <TabsTrigger value="centers">Centers</TabsTrigger>
            </TabsList>
            <TabsContent value="commodities" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monitored Commodities</CardTitle>
                  <CardDescription>List of 22 essential food commodities monitored by the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      "Brinjal",
                      "Cabbage",
                      "Gram Dal",
                      "Groundnut Oil (Packed)",
                      "Gur",
                      "Masoor Dal",
                      "Milk",
                      "Moong Dal",
                      "Mustard Oil (Packed)",
                      "Onion",
                      "Palm Oil (Packed)",
                      "Potato",
                      "Rice",
                      "Salt (Packed/Iodised)",
                      "Sugar",
                      "Sunflower Oil (Packed)",
                      "Tea (Loose)",
                      "Tomato",
                      "Tur Arhar Dal",
                      "Urad Dal",
                      "Wheat",
                    ].map((commodity) => (
                      <div key={commodity} className="p-4 border rounded-md bg-card">
                        <p>{commodity}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="centers" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Price Reporting Centers</CardTitle>
                  <CardDescription>
                    Selected centers from the 550 price reporting centers across the country
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      "BENGALURU",
                      "DHARWAD",
                      "MANGALORE",
                      "MYSORE",
                      "T.PURAM",
                      "ERNAKULAM",
                      "KOZHIKODE",
                      "THRISSUR",
                      "PALAKKAD",
                      "WAYANAD",
                      "VISAKHAPATNAM",
                      "VIJAYAWADA",
                      "HYDERABAD",
                      "PUDUCHERRY",
                      "PANAJI",
                      "CHENNAI",
                      "COIMBATORE",
                      "DINDIGUL",
                      "TIRUNELVELI",
                      "THIRUCHIRAPALLI",
                    ].map((center) => (
                      <div key={center} className="p-4 border rounded-md bg-card">
                        <p>{center}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Methodology</CardTitle>
              <CardDescription>AI models and techniques used for price prediction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The system integrates multiple AI and machine learning models to provide accurate price predictions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-semibold">ARIMA (AutoRegressive Integrated Moving Average):</span> Statistical
                  model for time series forecasting
                </li>
                <li>
                  <span className="font-semibold">SARIMA (Seasonal ARIMA):</span> Extension of ARIMA that handles
                  seasonal components in time series data
                </li>
              </ul>
              <p>
                The system combines these models with real-time data inputs, historical price trends, seasonal patterns,
                and external market factors to generate accurate price predictions for agricultural commodities.
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card rounded-2xl">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Forecast confidence guide</CardTitle>
              <CardDescription>What the forecast uses, and how to make the most of it</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/20"><Database className="h-5 w-5 text-emerald-700" /><h3 className="mt-3 font-semibold">Historical signals</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Prior market observations help the model identify direction and recurring movement.</p></div>
              <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-950/20"><ScanSearch className="h-5 w-5 text-amber-700" /><h3 className="mt-3 font-semibold">Pattern analysis</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Seasonal behaviour and recent shifts are assessed to create a focused forecast.</p></div>
              <div className="rounded-xl bg-stone-100 p-4 dark:bg-stone-900"><ChartNoAxesCombined className="h-5 w-5 text-emerald-700" /><h3 className="mt-3 font-semibold">Actionable output</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Compare recorded prices and the estimated path to support timing decisions.</p></div>
              <div className="md:col-span-3 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-100"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" /><p><span className="font-semibold">Important:</span> Forecasts are decision support, not certainty. Consider weather, harvest timing, transport disruptions, and current local demand before acting.</p></div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
