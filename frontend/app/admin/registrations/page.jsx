import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentRegistrations } from "@/components/admin/recent-registrations"

export default function RegistrationsPage() {
  return (
    <div className="flex flex-col gap-4  px-12 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Aadhaar Registrations</h1>
        <div className="flex items-center gap-2">
          <Input placeholder="Search registrations..." className="w-[250px]" />
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
              <RecentRegistrations />
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
              <RecentRegistrations verified={true} />
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
              <RecentRegistrations rejected={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

