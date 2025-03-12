"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Trash, Edit, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const initialCrops = [
  {
    id: 1,
    name: "Organic Tomatoes",
    publisher: "Ramanand",
    image: "/tomatoes.jpg",
    price: 50,
    quantity: "100 kg",
    description: "Fresh organic tomatoes, grown without pesticides.",
    location: "Green Valley Farms, Maharashtra",
    harvested_time: "2024-01-15",
  },
  {
    id: 2,
    name: "Basmati Rice",
    publisher: "Ramanand",
    image: "/rice.jpg",
    price: 30,
    quantity: "500 kg",
    description: "High-quality basmati rice, perfect for export.",
    location: "Green Valley Farms, Maharashtra",
    harvested_time: "2024-02-01",
  },
];

export default function YourCropsPage() {
  const [crops, setCrops] = useState(initialCrops);
  const [editingCrop, setEditingCrop] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleDelete = (id) => {
    setCrops(crops.filter((crop) => crop.id !== id));
  };

  const handleSave = (crop) => {
    if (editingCrop) {
      setCrops(crops.map((c) => (c.id === crop.id ? crop : c)));
      setEditingCrop(null);
    } else {
      setCrops([...crops, { ...crop, id: Date.now() }]);
    }
    setIsAdding(false);
  };

  const formatHarvestedTime = (date) => {
    const harvestedDate = new Date(date);
    const currentDate = new Date();
    const diffInMonths = (currentDate.getFullYear() - harvestedDate.getFullYear()) * 12 + (currentDate.getMonth() - harvestedDate.getMonth());
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-900 mb-8">Your Crops</h1>

      {/* Add/Edit Crop Form */}
      {(isAdding || editingCrop) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingCrop ? "Edit Crop" : "Add New Crop"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newCrop = {
                  id: editingCrop?.id || Date.now(),
                  name: formData.get("name"),
                  publisher: "Ramanand", // Auto-fill with logged-in farmer's name
                  image: formData.get("image"),
                  price: parseFloat(formData.get("price")),
                  quantity: formData.get("quantity"),
                  description: formData.get("description"),
                  location: formData.get("location"),
                  harvested_time: formData.get("harvested_time"),
                };
                handleSave(newCrop);
              }}
              className="space-y-4"
            >
              <Input name="name" placeholder="Crop Name" defaultValue={editingCrop?.name} required />
              <Input name="image" placeholder="Image URL" defaultValue={editingCrop?.image} required />
              <Input name="price" type="number" placeholder="Price (₹/kg)" defaultValue={editingCrop?.price} required />
              <Input name="quantity" placeholder="Quantity" defaultValue={editingCrop?.quantity} required />
              <Input name="description" placeholder="Description" defaultValue={editingCrop?.description} required />
              <Input name="location" placeholder="Location" defaultValue={editingCrop?.location} required />
              <Input name="harvested_time" type="date" placeholder="Harvested Time" defaultValue={editingCrop?.harvested_time} required />
              <div className="flex gap-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingCrop ? "Save Changes" : "Add Crop"}
                </Button>
                <Button variant="outline" onClick={() => { setEditingCrop(null); setIsAdding(false); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Add Crop Button */}
      {!isAdding && !editingCrop && (
        <Button className="mb-8 bg-green-600 hover:bg-green-700" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Crop
        </Button>
      )}

      {/* List of Crops */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => (
          <Card key={crop.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <img
                src={crop.image}
                alt={crop.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl">{crop.name}</CardTitle>
              <div className="space-y-2 mt-4">
                <p className="text-green-600 font-semibold">₹{crop.price}/kg</p>
                <p className="text-sm text-gray-600">Quantity: {crop.quantity}</p>
                <p className="text-sm text-gray-600">Location: {crop.location}</p>
                <p className="text-sm text-gray-600">Harvested: {formatHarvestedTime(crop.harvested_time)}</p>
                <p className="text-gray-700">{crop.description}</p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setEditingCrop(crop)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(crop.id)}
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}