"use client"

import { useState } from "react"
import { Eye, MoreHorizontal, ThumbsDown, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample data - in a real app, this would come from your API
const registrations = [
  {
    id: "REG-001",
    name: "Rajesh Kumar",
    aadhaarNumber: "XXXX-XXXX-1234",
    userType: "Farmer",
    location: "Punjab",
    registeredOn: "2023-04-01",
    status: "pending",
  },
  {
    id: "REG-002",
    name: "Priya Sharma",
    aadhaarNumber: "XXXX-XXXX-5678",
    userType: "Farmer",
    location: "Haryana",
    registeredOn: "2023-04-02",
    status: "pending",
  },
  {
    id: "REG-003",
    name: "Vikram Singh",
    aadhaarNumber: "XXXX-XXXX-9012",
    userType: "Contractor",
    location: "Uttar Pradesh",
    registeredOn: "2023-04-03",
    status: "pending",
  },
  {
    id: "REG-004",
    name: "Ananya Patel",
    aadhaarNumber: "XXXX-XXXX-3456",
    userType: "Farmer",
    location: "Gujarat",
    registeredOn: "2023-04-04",
    status: "pending",
  },
  {
    id: "REG-005",
    name: "Suresh Reddy",
    aadhaarNumber: "XXXX-XXXX-7890",
    userType: "Contractor",
    location: "Telangana",
    registeredOn: "2023-04-05",
    status: "pending",
  },
]



export function RecentRegistrations({ verified = false, rejected = false }) {
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null)
  const [open, setOpen] = useState(false)

  // Filter registrations based on props
  const filteredRegistrations = registrations.filter((reg) => {
    if (verified) return reg.status === "verified"
    if (rejected) return reg.status === "rejected"
    return reg.status === "pending"
  })

  const handleView = (registration) => {
    setSelectedRegistration(registration)
    setOpen(true)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Aadhaar Number</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Registered On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRegistrations.map((registration) => (
            <TableRow key={registration.id}>
              <TableCell className="font-medium">{registration.id}</TableCell>
              <TableCell>{registration.name}</TableCell>
              <TableCell>{registration.aadhaarNumber}</TableCell>
              <TableCell>
                <Badge variant={registration.userType === "Farmer" ? "outline" : "secondary"}>
                  {registration.userType}
                </Badge>
              </TableCell>
              <TableCell>{registration.location}</TableCell>
              <TableCell>{registration.registeredOn}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    registration.status === "pending"
                      ? "outline"
                      : registration.status === "verified"
                        ? "success"
                        : "destructive"
                  }
                >
                  {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleView(registration)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {registration.status === "pending" && (
                      <>
                        <DropdownMenuItem>
                          <ThumbsUp className="mr-2 h-4 w-4 text-green-600" />
                          Verify
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ThumbsDown className="mr-2 h-4 w-4 text-red-600" />
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
            <DialogDescription>Complete information about the registration.</DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">ID:</div>
                <div className="col-span-3">{selectedRegistration.id}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-3">{selectedRegistration.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Aadhaar:</div>
                <div className="col-span-3">{selectedRegistration.aadhaarNumber}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Type:</div>
                <div className="col-span-3">{selectedRegistration.userType}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Location:</div>
                <div className="col-span-3">{selectedRegistration.location}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Registered:</div>
                <div className="col-span-3">{selectedRegistration.registeredOn}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-3">
                  <Badge
                    variant={
                      selectedRegistration.status === "pending"
                        ? "outline"
                        : selectedRegistration.status === "verified"
                          ? "success"
                          : "destructive"
                    }
                  >
                    {selectedRegistration.status.charAt(0).toUpperCase() + selectedRegistration.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {selectedRegistration.status === "pending" && (
                <div className="flex justify-between mt-4">
                  <Button variant="outline" className="w-[48%]">
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button className="w-[48%] bg-green-600 hover:bg-green-700">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Verify
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

