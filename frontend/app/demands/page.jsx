"use client"

import { useRouter } from "next/navigation"
import { useGetAllDemandsQuery } from "@/redux/Service/demandApi"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Plus, Trash, Edit, Loader2, Calendar, MapPin, Phone, Package, DollarSign } from "lucide-react"
export default function DemandCropsPage() {
  const { data: demands = [], isLoading, isError } = useGetAllDemandsQuery()
  const router = useRouter()

  // Function to generate a color based on crop name
  const generateColor = (name) => {
    const colors = [
      "from-green-500 to-emerald-700",
      "from-orange-400 to-amber-700",
      "from-red-400 to-rose-700",
      "from-yellow-300 to-amber-600",
      "from-blue-400 to-indigo-700",
      "from-purple-400 to-violet-700",
    ]

    // Use the first character of the crop name to select a color
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-900 mb-8">Demand Crops</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error fetching demands.</div>
        ) : (
          demands?.data.map((demand) => (
            <Card
              key={demand.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/demand/${demand.demand_id}`)}
            >
              <CardHeader className="p-0">
                <div
                  className={`w-full h-48 rounded-t-lg flex items-center justify-center bg-gradient-to-br ${generateColor(demand.crop_name)} text-white`}
                >
                  <div className="text-center p-4">
                    <h2 className="text-3xl font-bold tracking-tight mb-1">{demand.crop_name}</h2>
                    <p className="text-lg opacity-90 font-medium">Premium Quality</p>
                    <div className="mt-2 px-4 py-1 bg-white/20 rounded-full inline-block backdrop-blur-sm text-sm">
                      Fresh Harvest
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <CardTitle className="text-2xl text-green-800">{demand.crop_name}</CardTitle>
                  <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                    ₹{demand.crop_price}
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-start">
                    <Package className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Quantity: <span className="font-medium">{demand.quantity}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Contact: <span className="font-medium">{demand.contact_no}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Location: <span className="font-medium">{demand.location}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Harvested: <span className="font-medium">{demand.harvested_time}</span>
                    </p>
                  </div>

                  <div className="pt-2">
                    <p className="text-gray-700 line-clamp-2">{demand.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

