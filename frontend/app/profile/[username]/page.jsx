"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useGetProfileQuery } from "@/redux/Service/profileApi";
import {
  useGetRatingQuery,
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useUpdateRatingMutation, // Import update mutation
} from "@/redux/Service/ratingApi";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Star,
  Bell,
  CreditCard,
  User,
  Shield,
  Crop,
  Trash,
  Edit,
} from "lucide-react"; // Import Edit icon
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useCreateRoomMutation, useGetRoomsQuery } from "@/redux/Service/chatApi";

export default function ProfilePage() {
  const router = useRouter();
  const { username } = useParams(); // Extract username from URL
  const { data: profile, error, isLoading } = useGetProfileQuery(username); // Fetch profile
  const { data: ratings, refetch: refetchRatings } =
    useGetRatingQuery(username); // Fetch ratings
  const [createRating] = useCreateRatingMutation();
  const [deleteRating] = useDeleteRatingMutation();
  const [updateRating] = useUpdateRatingMutation(); // Add update mutation
  const { data: rooms,isError } = useGetRoomsQuery();
  const [createRoom] = useCreateRoomMutation();

  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [hasRated, setHasRated] = useState(false); // Track if the user has already rated
  const [editingRatingId, setEditingRatingId] = useState(null); // Track which rating is being edited
  const userInfo = useSelector((state) => state.auth.userInfo);
  const currentUser = userInfo?.data.username;
  const handleChatClick = async () => {
    if (rooms?.data?.some((room) => room.chat_user === username)) {
      router.push(`/chat/${username}`);
    } else {
      try {
        const response = await createRoom(username).unwrap();
        console.log("Room created:", response);
        router.push(`/chat/${username}`);
      } catch (error) {
        console.error("Error creating room:", error);
      }
    }
  };
  
  // Check if the current user has already rated the profile user
  useEffect(() => {
    if (ratings) {
      const currentUser = userInfo?.data.username;
      const hasRated =
        ratings.data.some((r) => r.rating_user === currentUser) ||
        username == currentUser;
      setHasRated(hasRated);
    }
  }, [ratings]);

  const handleRatingSubmit = async () => {
    const imageToSend = images[0]; // Send only the first image

    const formData = new FormData();
    formData.append("rated_user", username);
    formData.append("description", description);
    formData.append("rate", rating);
    if (imageToSend) {
      formData.append("images", imageToSend); // Append the image file
    }

    console.log("FormData:", formData); // Debug the FormData

    try {
      await createRating({ ratingData: formData }).unwrap();
      refetchRatings();
      setRating(0); // Reset rating
      setDescription(""); // Reset description
      setImages([]); // Reset images
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files.length > 1) {
      alert("Only one image can be uploaded. The first image will be used.");
    }
    setImages([files[0]]); // Store only the first image
  };

  // Handle delete rating
  const handleDeleteRating = async (ratingId) => {
    try {
      await deleteRating(ratingId).unwrap(); // Call delete mutation
      refetchRatings(); // Refetch ratings after deletion
    } catch (error) {
      console.error("Failed to delete rating:", error);
    }
  };

  // Handle update rating
  const handleUpdateRating = async (ratingId) => {
    const imageToSend = images[0]; // Send only the first image

    const updatedRatingData = {
      description,
      rate: rating,
      images: imageToSend, // Send a single image
    };

    console.log("Updated Rating Data:", updatedRatingData); // Debug the payload

    try {
      await updateRating({ ratingId, updatedRatingData }).unwrap(); // Call update mutation
      refetchRatings(); // Refetch ratings after update
      setEditingRatingId(null); // Reset editing state
      setRating(0); // Reset rating
      setDescription(""); // Reset description
      setImages([]); // Reset images
    } catch (error) {
      console.error("Failed to update rating:", error);
    }
  };

  if (isLoading)
    return <div className="text-center py-10">Loading profile...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error fetching profile.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="flex flex-col md:flex-row items-center gap-8 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <Avatar className="w-32 h-32">
            <AvatarImage
              src={profile?.data.image || "/profile.jpg"}
              alt="Profile"
            />
            <AvatarFallback>
              {profile?.data.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            size="sm"
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
          >
            <User className="w-4 h-4 mr-2" />
            Change Photo
          </Button>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-green-900 mb-2">
            {profile?.data.name || "N/A"}
          </h1>
          <p className="text-brown-700">
            Username: {profile?.data?.user.username}
          </p>
          <p className="text-brown-700 mb-1">
            Phone no.: +91{profile?.data.phoneno || "N/A"}
          </p>
          <p className="text-brown-700">
            Address: {profile?.data.address || "N/A"}
          </p>

          <div className="flex gap-4 mt-4">
            <Button className="bg-green-600 hover:bg-green-700">
              <User className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => router.push("/your-crops")}
            >
              <Crop className="w-4 h-4 mr-2" />
              Your Crops
            </Button>
            {currentUser !== username && (
        <Button onClick={handleChatClick} className="bg-green-600 hover:bg-green-700">
          Chat
        </Button>
      )}
          </div>
        </div>
      </motion.div>

      {/* Tabbed Navigation */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="documents">
            <Shield className="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="contracts">
            <FileText className="w-4 h-4 mr-2" />
            Contracts
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <Star className="w-4 h-4 mr-2" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="w-4 h-4 mr-2" />
            Payments
          </TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>View and manage your documents.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile?.data.aadhar_image && (
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <FileText className="w-6 h-6 text-green-600" />
                        <div>
                          <h3 className="font-semibold">Aadhar Card</h3>
                          <img
                            src={profile.data.aadhar_image}
                            alt="Aadhar Card"
                            className="w-32 h-32"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {profile?.data.screenshot && (
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <FileText className="w-6 h-6 text-green-600" />
                        <div>
                          <h3 className="font-semibold">Screenshot</h3>
                          <img
                            src={profile.data.screenshot}
                            alt="Screenshot"
                            className="w-32 h-32"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
              <CardDescription>
                Manage your ongoing and past contracts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">Contract #12345</h3>
                          <p className="text-sm text-brown-700">
                            Buyer: Green Farms Co.
                          </p>
                          <p className="text-sm text-brown-700">
                            Duration: 6 Months
                          </p>
                        </div>
                        <Badge variant="outline">Ongoing</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reviews & Ratings</CardTitle>
              <CardDescription>View and submit ratings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!hasRated && (
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-brown-700">
                            Rate (1-5)
                          </label>
                          <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  star <= rating
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-200 text-brown-700"
                                } hover:bg-green-700 hover:text-white transition-colors`}
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    star <= rating
                                      ? "fill-yellow-400 stroke-yellow-400"
                                      : "stroke-brown-700"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-brown-700">
                            Description
                          </label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write your review here..."
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 resize-none"
                            rows="4"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-brown-700">
                            Upload Image (Optional)
                          </label>
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-brown-700 rounded-lg cursor-pointer hover:border-green-600 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                              <span className="text-brown-700">+</span>
                            </label>
                            {images.length > 0 && (
                              <img
                                src={URL.createObjectURL(images[0])}
                                alt="Preview"
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            )}
                          </div>
                        </div>

                        <Button
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
                          onClick={handleRatingSubmit}
                        >
                          Submit Rating
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {ratings?.data.map((rating, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Star className="w-6 h-6 mt-1 text-yellow-500" />
                        <div>
                          <h3 className="font-semibold">
                            Rating: {rating.rate}/5
                          </h3>
                          <p className="text-sm text-brown-700">
                            {rating.description}
                          </p>
                          {rating.images && (
                            <img
                              src={rating.images}
                              alt="Rating Image"
                              className="w-32 h-32 mt-2 object-cover"
                            />
                          )}
                        </div>
                        {/* Add edit and delete buttons if the current user is the rating creator */}
                        {userInfo?.data.username === rating.rating_user && (
                          <div className="ml-auto flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => {
                                setEditingRatingId(rating.id);
                                setRating(rating.rate);
                                setDescription(rating.description);
                                setImages(rating.images ? [rating.images] : []);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteRating(rating.id)}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      {/* Edit form for the selected rating */}
                      {editingRatingId === rating.id && (
                        <div className="mt-4 space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-brown-700">
                              Rate (1-5)
                            </label>
                            <div className="flex items-center space-x-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    star <= rating
                                      ? "bg-green-600 text-white"
                                      : "bg-gray-200 text-brown-700"
                                  } hover:bg-green-700 hover:text-white transition-colors`}
                                >
                                  <Star
                                    className={`w-5 h-5 ${
                                      star <= rating
                                        ? "fill-yellow-400 stroke-yellow-400"
                                        : "stroke-brown-700"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-brown-700">
                              Description
                            </label>
                            <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Write your review here..."
                              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 resize-none"
                              rows="4"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-brown-700">
                              Upload Image (Optional)
                            </label>
                            <div className="flex items-center space-x-4">
                              <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-brown-700 rounded-lg cursor-pointer hover:border-green-600 transition-colors">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  className="hidden"
                                />
                                <span className="text-brown-700">+</span>
                              </label>
                              {images.length > 0 &&
                                images[0] instanceof File && (
                                  <img
                                    src={URL.createObjectURL(images[0])}
                                    alt="Preview"
                                    className="w-24 h-24 object-cover rounded-lg"
                                  />
                                )}
                            </div>
                          </div>

                          <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
                            onClick={() => handleUpdateRating(rating.id)}
                          >
                            Update Rating
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                View transaction history and manage payments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Transaction #12345</h3>
                        <p className="text-sm text-brown-700">
                          Amount: ₹10,000
                        </p>
                        <p className="text-sm text-brown-700">
                          Status: Completed
                        </p>
                      </div>
                      <Badge variant="outline">Paid</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Update Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
