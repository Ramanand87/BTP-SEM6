"use client"; // Required for client-side interactivity

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const cropDetails = {
  crop_id: 1,
  crop_name: "Organic Tomatoes",
  publisher: "John Doe",
  crop_image: "https://drearth.com/wp-content/uploads/tomato-iStock-174932787.jpg",
  crop_price: 50,
  quantity: "100 kg",
  description: "Fresh organic tomatoes, grown without pesticides.",
  market_price: "₹45/kg (average)",
  location: "Green Valley Farms, Maharashtra",
  harvested_time: "Harvested 2 weeks ago",
};

export default function CropDetailsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-2">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Market
      </Button>

      {/* Crop Details Card */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <img
            src={cropDetails.crop_image}
            alt={cropDetails.crop_name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <CardTitle className="text-3xl">{cropDetails.crop_name}</CardTitle>
          <div className="space-y-2">
            <p className="text-green-600 font-semibold">₹{cropDetails.crop_price}/kg</p>
            <p className="text-sm text-gray-600">Quantity: {cropDetails.quantity}</p>
            <p className="text-sm text-gray-600">Seller: {cropDetails.publisher}</p>
          </div>
          <p className="text-gray-700">{cropDetails.description}</p>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Market Price</p>
              <p className="font-semibold">{cropDetails.market_price}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold">{cropDetails.location}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Harvested Time</p>
              <p className="font-semibold">{cropDetails.harvested_time}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button variant="outline" className="flex-1">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Seller
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}