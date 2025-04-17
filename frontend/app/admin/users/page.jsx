"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { AllUsers } from "@/components/admin/users-table"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex flex-col gap-4 px-12 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Aadhaar Registrations</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search registrations..."
            className="w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button>Search</Button>
        </div>
      </div>
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Verification</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Verification</CardTitle>
              <CardDescription>Review and verify the Aadhaar details of recently registered users.</CardDescription>
            </CardHeader>
            <CardContent>
              <AllUsers status="pending" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="verified" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verified Registrations</CardTitle>
              <CardDescription>All users with verified Aadhaar details.</CardDescription>
            </CardHeader>
            <CardContent>
              <AllUsers status="verified" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Registrations</CardTitle>
              <CardDescription>
                Registrations that were rejected due to invalid or suspicious Aadhaar details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AllUsers status="rejected" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}