"use client"

import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { useGetProfileQuery, useUpdateProfileMutation } from "@/redux/Service/profileApi"
import {
  useGetRatingQuery,
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useUpdateRatingMutation,
} from "@/redux/Service/ratingApi"
import { useGetAllContractsQuery } from "@/redux/Service/contract" 
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Star,
  CreditCard,
  User,
  Shield,
  Crop,
  Trash2,
  Edit,
  Camera,
  MapPin,
  PhoneIcon,
  Calendar,
  CheckCircle,
  Clock,
  ArrowLeft,
  MessageSquare,
  ImageIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { useCreateRoomMutation, useGetRoomsQuery } from "@/redux/Service/chatApi"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Webcam from "react-webcam"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  const { username } = useParams()
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const { data: profile, error, isLoading, refetch } = useGetProfileQuery(username)
  const { data: ratings, refetch: refetchRatings } = useGetRatingQuery(username)
  const { data: contracts } = useGetAllContractsQuery()
  const [updateProfile] = useUpdateProfileMutation()
  const [createRating] = useCreateRatingMutation()
  const [deleteRating] = useDeleteRatingMutation()
  const [updateRating] = useUpdateRatingMutation()
  const { data: rooms } = useGetRoomsQuery()
  const [createRoom] = useCreateRoomMutation()

  const [rating, setRating] = useState(0)
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])
  const [hasRated, setHasRated] = useState(false)
  const [editingRatingId, setEditingRatingId] = useState(null)
  const userInfo = useSelector((state) => state.auth.userInfo)
  const currentUser = userInfo?.data.username
  const userRole = userInfo?.role

  // Edit Profile State
  const [editOpen, setEditOpen] = useState(false)
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [profilePic, setProfilePic] = useState("")
  const webcamRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)

  const handleEditClick = () => {
    setPhone(profile?.data.phoneno || "")
    setAddress(profile?.data.address || "")
    setProfilePic(profile?.data.image || "")
    setEditOpen(true)
  }

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setProfilePic(imageSrc)
  }

  const handleProfileSubmit = async () => {
    setIsUpdatingProfile(true) // Start loading
    try {
      const data = new FormData()
      data.append("phoneno", phone)
      data.append("address", address)

      // Convert base64 to File object if it's a data URI
      if (profilePic && profilePic.startsWith("data:image")) {
        const blob = dataURItoBlob(profilePic)
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" })
        data.append("image", file)
      }

      await updateProfile(data).unwrap()
      refetch()
      setEditOpen(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsUpdatingProfile(false) // Stop loading regardless of success/error
    }
  }
  // Helper function to convert data URI to Blob
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1])
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }

    return new Blob([ab], { type: mimeString })
  }
  const handleChatClick = async () => {
    if (rooms?.data?.some((room) => room.chat_user === username)) {
      router.push(`/chat/${username}`)
    } else {
      try {
        await createRoom(username).unwrap()
        router.push(`/chat/${username}`)
      } catch (error) {
        console.error("Error creating room:", error)
      }
    }
  }

  // Check if the current user has already rated the profile user
  useEffect(() => {
    if (ratings) {
      const currentUser = userInfo?.data.username
      const hasRated = ratings.data.some((r) => r.rating_user === currentUser) || username == currentUser
      setHasRated(hasRated)
    }
  }, [ratings, userInfo, username])

  const handleRatingSubmit = async () => {
    const imageToSend = images[0] // Send only the first image

    const formData = new FormData()
    formData.append("rated_user", username)
    formData.append("description", description)
    formData.append("rate", rating)
    if (imageToSend) {
      formData.append("images", imageToSend) // Append the image file
    }

    try {
      await createRating({ ratingData: formData }).unwrap()
      refetchRatings()
      setRating(0) // Reset rating
      setDescription("") // Reset description
      setImages([]) // Reset images
    } catch (error) {
      console.error("Failed to submit rating:", error)
    }
  }

  const handleImageChange = (e) => {
    const files = e.target.files
    if (files.length > 1) {
      alert("Only one image can be uploaded. The first image will be used.")
    }
    setImages([files[0]]) // Store only the first image
  }

  // Handle delete rating
  const handleDeleteRating = async (ratingId) => {
    try {
      await deleteRating(ratingId).unwrap() // Call delete mutation
      refetchRatings() // Refetch ratings after deletion
    } catch (error) {
      console.error("Failed to delete rating:", error)
    }
  }

  // Handle update rating
  const handleUpdateRating = async (ratingId) => {
    const imageToSend = images[0] // Send only the first image

    const updatedRatingData = {
      description,
      rate: rating,
      images: imageToSend, // Send a single image
    }

    try {
      await updateRating({ ratingId, updatedRatingData }).unwrap() // Call update mutation
      refetchRatings() // Refetch ratings after update
      setEditingRatingId(null) // Reset editing state
      setRating(0) // Reset rating
      setDescription("") // Reset description
      setImages([]) // Reset images
    } catch (error) {
      console.error("Failed to update rating:", error)
    }
  }

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!ratings?.data || ratings.data.length === 0) return 0
    const sum = ratings.data.reduce((acc, curr) => acc + curr.rate, 0)
    return (sum / ratings.data.length).toFixed(1)
  }

  // Count ratings by star value
  const countRatingsByValue = (value) => {
    if (!ratings?.data) return 0
    return ratings.data.filter((r) => r.rate === value).length
  }

  // Calculate percentage for rating bar
  const calculateRatingPercentage = (value) => {
    if (!ratings?.data || ratings.data.length === 0) return 0
    return (countRatingsByValue(value) / ratings.data.length) * 100
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-green-800 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-50 to-white">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the profile you're looking for.</p>
          <Button onClick={() => router.back()} className="bg-red-600 hover:bg-red-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-16">
      {/* Back Navigation */}

      {/* Profile Header */}
      <div className="bg-white shadow-md mb-8">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            className="flex flex-col md:flex-row items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="rounded-full p-1 bg-gradient-to-r from-green-400 to-green-600">
                <Avatar className="w-32 h-32 border-4 border-white">
                  <AvatarImage src={profile?.data.image || "/profile.jpg"} alt="Profile" className="object-cover" />
                  <AvatarFallback className="bg-green-100 text-green-800 text-4xl">
                    {profile?.data.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              {currentUser === username && (
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white shadow-md hover:bg-green-50"
                  onClick={handleEditClick}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Change
                </Button>
              )}

              {/* Rating Badge */}
              {ratings?.data && ratings.data.length > 0 && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-10 h-10 flex items-center justify-center shadow-md border-2 border-white">
                  <div className="flex items-center">
                    <span className="font-bold text-xs">{calculateAverageRating()}</span>
                    <Star className="w-3 h-3 ml-0.5 fill-yellow-900" />
                  </div>
                </div>
              )}
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-green-800 mb-1">{profile?.data.name || "N/A"}</h1>
                  <p className="text-gray-600 mb-2">@{profile?.data?.user.username}</p>

                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex items-center text-gray-700">
                      <PhoneIcon className="w-4 h-4 mr-2 text-green-600" />
                      <span>+91 {profile?.data.phoneno || "N/A"}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      <span>{profile?.data.address || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-end mt-4 md:mt-0">
                  {profile.role && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">
                      {profile.role === "farmer" ? "Farmer" : "Contractor"}
                    </Badge>
                  )}
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">Verified</Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                {currentUser === username && (
                  <Button className="bg-green-600 hover:bg-green-700 shadow-sm" onClick={handleEditClick}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
                {userRole === "farmer" ? (
                  <Button
                    className="bg-green-600 hover:bg-green-700 shadow-sm"
                    onClick={() => router.push("/your-crops")}
                  >
                    <Crop className="w-4 h-4 mr-2" />
                    Your Crops
                  </Button>
                ) : (
                  <Button
                    className="bg-green-600 hover:bg-green-700 shadow-sm"
                    onClick={() => router.push("/crop-demand")}
                  >
                    <Crop className="w-4 h-4 mr-2" />
                    Your Demands
                  </Button>
                )}
                {currentUser !== username && (
                  <Button onClick={handleChatClick} className="bg-green-600 hover:bg-green-700 shadow-sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <Input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium mb-2">Profile Picture</label>
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-40 h-40 rounded-lg mb-2" />
              <Button onClick={handleCapture} className="bg-blue-600 hover:bg-blue-700 mb-2">
                Capture Photo
              </Button>
              {profilePic && (
                <img
                  src={profilePic || "/placeholder.svg"}
                  alt="Captured"
                  className="w-24 h-24 rounded-lg object-cover"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleProfileSubmit}
              className="bg-green-600 hover:bg-green-700"
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Tabbed Navigation */}
        <Tabs defaultValue="reviews" className="w-full">
          <div className="bg-white rounded-lg shadow-sm p-1 mb-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
              >
                <Star className="w-4 h-4 mr-2" />
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
              >
                <Shield className="w-4 h-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="contracts"
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
              >
                <FileText className="w-4 h-4 mr-2" />
                Contracts
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Payments
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Rating Summary */}
              <Card className="lg:col-span-1 border-0 shadow-md overflow-hidden h-fit">
                <CardHeader className="bg-green-50 border-b border-green-100">
                  <CardTitle className="flex items-center text-green-800">
                    <Star className="w-5 h-5 mr-2 fill-yellow-400 stroke-yellow-500" />
                    Rating Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {ratings?.data && ratings.data.length > 0 ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-green-800">{calculateAverageRating()}</div>
                          <div className="flex items-center justify-center mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= Math.round(calculateAverageRating())
                                    ? "fill-yellow-400 stroke-yellow-400"
                                    : "fill-gray-200 stroke-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-500 mt-2">{ratings.data.length} reviews</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((value) => (
                          <div key={value} className="flex items-center gap-2">
                            <div className="w-8 text-right">{value}</div>
                            <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                            <div className="flex-1">
                              <Progress value={calculateRatingPercentage(value)} className="h-2" />
                            </div>
                            <div className="w-8 text-gray-500 text-sm">{countRatingsByValue(value)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Star className="w-12 h-12 mx-auto stroke-gray-300 mb-2" />
                      <p className="text-gray-500">No ratings yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-6">
                {/* Add Review Form */}
                {!hasRated && (
                  <Card className="border-0 shadow-md overflow-hidden">
                    <CardHeader className="bg-green-50 border-b border-green-100">
                      <CardTitle className="text-green-800">Write a Review</CardTitle>
                      <CardDescription>Share your experience with {profile?.data.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Your Rating</label>
                          <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <TooltipProvider key={star}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      onClick={() => setRating(star)}
                                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                    >
                                      <Star
                                        className={`w-8 h-8 ${
                                          star <= rating ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"
                                        } transition-colors`}
                                      />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {star === 1 && "Poor"}
                                    {star === 2 && "Fair"}
                                    {star === 3 && "Average"}
                                    {star === 4 && "Good"}
                                    {star === 5 && "Excellent"}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Your Review</label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Share details of your experience with this person..."
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none min-h-[120px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Add Photo (Optional)</label>
                          <div className="flex items-center space-x-4">
                            <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors bg-gray-50 hover:bg-green-50">
                              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-500">Add Image</span>
                            </label>
                            {images.length > 0 && (
                              <div className="relative">
                                <img
                                  src={URL.createObjectURL(images[0]) || "/placeholder.svg"}
                                  alt="Preview"
                                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => setImages([])}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t border-gray-100 p-4">
                      <Button
                        className="ml-auto bg-green-600 hover:bg-green-700"
                        onClick={handleRatingSubmit}
                        disabled={rating === 0 || !description.trim()}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Submit Review
                      </Button>
                    </CardFooter>
                  </Card>
                )}

                {/* Reviews List */}
                {ratings?.data && ratings.data.length > 0 ? (
                  <div className="space-y-6">
                    {ratings.data.map((rating, index) => (
                      <Card
                        key={index}
                        className="border-0 shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-green-100 text-green-800">
                                {rating.rating_user?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-800">{rating.rating_user}</h3>
                                  <div className="flex items-center mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`w-4 h-4 ${
                                          star <= rating.rate
                                            ? "fill-yellow-400 stroke-yellow-400"
                                            : "fill-gray-200 stroke-gray-200"
                                        }`}
                                      />
                                    ))}
                                    <span className="ml-2 text-sm text-gray-500">
                                      {new Date().toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>

                                {/* Edit and delete buttons */}
                                {userInfo?.data.username === rating.rating_user && (
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-500 hover:text-green-700 hover:bg-green-50"
                                      onClick={() => {
                                        setEditingRatingId(rating.id)
                                        setRating(rating.rate)
                                        setDescription(rating.description)
                                        setImages(rating.images ? [rating.images] : [])
                                      }}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => handleDeleteRating(rating.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>

                              <div className="mt-3 text-gray-700">
                                <p>{rating.description}</p>
                              </div>

                              {rating.images && (
                                <div className="mt-4">
                                  <img
                                    src={rating.images || "/placeholder.svg"}
                                    alt="Rating Image"
                                    className="rounded-lg max-h-64 object-cover border border-gray-200"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Edit form for the selected rating */}
                          {editingRatingId === rating.id && (
                            <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                              <h4 className="font-medium text-green-800">Edit Your Review</h4>

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Update Rating</label>
                                <div className="flex items-center space-x-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setRating(star)}
                                      className="w-8 h-8 rounded-full flex items-center justify-center"
                                    >
                                      <Star
                                        className={`w-5 h-5 ${
                                          star <= rating ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Update Description</label>
                                <textarea
                                  value={description}
                                  onChange={(e) => setDescription(e.target.value)}
                                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                  rows="4"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Update Image (Optional)
                                </label>
                                <div className="flex items-center space-x-4">
                                  <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageChange}
                                      className="hidden"
                                    />
                                    <ImageIcon className="w-6 h-6 text-gray-400" />
                                  </label>
                                  {images.length > 0 && images[0] instanceof File && (
                                    <img
                                      src={URL.createObjectURL(images[0]) || "/placeholder.svg"}
                                      alt="Preview"
                                      className="w-24 h-24 object-cover rounded-lg"
                                    />
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingRatingId(null)}
                                  className="border-gray-300"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleUpdateRating(rating.id)}
                                >
                                  Update Review
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-8 text-center">
                      <Star className="w-12 h-12 mx-auto stroke-gray-300 mb-4" />
                      <h3 className="text-xl font-medium text-gray-700 mb-2">No Reviews Yet</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        This user hasn't received any reviews yet. Be the first to share your experience!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="flex items-center text-green-800">
                  <Shield className="w-5 h-5 mr-2" />
                  Verification Documents
                </CardTitle>
                <CardDescription>View and manage your verification documents</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile?.data.aadhar_image ? (
                    <Card className="border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                      <CardHeader className="bg-blue-50 p-4">
                        <CardTitle className="text-lg flex items-center text-blue-800">
                          <FileText className="w-5 h-5 mr-2 text-blue-600" />
                          Aadhar Card
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="aspect-video relative rounded-md overflow-hidden border border-gray-200">
                          <img
                            src={profile.data.aadhar_image || "/placeholder.svg"}
                            alt="Aadhar Card"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardHeader className="bg-gray-50 p-4">
                        <CardTitle className="text-lg flex items-center text-gray-700">
                          <FileText className="w-5 h-5 mr-2 text-gray-500" />
                          Aadhar Card
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-500 mb-4">No Aadhar card uploaded</p>
                        {currentUser === username && (
                          <Button className="bg-green-600 hover:bg-green-700">
                            <Shield className="w-4 h-4 mr-2" />
                            Upload Document
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {profile?.data.screenshot ? (
                    <Card className="border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                      <CardHeader className="bg-purple-50 p-4">
                        <CardTitle className="text-lg flex items-center text-purple-800">
                          <FileText className="w-5 h-5 mr-2 text-purple-600" />
                          Screenshot
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="aspect-video relative rounded-md overflow-hidden border border-gray-200">
                          <img
                            src={profile.data.screenshot || "/placeholder.svg"}
                            alt="Screenshot"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardHeader className="bg-gray-50 p-4">
                        <CardTitle className="text-lg flex items-center text-gray-700">
                          <FileText className="w-5 h-5 mr-2 text-gray-500" />
                          Screenshot
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-500 mb-4">No screenshot uploaded</p>
                        {currentUser === username && (
                          <Button className="bg-green-600 hover:bg-green-700">
                            <Shield className="w-4 h-4 mr-2" />
                            Upload Document
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="flex items-center text-green-800">
                  <FileText className="w-5 h-5 mr-2" />
                  Contract Details
                </CardTitle>
                <CardDescription>Manage your ongoing and past contracts</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {contracts?.data && contracts.data.length > 0 ? (
                    contracts.data.map((contract) => (
                      <Card
                        key={contract.contract_id}
                        className="border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                      >
                        <CardHeader className="p-4 bg-gray-50 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">Contract #{contract.contract_id.substring(0, 8)}</CardTitle>
                            <Badge
                              className={
                                contract.status
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              }
                            >
                              {contract.status ? "Active" : "Completed"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-medium text-gray-700">Contract Details</h3>
                              <div className="mt-2 space-y-2">
                                <div className="flex items-center text-gray-600">
                                  <User className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>Farmer: {contract.farmer_name}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <User className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>Buyer: {contract.buyer_name}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>Delivery Date: {new Date(contract.delivery_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>Created: {new Date(contract.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-700">Financial Details</h3>
                              <div className="mt-2 space-y-2">
                                <div className="flex items-center text-gray-600">
                                  <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>Price: ₹{contract.nego_price.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Crop className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>Crop: {contract.crop_name}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>Delivery Address: {contract.delivery_address}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>Quantity: {contract.quantity} units</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                        </CardContent>
                        <CardFooter className="bg-gray-50 border-t border-gray-200 p-4">
                          <Link href='/contracts'>
                          <Button variant="outline" className="ml-auto">
                            <FileText className="w-4 h-4 mr-2" />
                            View Details
                          </Button></Link>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-xl font-medium text-gray-700 mb-2">No Contracts Found</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        There are no contracts associated with this account yet.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="flex items-center text-green-800">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Details
                </CardTitle>
                <CardDescription>View transaction history and manage payments</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left p-3 text-gray-700">Transaction ID</th>
                          <th className="text-left p-3 text-gray-700">Date</th>
                          <th className="text-left p-3 text-gray-700">Amount</th>
                          <th className="text-left p-3 text-gray-700">Status</th>
                          <th className="text-left p-3 text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3].map((_, index) => (
                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-3 text-gray-700">TXN-{100000 + index}</td>
                            <td className="p-3 text-gray-700">
                              {new Date(Date.now() - index * 86400000).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-gray-700">₹{(5000 + index * 2000).toLocaleString()}</td>
                            <td className="p-3">
                              <Badge
                                className={index === 0 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                              >
                                {index === 0 ? "Completed" : "Processed"}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-green-700">
                                <FileText className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Separator />

                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">Payment Methods</h3>
                      <p className="text-sm text-gray-500">Update your payment preferences</p>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Update Payment Method
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

