"use client"; // Required for client-side interactivity

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, List, Grid } from "lucide-react";
import { Plus, Trash, Edit, Loader2, Calendar, MapPin, Phone, Package, DollarSign } from "lucide-react"

import Link from "next/link";
import { useGetAllCropsQuery } from "@/redux/Service/marketApi";

export default function MarketPage() {
  const { data: allCrops, isError, isLoading } = useGetAllCropsQuery();
  console.log('getallcrops', allCrops);
  const crops=allCrops?.data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Crop List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error fetching crops.</div>
        ) : (
          crops?.map((crop) => (
            <Link href={`/crop/${crop.crop_id}`} key={crop.crop_id} >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <img src={crop.crop_image} alt={crop.crop_name} className="w-full h-48 object-cover rounded-lg" />
              </CardHeader>
              <CardContent className="pt-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <CardTitle className="text-2xl text-green-800">{crop.crop_name}</CardTitle>
                  <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                   ₹{crop.crop_price}
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-start">
                    <Package className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Quantity: <span className="font-medium">{crop.quantity}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Contact: <span className="font-medium">{crop.publisher_profile.phoneno}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Location: <span className="font-medium">{crop.location}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Harvested: <span className="font-medium">{crop.harvested_time}</span>
                    </p>
                  </div>

                  <div className="pt-2">
                    <p className="text-gray-700 line-clamp-2">{crop.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card></Link>
          ))
        )}
      </div>
    </div>
  );
}