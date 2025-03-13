"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
  Camera,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import FarmerLogo from "@/components/assets/FramerLogo";
import { useRegisterMutation, useLoginMutation } from "@/redux/Service/auth";
import Webcam from "react-webcam";

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [document, setDocument] = useState(null); // Single document
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [aadharDocument, setAadharDocument] = useState(null);
  const [verificationScreenshot, setVerificationScreenshot] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const webcamRef = useRef(null);
  const router= useRouter();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
    document: null, // Single document
    profileImage: null,
    aadharDocument: null,
    verificationScreenshot: null,
  });

  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPreviewImage(imageSrc);
    setFormData({ ...formData, profileImage: imageSrc });
    setIsCameraActive(false); // Close the camera after capturing
  };
    // Handle document upload
    const handleDocumentUpload = (e) => {
      const file = e.target.files[0]; // Only take the first file
      if (file) {
        setFormData({ ...formData, document: file });
        setDocument(file);
      }
    };
  
    // Remove document
    const removeDocument = () => {
      setFormData({ ...formData, document: null });
      setDocument(null);
    };

  const handleAadharDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, aadharDocument: file });
      setAadharDocument(file);
    }
  };

  const handleVerificationScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, verificationScreenshot: file });
      setVerificationScreenshot(file);
    }
  };

  const removeAadharDocument = () => {
    setFormData({ ...formData, aadharDocument: null });
    setAadharDocument(null);
  };

  const removeVerificationScreenshot = () => {
    setFormData({ ...formData, verificationScreenshot: null });
    setVerificationScreenshot(null);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("username", formData.username);
      data.append("address", formData.address);
      data.append("phoneno", formData.phone);
      data.append("password", formData.password);
      if (formData.profileImage) {
        data.append("image", formData.profileImage);
      }
      if (formData.aadharDocument) {
        data.append("aadhaar_image", formData.aadharDocument);
      }
      if (formData.document) {
        data.append("documents", formData.document); // Append single document
      }
      if (formData.verificationScreenshot) {
        data.append("ss", formData.verificationScreenshot);
      }

      const response = await register(data).unwrap();
      console.log("Registration successful:", response);
      setShowSuccess(true);
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.loginId.value;
    const password = e.target.loginPassword.value;

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({ username, password }).unwrap();
      console.log("Login successful:", response);
      router.push('/')

    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
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
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-50 flex items-center justify-center p-4">
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
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginId">Username</Label>
                  <Input
                    id="loginId"
                    className="border-green-200 focus:ring-green-500"
                    placeholder="Enter your username"
                    required
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

                <div className="flex justify-end">
                  <Button variant="link" className="text-green-600">
                    Forgot Password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </TabsContent>
            {/* Signup Section */}
            <TabsContent value="signup" className="space-y-4">
              <div className="relative w-full h-2 bg-green-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-700 transition-all duration-300 ease-in-out rounded-full"
                  style={{ width: `${signupStep * 25}%` }}
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
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        className="border-green-200 focus:ring-green-500"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        className="border-green-200 focus:ring-green-500"
                        placeholder="Address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
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
                        {isCameraActive ? (
                          <div className="flex flex-col items-center">
                            <Webcam
                              audio={false}
                              ref={webcamRef}
                              screenshotFormat="image/jpeg"
                              className="w-full h-auto"
                            />
                            <Button
                              onClick={captureImage}
                              className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                            >
                              Capture Photo
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            {previewImage ? (
                              <div className="flex flex-col items-center">
                                <Image
                                  src={previewImage}
                                  alt="Profile preview"
                                  width={400}
                                  height={400}
                                  className="mx-auto h-32 w-32 rounded-full object-cover"
                                />
                                <Button
                                  onClick={() => setIsCameraActive(true)}
                                  className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Retake Photo
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => setIsCameraActive(true)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Camera className="mr-2 h-4 w-4" />
                                Capture Photo
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Aadhar Card Upload</Label>
                      <div className="border-2 border-dashed border-green-200 rounded-lg p-4">
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          id="aadharDocument"
                          onChange={handleAadharDocumentUpload}
                        />
                        <Label
                          htmlFor="aadharDocument"
                          className="cursor-pointer block text-center"
                        >
                          <Upload />
                          <span className="mt-2 text-sm text-gray-600 block">
                            Upload Aadhar card (PDF or Image)
                          </span>
                        </Label>

                        {aadharDocument && (
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">
                                  {aadharDocument.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({(aadharDocument.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    window.open(URL.createObjectURL(aadharDocument))
                                  }
                                  className="text-green-600 border-green-200"
                                >
                                  View
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={removeAadharDocument}
                                  className="text-red-600 border-red-200"
                                >
                                  <Trash />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

{signupStep === 3 && (
                  <div className="space-y-4 animate-fadeIn">
                    

                    <div className="space-y-2">
                      <Label>Kisan Card Document</Label>
                      <div className="border-2 border-dashed border-green-200 rounded-lg p-4">
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          id="document"
                          onChange={handleDocumentUpload}
                        />
                        <Label
                          htmlFor="document"
                          className="cursor-pointer block text-center"
                        >
                          <Upload />
                          <span className="mt-2 text-sm text-gray-600 block">
                            Upload document (PDF or Image)
                          </span>
                        </Label>

                        {/* Document Preview Section */}
                        {document && (
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">
                                  {document.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({(document.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    window.open(URL.createObjectURL(document))
                                  }
                                  className="text-green-600 border-green-200"
                                >
                                  View
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={removeDocument}
                                  className="text-red-600 border-red-200"
                                >
                                  <Trash />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {signupStep === 4 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-2">
                      <Label>Aadhar Card Verification</Label>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Please verify your Aadhar card using the official UIDAI website. Follow these steps:
                        </p>
                        <ol className="list-decimal list-inside text-sm text-gray-600 mt-2">
                          <li>Visit the official UIDAI website: <a href="https://uidai.gov.in/" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">https://uidai.gov.in/</a>.</li>
                          <li>Use the "Verify Aadhar" feature to verify your Aadhar card.</li>
                          <li>Once verified, take a screenshot of the verification page.</li>
                          <li>Upload the screenshot below as proof of verification.</li>
                        </ol>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Upload Verification Screenshot</Label>
                      <div className="border-2 border-dashed border-green-200 rounded-lg p-4">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="verificationScreenshot"
                          onChange={handleVerificationScreenshotUpload}
                        />
                        <Label
                          htmlFor="verificationScreenshot"
                          className="cursor-pointer block text-center"
                        >
                          <Upload />
                          <span className="mt-2 text-sm text-gray-600 block">
                            Upload verification screenshot (Image)
                          </span>
                        </Label>

                        {verificationScreenshot && (
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">
                                  {verificationScreenshot.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({(verificationScreenshot.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    window.open(URL.createObjectURL(verificationScreenshot))
                                  }
                                  className="text-green-600 border-green-200"
                                >
                                  View
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={removeVerificationScreenshot}
                                  className="text-red-600 border-red-200"
                                >
                                  <Trash />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {signupStep ===5 && (
                  <div className="space-y-4 animate-fadeIn">
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="space-y-2">
                        <div className="mb-4 space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            className="border-green-200 focus:ring-green-500"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            required
                          />
                        </div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="border-green-200 focus:ring-green-500 pr-10"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
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
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                confirmPassword: e.target.value,
                              })
                            }
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
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

                  {signupStep < 5 ? (
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