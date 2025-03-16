"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useGetProfileQuery } from "@/redux/Service/profileApi";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Star, Bell, CreditCard, User, Shield, Crop } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { username } = useParams(); // Extract username from URL
  const { data: profile, error, isLoading } = useGetProfileQuery(username); // Fetch profile
  console.log(profile)

  if (isLoading) return <div className="text-center py-10">Loading profile...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error fetching profile.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="flex flex-col md:flex-row items-center gap-8 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <Avatar className="w-32 h-32">
            <AvatarImage src={profile?.data.image || "/profile.jpg"} alt="Profile" />
            <AvatarFallback>{profile?.data.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            size="sm"
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
          >
            <User className="w-4 h-4 mr-2" />
            Change Photo
          </Button>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-green-900 mb-2">{profile?.data.name || "N/A"}</h1>
          <p className="text-brown-700">Username: {profile?.data?.user.username}</p>
          <p className="text-brown-700 mb-1">Phone no.: +91{profile?.data.phoneno || "N/A"}</p>
          <p className="text-brown-700">Address: {profile?.data.address || "N/A"}</p>

          <div className="flex gap-4 mt-4">
            <Button className="bg-green-600 hover:bg-green-700">
              <User className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => router.push("/your-crops")}
            >
              <Crop className="w-4 h-4 mr-2" />
              Your Crops
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Tabbed Navigation */}
      <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="contracts">
            <FileText className="w-4 h-4 mr-2" />
            Contracts
          </TabsTrigger>
          <TabsTrigger value="documents">
            <Shield className="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <Star className="w-4 h-4 mr-2" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="w-4 h-4 mr-2" />
            Payments
          </TabsTrigger>
        </TabsList>

        {/* Contracts Tab */}
        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
              <CardDescription>Manage your ongoing and past contracts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">Contract #12345</h3>
                          <p className="text-sm text-brown-700">Buyer: Green Farms Co.</p>
                          <p className="text-sm text-brown-700">Duration: 6 Months</p>
                        </div>
                        <Badge variant="outline">Ongoing</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Secure Documents</CardTitle>
              <CardDescription>Upload, view, and download encrypted files.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="bg-green-600 hover:bg-green-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((_, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <FileText className="w-6 h-6 text-green-600" />
                          <div>
                            <h3 className="font-semibold">Agreement.pdf</h3>
                            <p className="text-sm text-brown-700">Uploaded: 12/01/2024</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reviews & Complaints</CardTitle>
              <CardDescription>View feedback and submit complaints.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Star className="w-6 h-6 text-yellow-500" />
                      <div>
                        <h3 className="font-semibold">Rating: 4.5/5</h3>
                        <p className="text-sm text-brown-700">"Great experience working with John!"</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Button className="bg-green-600 hover:bg-green-700">
                  Submit Complaint
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>View transaction history and manage payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Transaction #12345</h3>
                        <p className="text-sm text-brown-700">Amount: ₹10,000</p>
                        <p className="text-sm text-brown-700">Status: Completed</p>
                      </div>
                      <Badge variant="outline">Paid</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Update Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notifications Panel */}
      <div className="fixed bottom-4 right-4">
        <Button className="rounded-full p-3 bg-green-600 hover:bg-green-700">
          <Bell className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
