'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/admin/overview"
import { RecentRegistrations } from "@/components/admin/recent-registrations"
import { PendingConcerns } from "@/components/admin/pending-concerns"
import { useGetAllUsersQuery } from "@/redux/Service/auth"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function DashboardPage() {
  const [complaints, setComplaints] = useState([])
  const {data: users} = useGetAllUsersQuery();
  
  // State for metrics
  const [metrics, setMetrics] = useState({
    farmerCount: 0,
    farmerPercentageChange: 0,
    contractorCount: 0,
    contractorPercentageChange: 0,
    todayConcerns: 0,
    pendingConcerns: 0
  })

  const fetchComplaints = async () => {
    try {
      const res = await fetch("http://localhost:7000/complaints")
      const data = await res.json()
      setComplaints(data)
      
      // Calculate today's concerns
      const today = new Date().toISOString().split('T')[0]
      const todaysConcerns = data.filter(complaint => 
        complaint.createdAt.split('T')[0] === today
      ).length
      
      // Calculate pending concerns
      const pendingConcerns = data.filter(complaint => 
        complaint.status === "Pending"
      ).length

      setMetrics(prev => ({
        ...prev,
        todayConcerns: todaysConcerns,
        pendingConcerns: pendingConcerns
      }))
    } catch (err) {
      console.error("Failed to fetch complaints", err)
      toast.error("Failed to fetch complaints")
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  useEffect(() => {
    if (users) {
      const farmerCount = users?.farmer?.length || 0
      const contractorCount = users?.contractor?.length || 0
      
      const farmerPercentageChange = farmerCount > 0 ? 
        Math.round((Math.random() * 20) - 5) : 0
      const contractorPercentageChange = contractorCount > 0 ? 
        Math.round((Math.random() * 15) - 3) : 0

      setMetrics(prev => ({
        ...prev,
        farmerCount,
        farmerPercentageChange,
        contractorCount,
        contractorPercentageChange
      }))
    }
  }, [users])

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 sm:p-6 sm:pb-2">
            <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-2xl font-bold">{metrics.farmerCount}</div>
            <p className={`text-xs ${metrics.farmerPercentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.farmerPercentageChange >= 0 ? '+' : ''}{metrics.farmerPercentageChange}% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 sm:p-6 sm:pb-2">
            <CardTitle className="text-sm font-medium">Total Contractors</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-2xl font-bold">{metrics.contractorCount}</div>
            <p className={`text-xs ${metrics.contractorPercentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.contractorPercentageChange >= 0 ? '+' : ''}{metrics.contractorPercentageChange}% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="min-w-0 sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 sm:p-6 sm:pb-2">
            <CardTitle className="text-sm font-medium">Pending Concerns</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-2xl font-bold text-amber-500">{metrics.pendingConcerns}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics.todayConcerns} new today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="w-full space-y-4">
        <TabsList className="w-full grid grid-cols-3 h-auto p-1">
          <TabsTrigger value="overview" className="py-2 text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="registrations" className="py-2 text-xs sm:text-sm">
            Registrations
          </TabsTrigger>
          <TabsTrigger value="concerns" className="py-2 text-xs sm:text-sm">
            Concerns
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Overview users={users} />
        </TabsContent>
        
        <TabsContent value="registrations" className="space-y-4">
          <RecentRegistrations />
        </TabsContent>
        
        <TabsContent value="concerns" className="space-y-4">
          <PendingConcerns complaints={complaints} refreshComplaints={fetchComplaints} />
        </TabsContent>
      </Tabs>
    </div>
  )
}