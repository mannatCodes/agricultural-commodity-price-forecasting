import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PriceTrends() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Price Trends</CardTitle>
        <CardDescription>Historical and predicted price trends for key commodities</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pulses">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pulses">Pulses</TabsTrigger>
            <TabsTrigger value="vegetables">Vegetables</TabsTrigger>
            <TabsTrigger value="fruits">Fruits</TabsTrigger>
            <TabsTrigger value="cereals">Cereals</TabsTrigger>
            <TabsTrigger value="oils">Oils</TabsTrigger>
          </TabsList>
          <TabsContent value="pulses" className="pt-4">
            <div className="h-[300px] rounded-md border border-dashed border-gray-200 flex items-center justify-center">
              <p className="text-sm text-gray-500">Pulse price trend chart will appear here</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-md border p-4">
                <div className="text-sm font-medium">Current Price</div>
                <div className="mt-1 flex items-center">
                  <span className="text-2xl font-bold">₹98.50</span>
                  <span className="ml-2 text-xs text-green-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path
                        fillRule="evenodd"
                        d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                        clipRule="evenodd"
                      />
                    </svg>
                    +2.4%
                  </span>
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-sm font-medium">Predicted (7 days)</div>
                <div className="mt-1 flex items-center">
                  <span className="text-2xl font-bold">₹101.25</span>
                  <span className="ml-2 text-xs text-green-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path
                        fillRule="evenodd"
                        d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                        clipRule="evenodd"
                      />
                    </svg>
                    +2.8%
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="vegetables" className="pt-4">
            <div className="h-[300px] rounded-md border border-dashed border-gray-200 flex items-center justify-center">
              <p className="text-sm text-gray-500">Vegetable price trend chart will appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="fruits" className="pt-4">
            <div className="h-[300px] rounded-md border border-dashed border-gray-200 flex items-center justify-center">
              <p className="text-sm text-gray-500">Fruit price trend chart will appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="cereals" className="pt-4">
            <div className="h-[300px] rounded-md border border-dashed border-gray-200 flex items-center justify-center">
              <p className="text-sm text-gray-500">Cereal price trend chart will appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="oils" className="pt-4">
            <div className="h-[300px] rounded-md border border-dashed border-gray-200 flex items-center justify-center">
              <p className="text-sm text-gray-500">Oil price trend chart will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
