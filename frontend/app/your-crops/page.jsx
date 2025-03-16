"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Trash, Edit, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetCropsQuery,  useAddCropMutation, useUpdateCropMutation, useDeleteCropMutation } from "@/redux/Service/cropApi";

export default function YourCropsPage() {
  const { data: crops = [], isLoading, isError } = useGetCropsQuery();
  console.log('crops:', crops)
  const [addCrop] = useAddCropMutation();
  const [updateCrop] = useUpdateCropMutation();
  const [deleteCrop] = useDeleteCropMutation();
  const [editingCrop, setEditingCrop] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleDelete = async (id) => {
    await deleteCrop(id);
  };

  const handleSave = async (crop) => {
    const formData = new FormData();
    formData.append("crop_name", crop.crop_name);
    formData.append("crop_image", crop.crop_image);
    formData.append("crop_price", crop.crop_price);
    formData.append("quantity", crop.quantity);
    formData.append("Description", crop.Description);
    formData.append("harvested_time", crop.harvested_time);
    formData.append("location", crop.location);

    if (editingCrop) {
      await updateCrop({ id: editingCrop.crop_id, body: formData }).unwrap();
      setEditingCrop(null);
    } else {
      console.log('formdata',formData)
      await addCrop(formData).unwrap();
    }
    setIsAdding(false);
  };

  const formatHarvestedTime = (date) => {
    const harvestedDate = new Date(date);
    const currentDate = new Date();
    const diffInMonths = (currentDate.getFullYear() - harvestedDate.getFullYear()) * 12 + (currentDate.getMonth() - harvestedDate.getMonth());
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching crops. Backend might be offline.</div>;

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
                  crop_name: formData.get("crop_name"),
                  crop_image: formData.get("crop_image"),
                  crop_price: parseFloat(formData.get("crop_price")),
                  quantity: formData.get("quantity"),
                  Description: formData.get("Description"),
                  location: formData.get("location"),
                  harvested_time: formData.get("harvested_time"),
                };
                handleSave(newCrop);
              }}
              className="space-y-4"
              encType="multipart/form-data"
            >
              <Input name="crop_name" placeholder="Crop Name" defaultValue={editingCrop?.crop_name} required />
              <Input name="crop_image" type="file" placeholder="Crop Image" required />
              <Input name="crop_price" type="number" placeholder="Price (₹/kg)" defaultValue={editingCrop?.crop_price} required />
              <Input name="quantity" placeholder="Quantity" defaultValue={editingCrop?.quantity} required />
              <Input name="Description" placeholder="Description" defaultValue={editingCrop?.Description} required />
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
        {crops?.map((crop) => (
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
              <div className="space-y-2 mt-4">
                <p className="text-green-600 font-semibold">₹{crop.crop_price}/kg</p>
                <p className="text-sm text-gray-600">Quantity: {crop.quantity}</p>
                <p className="text-sm text-gray-600">Location: {crop.location}</p>
                <p className="text-sm text-gray-600">Harvested: {formatHarvestedTime(crop.harvested_time)}</p>
                <p className="text-gray-700">{crop.Description}</p>
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
                onClick={() => handleDelete(crop.crop_id)}
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