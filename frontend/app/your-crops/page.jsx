"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Trash, Edit, Plus, Loader2 } from "lucide-react";
import { useGetCropsQuery, useAddCropMutation, useUpdateCropMutation, useDeleteCropMutation } from "@/redux/Service/cropApi";

export default function YourCropsPage() {
  const { data: crops = [], isLoading, isError } = useGetCropsQuery();
  const [addCrop, { isLoading: isAdding }] = useAddCropMutation();
  const [updateCrop, { isLoading: isUpdating }] = useUpdateCropMutation();
  const [deleteCrop, { isLoading: isDeleting }] = useDeleteCropMutation();

  const [editingCrop, setEditingCrop] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    await deleteCrop(id);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    const newCrop = Object.fromEntries(formData.entries());

    if (editingCrop) {
      await updateCrop({ id: editingCrop.crop_id, body: newCrop }).unwrap();
      setEditingCrop(null);
    } else {
      await addCrop(newCrop).unwrap();
    }

    setOpenDialog(false);
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-900 mb-8">Your Crops</h1>

      {/* Add Crop Button */}
      <Dialog open={openDialog} onOpenChange={(isOpen) => {
        setOpenDialog(isOpen);
        if (!isOpen) setEditingCrop(null); // Reset on close
      }}>
        <DialogTrigger asChild>
          <Button className="mb-8 bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Crop
          </Button>
        </DialogTrigger>

        {/* Add/Edit Crop Modal */}
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCrop ? "Edit Crop" : "Add New Crop"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <Input name="crop_name" placeholder="Crop Name" defaultValue={editingCrop?.crop_name} required />
            <Input name="crop_image" type="file" placeholder="Crop Image" />
            <Input name="crop_price" type="number" placeholder="Price (₹/kg)" defaultValue={editingCrop?.crop_price} required />
            <Input name="quantity" placeholder="Quantity" defaultValue={editingCrop?.quantity} required />
            <Input name="Description" placeholder="Description" defaultValue={editingCrop?.Description} required />
            <Input name="location" placeholder="Location" defaultValue={editingCrop?.location} required />
            <Input name="harvested_time" type="date" placeholder="Harvested Time" defaultValue={editingCrop?.harvested_time} required />

            <div className="flex gap-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                {editingCrop ? "Save Changes" : "Add Crop"}
              </Button>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* List of Crops */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error fetching crops.</div>
        ) : (
          crops.map((crop) => (
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
                  <p className="text-gray-700">{crop.Description}</p>                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingCrop(crop);
                    setOpenDialog(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(crop.crop_id)}>
                  {isDeleting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Trash className="w-4 h-4 mr-2" />}
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
