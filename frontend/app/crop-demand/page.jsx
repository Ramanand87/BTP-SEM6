"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash, Edit, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const initialDemands = [
  {
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
  },
  {
    id: 2,
    name: "Basmati Rice",
    publisher: "Buyer B",
    image: "https://kj1bcdn.b-cdn.net/media/31514/basmati.jpg",
    priceRange: "₹25 - ₹35/kg",
    contactNumber: "+91 98765 12345",
    quantity: "1000 kg",
    description: "Need high-quality basmati rice for export.",
    location: "Anywhere",
    harvestedTime: "Harvested within 2 months",
  },
];

export default function DemandCropsPage() {
  const [demands, setDemands] = useState(initialDemands);
  const [editingDemand, setEditingDemand] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const router = useRouter();

  const handleDelete = (id) => {
    setDemands(demands.filter((demand) => demand.id !== id));
  };

  const handleSave = (demand) => {
    if (editingDemand) {
      setDemands(demands.map((d) => (d.id === demand.id ? demand : d)));
      setEditingDemand(null);
    } else {
      setDemands([...demands, { ...demand, id: Date.now() }]);
    }
    setIsAdding(false);
  };

  const filteredDemands = demands
    .filter((demand) =>
      demand.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((demand) =>
      locationFilter === "all" ? true : demand.location.toLowerCase().includes(locationFilter.toLowerCase())
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-900 mb-8">Demand Crops</h1>

      {/* Search and Filter Bar */}
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

        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="within 50 km">Within 50 km</SelectItem>
            <SelectItem value="anywhere">Anywhere</SelectItem>
          </SelectContent>
        </Select>

        <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Demand
        </Button>
      </div>

      {/* Add/Edit Demand Form */}
      {(isAdding || editingDemand) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingDemand ? "Edit Demand" : "Create Demand"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newDemand = {
                  id: editingDemand?.id || Date.now(),
                  name: formData.get("name"),
                  publisher: formData.get("publisher"),
                  image: formData.get("image"),
                  priceRange: formData.get("priceRange"),
                  contactNumber: formData.get("contactNumber"),
                  quantity: formData.get("quantity"),
                  description: formData.get("description"),
                  location: formData.get("location"),
                  harvestedTime: formData.get("harvestedTime"),
                };
                handleSave(newDemand);
              }}
              className="space-y-4"
            >
              <Input name="name" placeholder="Crop Name" defaultValue={editingDemand?.name} required />
              <Input name="publisher" placeholder="Your Name" defaultValue={editingDemand?.publisher} required />
              <Input name="image" placeholder="Image URL" defaultValue={editingDemand?.image} required />
              <Input name="priceRange" placeholder="Price Range (e.g., ₹40 - ₹60/kg)" defaultValue={editingDemand?.priceRange} required />
              <Input name="contactNumber" placeholder="Contact Number" defaultValue={editingDemand?.contactNumber} required />
              <Input name="quantity" placeholder="Quantity" defaultValue={editingDemand?.quantity} required />
              <Input name="description" placeholder="Description" defaultValue={editingDemand?.description} required />
              <Input name="location" placeholder="Location (e.g., Within 50 km or Anywhere)" defaultValue={editingDemand?.location} required />
              <Input name="harvestedTime" placeholder="Harvested Time (e.g., Harvested within 1 month)" defaultValue={editingDemand?.harvestedTime} required />
              <div className="flex gap-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingDemand ? "Save Changes" : "Create Demand"}
                </Button>
                <Button variant="outline" onClick={() => { setEditingDemand(null); setIsAdding(false); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List of Demands */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDemands.map((demand) => (
            <Link key={demand.id} href={`/demand/${demand.id}`}> 
          <Card
            key={demand.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/demand-crops/${demand.id}`)}
          >
            <CardHeader>
              <img
                src={demand.image}
                alt={demand.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl">{demand.name}</CardTitle>
              <div className="space-y-2 mt-4">
                <p className="text-green-600 font-semibold">{demand.priceRange}</p>
                <p className="text-sm text-gray-600">Quantity: {demand.quantity}</p>
                <p className="text-sm text-gray-600">Contact: {demand.contactNumber}</p>
                <p className="text-sm text-gray-600">Location: {demand.location}</p>
                <p className="text-sm text-gray-600">Harvested: {demand.harvestedTime}</p>
                <p className="text-gray-700">{demand.description}</p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingDemand(demand);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(demand.id);
                }}
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}