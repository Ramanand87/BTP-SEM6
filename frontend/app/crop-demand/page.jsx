"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Trash, Edit, Loader2 } from "lucide-react";
import { useGetAllDemandsQuery, useAddDemandMutation, useUpdateDemandMutation, useDeleteDemandMutation } from "@/redux/Service/demandApi";

export default function DemandCropsPage() {
  const { data: demands = [], isLoading, isError, refetch } = useGetAllDemandsQuery();
  const [addDemand, { isLoading: isAdding }] = useAddDemandMutation();
  const [updateDemand, { isLoading: isUpdating }] = useUpdateDemandMutation();
  const [deleteDemand] = useDeleteDemandMutation(); // No global loading state
  const [deletingId, setDeletingId] = useState(null); // Track which item is being deleted

  const [editingDemand, setEditingDemand] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSave = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const newDemand = {
      crop_name: formData.get("crop_name"),
      crop_price: formData.get("crop_price"),
      crop_image: formData.get("crop_image") ? URL.createObjectURL(formData.get("crop_image")) : "", // File as URL (handle upload separately)
      contact_no: formData.get("contact_no"),
      quantity: formData.get("quantity"),
      description: formData.get("description"),
      location: formData.get("location"),
      harvested_time: formData.get("harvested_time"),
    };

    if (editingDemand) {
      console.log(newDemand)
      await updateDemand({ id: editingDemand.demand_id, updateData: newDemand }).unwrap();
      setEditingDemand(null);
    } else {
      await addDemand(newDemand).unwrap();
    }

    setOpenDialog(false);
    refetch();
  };

  const handleDelete = async (id) => {
    setDeletingId(id); // Track which item is being deleted
    await deleteDemand(id).unwrap();
    setDeletingId(null);
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-900 mb-8">Demand Crops</h1>

      {/* Add Demand Button */}
      <Dialog open={openDialog} onOpenChange={(isOpen) => {
        setOpenDialog(isOpen);
        if (!isOpen) setEditingDemand(null); // Reset on close
      }}>
        <DialogTrigger asChild>
          <Button className="mb-8 bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Demand
          </Button>
        </DialogTrigger>

        {/* Add/Edit Demand Modal */}
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingDemand ? "Edit Demand" : "Create Demand"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <Input name="crop_name" placeholder="Crop Name" defaultValue={editingDemand?.crop_name} required />
            <Input name="crop_price" placeholder="Price (₹)" defaultValue={editingDemand?.crop_price} required />
            
            {/* File input for Image */}
            <Input name="crop_image" type="file" accept="image/*" />

            <Input name="contact_no" placeholder="Contact Number" defaultValue={editingDemand?.contact_no} required />
            <Input name="quantity" placeholder="Quantity" defaultValue={editingDemand?.quantity} required />
            <Input name="description" placeholder="Description" defaultValue={editingDemand?.description} required />
            <Input name="location" placeholder="Location" defaultValue={editingDemand?.location} required />
            
            {/* Date Input for Harvested Time */}
            <Input name="harvested_time" type="date" defaultValue={editingDemand?.harvested_time} required />

            <div className="flex gap-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isAdding || isUpdating}>
                {(isAdding || isUpdating) && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                {editingDemand ? "Save Changes" : "Create Demand"}
              </Button>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* List of Demands */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error fetching demands.</div>
        ) : (
          demands?.data.map((demand) => (
            <Card key={demand.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <img
                  src={demand.crop_image || "https://via.placeholder.com/300"}
                  alt={demand.crop_name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl">{demand.crop_name}</CardTitle>
                <div className="space-y-2 mt-4">
                  <p className="text-green-600 font-semibold">₹{demand.crop_price}</p>
                  <p className="text-sm text-gray-600">Quantity: {demand.quantity}</p>
                  <p className="text-sm text-gray-600">Contact: {demand.contact_no}</p>
                  <p className="text-sm text-gray-600">Location: {demand.location}</p>
                  <p className="text-sm text-gray-600">Harvested: {demand.harvested_time}</p>
                  <p className="text-gray-700">{demand.description}</p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingDemand(demand);
                    setOpenDialog(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(demand.demand_id)}>
                  {deletingId === demand.demand_id ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Trash className="w-4 h-4 mr-2" />}
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
