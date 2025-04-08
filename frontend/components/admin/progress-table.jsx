"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample data - in a real app, this would come from your API
const farmerProgress = [
  {
    id: "F001",
    name: "Rajesh Kumar",
    crop: "Wheat",
    area: "5 acres",
    plantedOn: "2023-01-15",
    status: "Harvested",
    lastUpdate: "2023-04-10",
  },
  {
    id: "F002",
    name: "Priya Sharma",
    crop: "Rice",
    area: "3 acres",
    plantedOn: "2023-02-20",
    status: "Growing",
    lastUpdate: "2023-04-12",
  },
  {
    id: "F003",
    name: "Vikram Singh",
    crop: "Cotton",
    area: "7 acres",
    plantedOn: "2023-03-05",
    status: "Planted",
    lastUpdate: "2023-04-08",
  },
  {
    id: "F004",
    name: "Ananya Patel",
    crop: "Sugarcane",
    area: "4 acres",
    plantedOn: "2023-01-10",
    status: "Ready for Delivery",
    lastUpdate: "2023-04-15",
  },
  {
    id: "F005",
    name: "Suresh Reddy",
    crop: "Maize",
    area: "6 acres",
    plantedOn: "2023-02-28",
    status: "Delivered",
    lastUpdate: "2023-04-11",
  },
]

const contractorProgress = [
  {
    id: "C001",
    name: "Aditya Mehta",
    farmers: 12,
    totalArea: "45 acres",
    paymentStatus: "Paid",
    lastTransaction: "2023-04-05",
  },
  {
    id: "C002",
    name: "Neha Gupta",
    farmers: 8,
    totalArea: "30 acres",
    paymentStatus: "Partial",
    lastTransaction: "2023-04-10",
  },
  {
    id: "C003",
    name: "Rahul Verma",
    farmers: 15,
    totalArea: "60 acres",
    paymentStatus: "Pending",
    lastTransaction: "2023-03-28",
  },
  {
    id: "C004",
    name: "Kavita Joshi",
    farmers: 5,
    totalArea: "18 acres",
    paymentStatus: "Paid",
    lastTransaction: "2023-04-12",
  },
  {
    id: "C005",
    name: "Sanjay Kapoor",
    farmers: 10,
    totalArea: "40 acres",
    paymentStatus: "Partial",
    lastTransaction: "2023-04-08",
  },
]


export function ProgressTable({ userType }) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [open, setOpen] = useState(false)

  const handleView = (item) => {
    setSelectedItem(item)
    setOpen(true)
  }

  return (
    <>
      <Table>
        <TableHeader>
          {userType === "farmer" ? (
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Crop</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          ) : (
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Farmers</TableHead>
              <TableHead>Total Area</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Last Transaction</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          )}
        </TableHeader>
        <TableBody>
          {userType === "farmer"
            ? farmerProgress.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.crop}</TableCell>
                  <TableCell>{item.area}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "Delivered"
                          ? "success"
                          : item.status === "Ready for Delivery"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.lastUpdate}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleView(item)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            : contractorProgress.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.farmers}</TableCell>
                  <TableCell>{item.totalArea}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.paymentStatus === "Paid"
                          ? "success"
                          : item.paymentStatus === "Partial"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {item.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.lastTransaction}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleView(item)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {userType === "farmer" ? "Farmer Progress Details" : "Contractor Progress Details"}
            </DialogTitle>
            <DialogDescription>Complete information about the progress.</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              {userType === "farmer" ? (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">ID:</div>
                    <div className="col-span-3">{selectedItem.id}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Name:</div>
                    <div className="col-span-3">{selectedItem.name}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Crop:</div>
                    <div className="col-span-3">{selectedItem.crop}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Area:</div>
                    <div className="col-span-3">{selectedItem.area}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Planted On:</div>
                    <div className="col-span-3">{selectedItem.plantedOn}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Status:</div>
                    <div className="col-span-3">
                      <Badge
                        variant={
                          selectedItem.status === "Delivered"
                            ? "success"
                            : selectedItem.status === "Ready for Delivery"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {selectedItem.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Last Update:</div>
                    <div className="col-span-3">{selectedItem.lastUpdate}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">ID:</div>
                    <div className="col-span-3">{selectedItem.id}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Name:</div>
                    <div className="col-span-3">{selectedItem.name}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Farmers:</div>
                    <div className="col-span-3">{selectedItem.farmers}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Total Area:</div>
                    <div className="col-span-3">{selectedItem.totalArea}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Payment:</div>
                    <div className="col-span-3">
                      <Badge
                        variant={
                          selectedItem.paymentStatus === "Paid"
                            ? "success"
                            : selectedItem.paymentStatus === "Partial"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {selectedItem.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Last Transaction:</div>
                    <div className="col-span-3">{selectedItem.lastTransaction}</div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

