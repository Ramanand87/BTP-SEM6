"use client"; // Required for client-side interactivity

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, List, Grid } from "lucide-react";
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
            <Link href={`/crop/${crop.crop_id}`}>
            <Card key={crop.crop_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <img src={crop.crop_image} alt={crop.crop_name} className="w-full h-48 object-cover rounded-lg" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl">{crop.crop_name}</CardTitle>
                <div className="space-y-2 mt-4">
                  <p className="text-green-600 font-semibold">₹{crop.crop_price}/kg</p>
                  <p className="text-sm text-gray-600">Quantity: {crop.quantity} Kg</p>
                  <p className="text-sm text-gray-600">Location: {crop.location}</p>
                  <p className="text-sm text-gray-600">Harvested: {crop.harvested_time}</p>
                  <p className="text-gray-700">{crop.Description}</p>
                </div>
              </CardContent>
            </Card></Link>
          ))
        )}
      </div>
    </div>
  );
}