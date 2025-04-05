"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, ArrowUpDown, Trash2, Edit, FileText, Check, Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUpdateContractMutation, useDeleteContractMutation } from "@/redux/Service/contract"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useSelector } from "react-redux"
import { toast } from "sonner" 

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
}

export default function ContractsListPage() {
  const ws = useRef(null)
  const [contracts, setContracts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [updateContract, { isLoading: isUpdating }] = useUpdateContractMutation()
  const [deleteContract, { isLoading: isDeleting }] = useDeleteContractMutation()

  // Dialog states
  const [editOpen, setEditOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [currentContract, setCurrentContract] = useState(null)
  const [deliveryDate, setDeliveryDate] = useState(new Date())
  const [formData, setFormData] = useState({
    delivery_address: "",
    quantity: 0,
    nego_price: 0,
    terms: [],
    newTerm: ""
  })
  
  // Notification states
  const [showNotifications, setShowNotifications] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  
  // Approval confirmation dialog
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false)
  const [contractToApprove, setContractToApprove] = useState(null)

  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.access;
  const userRole = userInfo?.role

  // Initialize WebSocket connection
  useEffect(() => {
    if (!token) return;
    
    ws.current = new WebSocket("ws://localhost:5000/ws/contract/")

    ws.current.onopen = () => {
      console.log("WebSocket connected")
      // Send initial request to fetch contracts
      ws.current.send(JSON.stringify({
        token: token,
        action: "fetch_contracts"
      }))
    }

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("WebSocket data received:", data)
      if (data.data) {
        const transformedContracts = transformContracts(data.data)
        setContracts(transformedContracts)
        
        // Count pending contracts
        const pendingContracts = transformedContracts.filter(c => c.status === 'pending')
        setPendingCount(pendingContracts.length)
      }
    }

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    ws.current.onclose = () => {
      console.log("WebSocket disconnected")
    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [token])

  // Transform the API data to match our UI needs
  const transformContracts = (data) => {
    if (!data) return []
    
    return data.map(contract => ({
      id: contract.contract_id,
      crop: contract.crop_name,
      farmer: contract.farmer_name,
      buyer: contract.buyer_name,
      quantity: contract.quantity,
      price: contract.nego_price,
      deliveryDate: contract.delivery_date,
      status: contract.status ? "active" : "pending", // Convert boolean to status string
      createdAt: contract.created_at,
      terms: contract.terms || [],
      delivery_address: contract.delivery_address,
      rawData: contract // Keep original data for editing
    }))
  }

  // Open view dialog
  const handleViewClick = (contract) => {
    setCurrentContract(contract)
    setViewOpen(true)
  }

  // Open edit dialog
  const handleEditClick = (contract) => {
    setCurrentContract(contract)
    setFormData({
      delivery_address: contract.delivery_address,
      quantity: contract.quantity,
      nego_price: contract.price,
      terms: [...contract.terms],
      newTerm: ""
    })
    setDeliveryDate(new Date(contract.deliveryDate))
    setEditOpen(true)
  }

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Add new term
  const addTerm = () => {
    if (formData.newTerm.trim()) {
      setFormData(prev => ({
        ...prev,
        terms: [...prev.terms, prev.newTerm.trim()],
        newTerm: ""
      }))
    }
  }

  // Remove term
  const removeTerm = (index) => {
    setFormData(prev => ({
      ...prev,
      terms: prev.terms.filter((_, i) => i !== index)
    }))
  }

  // Open approval confirmation dialog
  const openApprovalDialog = (contractId) => {
    setContractToApprove(contractId)
    setApprovalDialogOpen(true)
  }

  // Handle contract approval
  const handleApprove = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && contractToApprove) {
      ws.current.send(JSON.stringify({
        token: token,
        contract_id: contractToApprove,
        action: "approve_contracts"
      }))
      
      // Close dialogs and show toast
      setApprovalDialogOpen(false)
      setViewOpen(false)
      toast.success("Contract Approved", {
        description: "The contract has been successfully approved.",
        
      })

      // toast({
      //   title: "Contract Approved",
      //   description: "The contract has been successfully approved.",
      //   variant: "success",
      // })
    }
  }

  // Handle contract update
  const handleUpdate = async () => {
    try {
      const updatedData = {
        delivery_address: formData.delivery_address,
        delivery_date: format(deliveryDate, 'yyyy-MM-dd'),
        quantity: Number(formData.quantity),
        nego_price: Number(formData.nego_price),
        terms: formData.terms,
        status: currentContract.status === "active" // Convert back to boolean
      }
      
      // Send update via WebSocket
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          token: token,
          action: "update_contract",
          contract_id: currentContract.id,
          data: updatedData
        }))
      }

      // Also update via REST API
      await updateContract({
        contract_id: currentContract.id,
        updatedData: updatedData
      }).unwrap()
      
      setEditOpen(false)
      toast.success("Contract Updated", {
        description: "The contract has been successfully updated.",
        
      })
      // 
    } catch (error) {
      console.error("Failed to update contract:", error)

      toast.error("Update Failed", {
        description: "There was an error updating the contract.",
        
      })     
    }
  }

  // Handle contract deletion
  const handleDelete = async (contractId) => {
    if (confirm("Are you sure you want to delete this contract?")) {
      try {
        // Send delete via WebSocket
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({
            token: token,
            action: "delete_contract",
            contract_id: contractId
          }))
        }

        // Also delete via REST API
        await deleteContract(contractId).unwrap()

        toast.success("Contract Deleted", {
          description: "The contract has been successfully deleted.",
          
        })
       
      } catch (error) {
        console.error("Failed to delete contract:", error)

        toast.error("Delete Failed", {
          description: "There was an error deleting the contract.",
          
        })
        
      }
    }
  }

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && contract.status === activeTab
  })
  
  // Get pending contracts for notifications
  const pendingContracts = contracts.filter(contract => contract.status === 'pending')

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Approval Confirmation Dialog */}
      <AlertDialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Contract Approval</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this contract? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              Yes, Approve Contract
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Contract Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
          </DialogHeader>
          
          {currentContract && (
            <div className="flex flex-col px-4">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">{currentContract.crop} Contract</h2>
                <Badge className={statusColors[currentContract.status]}>
                  {currentContract.status.charAt(0).toUpperCase() + currentContract.status.slice(1)}
                </Badge>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-500">Crop</h3>
                    <p className="font-semibold">{currentContract.crop}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Quantity</h3>
                    <p className="font-semibold">{currentContract.quantity} kg</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-500">Negotiated Price</h3>
                    <p className="font-semibold">₹{currentContract.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Delivery Date</h3>
                    <p className="font-semibold">{new Date(currentContract.deliveryDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-500">Delivery Address</h3>
                  <p className="font-semibold">{currentContract.delivery_address}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-500">Parties</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <h4 className="text-sm text-gray-500">Farmer</h4>
                      <p className="font-semibold">{currentContract.farmer}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500">Buyer</h4>
                      <p className="font-semibold">{currentContract.buyer}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-500">Terms & Conditions</h3>
                  <div className="mt-2 space-y-2 bg-gray-50 p-4 rounded-lg">
                    {currentContract.terms.length > 0 ? (
                      currentContract.terms.map((term, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-sm">•</span>
                          <span className="text-sm">{term}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No terms specified</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-500">Created On</h3>
                    <p className="font-semibold">{new Date(currentContract.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {/* Approval button inside contract details */}
                {userRole === 'farmer' && currentContract.status === 'pending' && (
                  <div className="mt-4">
                    <Button 
                      onClick={() => openApprovalDialog(currentContract.id)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" /> Approve Contract
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Contract Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contract</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Address</label>
              <Input
                name="delivery_address"
                value={formData.delivery_address}
                onChange={handleFormChange}
                placeholder="Enter delivery address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Delivery Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deliveryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deliveryDate ? format(deliveryDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deliveryDate}
                    onSelect={setDeliveryDate}
                    initialFocus
                    fromDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Quantity (kg)</label>
                <Input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Negotiated Price (₹)</label>
                <Input
                  type="number"
                  name="nego_price"
                  value={formData.nego_price}
                  onChange={handleFormChange}
                  placeholder="Enter price"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Terms</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={formData.newTerm}
                  onChange={(e) => setFormData(prev => ({...prev, newTerm: e.target.value}))}
                  placeholder="Add new term"
                />
                <Button onClick={addTerm} variant="outline">
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {formData.terms.map((term, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{term}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTerm(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              onClick={handleUpdate} 
              className="bg-green-600 hover:bg-green-700"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Contracts</h1>
          <p className="text-gray-600 mt-1">Manage your farming contracts</p>
        </div>
        
        {/* Notifications Bell */}
        {userRole === 'farmer' && (
          <div className="relative">
            <Button 
              variant="outline" 
              className="rounded-full h-10 w-10 p-0"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </Button>
            
            {/* Pending Contracts Dropdown */}
            <AnimatePresence>
              {showNotifications && pendingContracts.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden"
                >
                  <div className="p-3 bg-green-50 border-b border-green-100">
                    <h3 className="font-medium text-green-800">Pending Contracts</h3>
                    <p className="text-xs text-green-600">Contracts waiting for your approval</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {pendingContracts.map((contract) => (
                      <div 
                        key={contract.id} 
                        className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          handleViewClick(contract);
                          setShowNotifications(false);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{contract.crop}</p>
                            <p className="text-sm text-gray-500">From: {contract.buyer}</p>
                          </div>
                          <Badge className={statusColors.pending}>Pending</Badge>
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-gray-500">
                          <span>₹{contract.price.toLocaleString()}</span>
                          <span>{new Date(contract.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 bg-gray-50 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-green-600 text-xs w-full"
                      onClick={() => {
                        setActiveTab("pending");
                        setShowNotifications(false);
                      }}
                    >
                      View All Pending Contracts
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
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

        <Tabs defaultValue="all" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Contracts</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              {pendingCount > 0 && (
                <span className="ml-1.5 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContracts.length > 0 ? (
                filteredContracts.map((contract, index) => (
                  <motion.div 
                    key={contract.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card className={`h-full hover:shadow-lg transition-shadow duration-300 border-l-4 ${
                      contract.status === 'pending' ? 'border-l-yellow-500' : 'border-l-green-500'
                    }`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{contract.crop}</CardTitle>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={statusColors[contract.status]}>
                              {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                            </Badge>
                          </div>
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
                            <p className="font-medium">{contract.quantity} kg</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Price</p>
                            <p className="font-medium">₹{contract.price.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Delivery</p>
                            <p className="font-medium">{new Date(contract.deliveryDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <span className="text-xs text-gray-500">
                          Created on {new Date(contract.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewClick(contract)}
                            className="hover:bg-gray-100"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          
                          {/* Show edit/delete only for buyers */}
                          {userRole === 'contractor' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEditClick(contract)}
                                className="hover:bg-gray-100"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(contract.id)}
                                disabled={isDeleting}
                                className="hover:bg-gray-100"
                              >
                                {isDeleting ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                )}
                              </Button>
                            </>
                          )}
                          
                          {/* Show approve button only for farmers on pending contracts */}
                          {userRole === 'farmer' && contract.status === 'pending' && (
                            
                  
                            <Button 
                              
                              onClick={() => openApprovalDialog(contract.id)}
                              className=" bg-green-600 text-xs hover:bg-green-700"
                              >
                               Approve
                              </Button>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No contracts found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div> 
    </div>
  )
}

