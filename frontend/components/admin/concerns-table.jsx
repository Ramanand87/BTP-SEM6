"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

// Sample data - in a real app, this would come from your API
const concerns = [
  {
    id: "CON-001",
    raisedBy: "Rajesh Kumar",
    userType: "Farmer",
    concernType: "Payment Delay",
    raisedOn: "2023-04-01",
    status: "pending",
    description: "Payment for the last harvest has been delayed by more than 30 days.",
  },
  {
    id: "CON-002",
    raisedBy: "Aditya Mehta",
    userType: "Contractor",
    concernType: "Quality Issue",
    raisedOn: "2023-04-02",
    status: "pending",
    description: "The quality of the wheat delivered does not meet the agreed standards.",
  },
  {
    id: "CON-003",
    raisedBy: "Priya Sharma",
    userType: "Farmer",
    concernType: "Contract Breach",
    raisedOn: "2023-04-03",
    status: "inProgress",
    description: "The contractor is not honoring the agreed price in the contract.",
  },
  {
    id: "CON-004",
    raisedBy: "Neha Gupta",
    userType: "Contractor",
    concernType: "Delivery Delay",
    raisedOn: "2023-04-04",
    status: "inProgress",
    description: "The farmer has not delivered the crop as per the agreed schedule.",
  },
  {
    id: "CON-005",
    raisedBy: "Vikram Singh",
    userType: "Farmer",
    concernType: "Payment Dispute",
    raisedOn: "2023-04-05",
    status: "resolved",
    description: "There is a discrepancy in the payment amount received.",
  },
]



export function ConcernsTable({ status }) {
  const [selectedConcern, setSelectedConcern] = useState(null)
  const [open, setOpen] = useState(false)

  // Filter concerns based on status
  const filteredConcerns = concerns.filter((concern) => concern.status === status)

  const handleView = (concerny) => {
    setSelectedConcern(concern)
    setOpen(true)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Raised By</TableHead>
            <TableHead>User Type</TableHead>
            <TableHead>Concern Type</TableHead>
            <TableHead>Raised On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredConcerns.map((concern) => (
            <TableRow key={concern.id}>
              <TableCell className="font-medium">{concern.id}</TableCell>
              <TableCell>{concern.raisedBy}</TableCell>
              <TableCell>
                <Badge variant={concern.userType === "Farmer" ? "outline" : "secondary"}>{concern.userType}</Badge>
              </TableCell>
              <TableCell>{concern.concernType}</TableCell>
              <TableCell>{concern.raisedOn}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    concern.status === "pending"
                      ? "destructive"
                      : concern.status === "inProgress"
                        ? "outline"
                        : "success"
                  }
                >
                  {concern.status === "pending"
                    ? "Pending"
                    : concern.status === "inProgress"
                      ? "In Progress"
                      : "Resolved"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleView(concern)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Concern Details</DialogTitle>
            <DialogDescription>Complete information about the concern.</DialogDescription>
          </DialogHeader>
          {selectedConcern && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">ID:</div>
                <div className="col-span-3">{selectedConcern.id}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Raised By:</div>
                <div className="col-span-3">{selectedConcern.raisedBy}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">User Type:</div>
                <div className="col-span-3">
                  <Badge variant={selectedConcern.userType === "Farmer" ? "outline" : "secondary"}>
                    {selectedConcern.userType}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Concern Type:</div>
                <div className="col-span-3">{selectedConcern.concernType}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Raised On:</div>
                <div className="col-span-3">{selectedConcern.raisedOn}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-3">
                  <Badge
                    variant={
                      selectedConcern.status === "pending"
                        ? "destructive"
                        : selectedConcern.status === "inProgress"
                          ? "outline"
                          : "success"
                    }
                  >
                    {selectedConcern.status === "pending"
                      ? "Pending"
                      : selectedConcern.status === "inProgress"
                        ? "In Progress"
                        : "Resolved"}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="font-medium">Description:</div>
                <div className="col-span-3">{selectedConcern.description}</div>
              </div>

              {selectedConcern.status !== "resolved" && (
                <>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <div className="font-medium">Response:</div>
                    <div className="col-span-3">
                      <Textarea placeholder="Enter your response to this concern..." />
                    </div>
                  </div>
                  <DialogFooter>
                    {selectedConcern.status === "pending" && (
                      <Button variant="outline" className="mr-2">
                        Mark as In Progress
                      </Button>
                    )}
                    {selectedConcern.status === "inProgress" && (
                      <Button variant="outline" className="mr-2">
                        Mark as Resolved
                      </Button>
                    )}
                    <Button className="bg-green-600 hover:bg-green-700">Send Response</Button>
                  </DialogFooter>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

