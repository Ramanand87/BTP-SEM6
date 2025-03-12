"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { MessageCircle, Phone } from "lucide-react";

const demandDetails = {
  id: 1,
  name: "Organic Tomatoes",
  publisher: "Buyer A",
  image: "https://drearth.com/wp-content/uploads/tomato-iStock-174932787.jpg",
  priceRange: "₹40 - ₹60/kg",
  contactNumber: "+91 98765 43210",
  quantity: "200 kg",
  description: "Looking for fresh organic tomatoes for my restaurant.",
  location: "Within 50 km",
  harvestedTime: "Harvested within 1 month",
};

export default function DemandCropDetailsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        Back to Demands
      </Button>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <img
            src={demandDetails.image}
            alt={demandDetails.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <CardTitle className="text-3xl">{demandDetails.name}</CardTitle>
          <div className="space-y-2">
            <p className="text-green-600 font-semibold">{demandDetails.priceRange}</p>
            <p className="text-sm text-gray-600">Quantity: {demandDetails.quantity}</p>
            <p className="text-sm text-gray-600">Contact: {demandDetails.contactNumber}</p>
            <p className="text-sm text-gray-600">Location: {demandDetails.location}</p>
            <p className="text-sm text-gray-600">Harvested: {demandDetails.harvestedTime}</p>
          </div>
          <p className="text-gray-700">{demandDetails.description}</p>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat with Buyer
          </Button>
          <Button variant="outline" className="flex-1">
            <Phone className="w-4 h-4 mr-2" />
            Call Buyer
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}