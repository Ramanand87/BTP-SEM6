"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  Upload,
  Sun,
  Wheat,
  CheckCircle2,
  Loader2,
  Trash,
  Droplets,
  Cloud,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import FarmerLogo from "@/components/assets/FramerLogo";

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [signupStep, setSignupStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [cropMode, setCropMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [cropAspect, setCropAspect] = useState(1);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    }));
    setDocuments([...documents, ...newDocs]);
  };

  const removeDocument = (index) => {
    const newDocs = [...documents];
    URL.revokeObjectURL(newDocs[index].url);
    newDocs.splice(index, 1);
    setDocuments(newDocs);
  };

  const handleCropComplete = () => {
    // Here you would normally handle the cropped image
    setCropMode(false);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
    }, 2000);
  };

  const AnimatedBackgroundElements = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-10 left-10"
        animate={{
          y: [0, 20, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <Wheat className="text-green-400 h-12 w-12" />
      </motion.div>
      <motion.div
        className="absolute top-20 right-20"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <Sun className="text-yellow-400 h-16 w-16" />
      </motion.div>
      <motion.div
        className="absolute bottom-10 left-1/4"
        animate={{
          y: [0, -30, 0],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <Cloud className="text-blue-300 h-20 w-20" />
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-1/4"
        animate={{
          y: [0, 40, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <Droplets className="text-blue-400 h-10 w-10" />
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-50 flex items-center justify-center p-4">
      {/* Animated background elements */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <AnimatedBackgroundElements />

      </div>

      <Card className="w-full max-w-md bg-white/90 backdrop-blur">
      <CardHeader className="space-y-2">
      <div className="flex justify-center mb-6">
              <FarmerLogo width={80} height={80} className="drop-shadow-md" />
            </div>
          <CardTitle className="text-center text-2xl font-bold text-green-800">
            Secure Your Harvest,
            <br />
            Connect with Buyers
          </CardTitle>
         
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Section */}
            <TabsContent value="login" className="space-y-4">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginId">Phone Number or Name</Label>
                  <Input
                    id="loginId"
                    className="border-green-200 focus:ring-green-500"
                    placeholder="Enter your phone number or name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      className="border-green-200 focus:ring-green-500 pr-10"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4 text-gray-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="link" className="text-green-600">
                    Forgot Password?
                  </Button>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Login
                </Button>
              </form>
            </TabsContent>

            {/* Signup Section */}
            <TabsContent value="signup" className="space-y-4">
              <div className="relative w-full h-2 bg-green-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-700 transition-all duration-300 ease-in-out rounded-full"
                  style={{ width: `${signupStep * 33.33}%` }}
                />
              </div>

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                {signupStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        className="border-green-200 focus:ring-green-500"
                        placeholder="Full Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        className="border-green-200 focus:ring-green-500"
                        placeholder="Phone Number"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        className="border-green-200 focus:ring-green-500"
                        placeholder="Address"
                        required
                      />
                    </div>
                  </div>
                )}
                {signupStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-2">
                      <Label>Profile Image</Label>
                      <div className="border-2 border-dashed border-green-200 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="profileImage"
                          onChange={handleImageUpload}
                        />
                        <Label
                          htmlFor="profileImage"
                          className="cursor-pointer block"
                        >
                          {previewImage ? (
                            <Image
                              src={previewImage}
                              alt="Profile preview"
                              width={400}
                              height={400}
                              className="mx-auto h-32 w-32 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center">
                              <Upload className="h-12 w-12 text-green-500" />
                              <span className="mt-2 text-sm text-gray-600">
                                Click to upload profile image
                              </span>
                            </div>
                          )}
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Kisan Card Documents</Label>
                      <div className="border-2 border-dashed border-green-200 rounded-lg p-4">
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          id="documents"
                          multiple
                          onChange={handleDocumentUpload}
                        />
                        <Label
                          htmlFor="documents"
                          className="cursor-pointer block text-center"
                        >
                          <Upload />
                          <span className="mt-2 text-sm text-gray-600 block">
                            Upload documents (PDF or Images)
                          </span>
                        </Label>

                        {/* Document Preview Section */}
                        {documents.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {documents.map((doc, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-green-50 p-2 rounded"
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium">
                                    {doc.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({(doc.size / 1024).toFixed(1)} KB)
                                  </span>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(doc.url)}
                                    className="text-green-600 border-green-200"
                                  >
                                    View
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeDocument(index)}
                                    className="text-red-600 border-red-200"
                                  >
                                    <Trash />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {signupStep === 3 && (
                  <div className="space-y-4 animate-fadeIn">
                   <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            className="border-green-200 focus:ring-green-500 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <Eye className="h-4 w-4 text-gray-500" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            className="border-green-200 focus:ring-green-500 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showConfirmPassword ? (
              <Eye className="h-4 w-4 text-gray-500" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>
    </motion.div>

                    {showSuccess && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <AlertDescription>
                          Registration successful! Welcome to our farming
                          community.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                <div className="flex justify-between">
                  {signupStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSignupStep((step) => step - 1)}
                      className="border-green-200 text-green-600"
                    >
                      Previous
                    </Button>
                  )}

                  {signupStep < 3 ? (
                    <Button
                      type="button"
                      onClick={() => setSignupStep((step) => step + 1)}
                      className="bg-green-600 hover:bg-green-700 text-white ml-auto"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white ml-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </>
                      ) : (
                        "Complete Signup"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
