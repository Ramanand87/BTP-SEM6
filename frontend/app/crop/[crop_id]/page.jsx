"use client"; // Required for client-side interactivity

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useGetSingleCropQuery } from "@/redux/Service/marketApi";
import { ArrowLeft, ShoppingCart, MessageCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";



export default function CropDetailsPage() {
  const router = useRouter();
  const  {crop_id}  = useParams(); // Extract id from useParams()



const { data: crop, error, isLoading } = useGetSingleCropQuery(crop_id); // Pass the correct id


  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading crop data.</p>;

  return (
    <div className="container mx-auto px-4 py-2">
      {/* Back Button */}
      <Button variant="ghost" className="mb-2" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Market
      </Button>

      {/* Crop Details Card */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <img
            src={crop?.data.crop_image}
            alt={crop?.data.crop_name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <CardTitle className="text-3xl">{crop?.data.crop_name}</CardTitle>
          <div className="space-y-2">
            <p className="text-green-600 font-semibold">₹{crop?.data.crop_price}/kg</p>
            <p className="text-sm text-gray-600">Quantity: {crop?.data.quantity}</p>
            <p className="text-sm text-gray-600">Seller: {crop?.data.publisher_profile.name}</p>
          </div>
          <p className="text-gray-700">{crop?.description}</p>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Market Price</p>
              <p className="font-semibold">{crop?.market_price}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold">{crop?.data.location}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Harvested Time</p>
              <p className="font-semibold">{crop?.data.harvested_time}</p>
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
