"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample contract data
const contracts = [
  {
    id: "c-001",
    crop: "Organic Wheat",
    farmer: "John Doe",
    quantity: "500 kg",
    price: "₹25,000",
    deliveryDate: "2025-05-15",
    status: "active",
    createdAt: "2025-04-03",
  },
  {
    id: "c-002",
    crop: "Basmati Rice",
    farmer: "Sarah Johnson",
    quantity: "1000 kg",
    price: "₹45,000",
    deliveryDate: "2025-06-20",
    status: "pending",
    createdAt: "2025-04-02",
  },
  {
    id: "c-003",
    crop: "Organic Tomatoes",
    farmer: "Michael Chen",
    quantity: "300 kg",
    price: "₹15,000",
    deliveryDate: "2025-04-25",
    status: "completed",
    createdAt: "2025-03-28",
  },
  {
    id: "c-004",
    crop: "Cotton",
    farmer: "Priya Sharma",
    quantity: "800 kg",
    price: "₹35,000",
    deliveryDate: "2025-07-10",
    status: "active",
    createdAt: "2025-04-01",
  },
  {
    id: "c-005",
    crop: "Sugarcane",
    farmer: "Robert Wilson",
    quantity: "2000 kg",
    price: "₹60,000",
    deliveryDate: "2025-08-05",
    status: "pending",
    createdAt: "2025-03-30",
  },
]

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
}

export default function ContractsListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && contract.status === activeTab
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Contracts</h1>
          <p className="text-gray-600 mt-1">Manage your farming contracts</p>
        </div>
        <Link href="/contracts/create">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" /> Create Contract
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Recent first</DropdownMenuItem>
                <DropdownMenuItem>Oldest first</DropdownMenuItem>
                <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ArrowUpDown className="h-4 w-4" /> Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Date: Newest</DropdownMenuItem>
                <DropdownMenuItem>Date: Oldest</DropdownMenuItem>
                <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Contracts</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredContracts.length > 0 ? (
                filteredContracts.map((contract) => (
                  <motion.div key={contract.id} variants={itemVariants}>
                    <Link href={`/contracts/${contract.id}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer border-l-4 border-l-green-500">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{contract.crop}</CardTitle>
                              <CardDescription>Contract ID: {contract.id}</CardDescription>
                            </div>
                            <Badge className={statusColors[contract.status]}>
                              {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div>
                              <p className="text-gray-500">Farmer</p>
                              <p className="font-medium">{contract.farmer}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Quantity</p>
                              <p className="font-medium">{contract.quantity}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Price</p>
                              <p className="font-medium">{contract.price}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Delivery</p>
                              <p className="font-medium">{new Date(contract.deliveryDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2 text-xs text-gray-500">
                          Created on {new Date(contract.createdAt).toLocaleDateString()}
                        </CardFooter>
                      </Card>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No contracts found matching your criteria.</p>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

