import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function CommodityList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monitored Commodities</CardTitle>
        <CardDescription>Essential food commodities tracked by the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Gram (Chana Dal)</span>
            </div>
            <Badge variant="outline" className="bg-green-50">
              Stable
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>Tur Dal</span>
            </div>
            <Badge variant="outline" className="bg-red-50">
              Rising
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span>Urad Dal</span>
            </div>
            <Badge variant="outline" className="bg-amber-50">
              Alert
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Moong Dal</span>
            </div>
            <Badge variant="outline" className="bg-green-50">
              Stable
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Masur Dal</span>
            </div>
            <Badge variant="outline" className="bg-blue-50">
              Falling
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>Onion</span>
            </div>
            <Badge variant="outline" className="bg-red-50">
              Rising
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Potato</span>
            </div>
            <Badge variant="outline" className="bg-green-50">
              Stable
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Tomato</span>
            </div>
            <Badge variant="outline" className="bg-green-50">
              Stable
            </Badge>
          </div>
        </div>
        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-green-600 hover:text-green-700">
            View all 22 commodities
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
