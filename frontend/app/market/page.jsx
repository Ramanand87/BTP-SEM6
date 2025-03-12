"use client"; // Required for client-side interactivity

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, List, Grid } from "lucide-react";
import Link from "next/link";

const crops = [
  {
    crop_id: 1,
    crop_name: "Organic Tomatoes",
    publisher: "John Doe",
    crop_image: "https://drearth.com/wp-content/uploads/tomato-iStock-174932787.jpg",
    crop_price: 50,
    quantity: "100 kg",
    description: "Fresh organic tomatoes, grown without pesticides.",
  },
  {
    crop_id: 2,
    crop_name: "Basmati Rice",
    publisher: "Green Valley Farms",
    crop_image: "https://kj1bcdn.b-cdn.net/media/31514/basmati.jpg",
    crop_price: 30,
    quantity: "500 kg",
    description: "High-quality basmati rice, perfect for export.",
  },
  {
    crop_id: 3,
    crop_name: "Alphonso Mangoes",
    publisher: "Mango King",
    crop_image: "https://www.tripsavvy.com/thmb/g3helIwN2IUykkj_NHteMnK1mPQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-852133484-5ad41c4cfa6bcc0036af1a4d.jpg",
    crop_price: 80,
    quantity: "200 kg",
    description: "Sweet and juicy Alphonso mangoes, hand-picked.",
  },
];

export default function MarketPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  const filteredCrops = crops
    .filter((crop) =>
      crop.crop_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((crop) => crop.crop_price >= priceRange[0] && crop.crop_price <= priceRange[1])
    .sort((a, b) => {
      if (sortBy === "lowest") return a.crop_price - b.crop_price;
      if (sortBy === "highest") return b.crop_price - a.crop_price;
      return 0;
    });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search crops..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="lowest">Lowest Price</SelectItem>
            <SelectItem value="highest">Highest Price</SelectItem>
          </SelectContent>
        </Select>

        
      </div>

      {/* Price Range Filter */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span>Price Range</span>
          <span>₹{priceRange[0]} - ₹{priceRange[1]}</span>
        </div>
        <Slider
          defaultValue={[0, 100]}
          min={0}
          max={100}
          step={1}
          onValueChange={setPriceRange}
        />
      </div>

      {/* Crop Listings */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-3 gap-6" : "space-y-6"}>
        {filteredCrops.map((crop) => (

<Link key={crop.crop_id} href={`/crop/${crop.crop_id}`}> 
          <Card key={crop.crop_id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <img
                src={crop.crop_image}
                alt={crop.crop_name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl">{crop.crop_name}</CardTitle>
              <CardDescription className="mt-2">
                <span className="block text-green-600 font-semibold">₹{crop.crop_price}/kg</span>
                <span className="block text-sm text-gray-600">{crop.quantity}</span>
                <span className="block text-sm text-gray-600">Seller: {crop.publisher}</span>
              </CardDescription>
              <p className="mt-4 text-sm text-gray-700">{crop.description}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Contact Seller
              </Button>
            </CardFooter>
          </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}