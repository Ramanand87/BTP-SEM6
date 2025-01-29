"use client"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Upload, Sun, Wheat, CheckCircle2, Loader2, Trash, Cloud, Droplets } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import FarmerLogo from "@/components/assets/FramerLogo"

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [signupStep, setSignupStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [documents, setDocuments] = useState([])
  const [activeTab, setActiveTab] = useState("login")

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files)
    const newDocs = files.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    }))
    setDocuments([...documents, ...newDocs])
  }

  const removeDocument = (index) => {
    const newDocs = [...documents]
    URL.revokeObjectURL(newDocs[index].url)
    newDocs.splice(index, 1)
    setDocuments(newDocs)
  }

  const handleSignupSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowSuccess(true)
    }, 2000)
  }

  useEffect(() => {
    // Reset success message when changing tabs
    setShowSuccess(false)
  }, [showSuccess]) //Corrected dependency

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <AnimatedBackgroundElements />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-md bg-white/90 backdrop-blur shadow-xl">
          <CardContent className="p-6">
            <div className="flex justify-center mb-6">
              <FarmerLogo width={80} height={80} className="drop-shadow-md" />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <AnimatedTabTrigger value="login">Login</AnimatedTabTrigger>
                <AnimatedTabTrigger value="signup">Sign Up</AnimatedTabTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                {/* Login Section */}
                {activeTab === "login" && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="login" className="space-y-4">
                      <LoginForm showPassword={showPassword} setShowPassword={setShowPassword} />
                    </TabsContent>
                  </motion.div>
                )}

                {/* Signup Section */}
                {activeTab === "signup" && (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="signup" className="space-y-4">
                      <SignupForm
                        signupStep={signupStep}
                        setSignupStep={setSignupStep}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        previewImage={previewImage}
                        handleImageUpload={handleImageUpload}
                        documents={documents}
                        handleDocumentUpload={handleDocumentUpload}
                        removeDocument={removeDocument}
                        handleSignupSubmit={handleSignupSubmit}
                        isLoading={isLoading}
                        showSuccess={showSuccess}
                      />
                    </TabsContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

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

const AnimatedTabTrigger = ({ value, children }) => (
  <TabsTrigger value={value}>
    <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      {children}
    </motion.span>
  </TabsTrigger>
)

const LoginForm = ({ showPassword, setShowPassword }) => (
  <form className="space-y-4">
    <AnimatedFormField>
      <Label htmlFor="loginId">Phone Number or Name</Label>
      <Input
        id="loginId"
        className="border-green-200 focus:ring-green-500"
        placeholder="Enter your phone number or name"
      />
    </AnimatedFormField>

    <AnimatedFormField>
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
          {showPassword ? <Eye className="h-4 w-4 text-gray-500" /> : <EyeOff className="h-4 w-4 text-gray-500" />}
        </button>
      </div>
    </AnimatedFormField>

    <div className="flex justify-end">
      <Button variant="link" className="text-green-600">
        Forgot Password?
      </Button>
    </div>

    <AnimatedButton className="w-full bg-green-600 hover:bg-green-700 text-white">Login</AnimatedButton>
  </form>
)

const SignupForm = ({
  signupStep,
  setSignupStep,
  showPassword,
  setShowPassword,
  previewImage,
  handleImageUpload,
  documents,
  handleDocumentUpload,
  removeDocument,
  handleSignupSubmit,
  isLoading,
  showSuccess,
}) => (
  <form onSubmit={handleSignupSubmit} className="space-y-4">
    <motion.div
      className="relative w-full h-2 bg-green-100 rounded-full overflow-hidden"
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="h-full bg-green-700 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${signupStep * 33.33}%` }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>

    <AnimatePresence mode="wait">
      {signupStep === 1 && <SignupStep1 key="step1" />}

      {signupStep === 2 && (
        <SignupStep2
          key="step2"
          previewImage={previewImage}
          handleImageUpload={handleImageUpload}
          documents={documents}
          handleDocumentUpload={handleDocumentUpload}
          removeDocument={removeDocument}
        />
      )}

      {signupStep === 3 && (
        <SignupStep3
          key="step3"
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showSuccess={showSuccess}
        />
      )}
    </AnimatePresence>

    <div className="flex justify-between">
      {signupStep > 1 && (
        <AnimatedButton
          type="button"
          variant="outline"
          onClick={() => setSignupStep((step) => step - 1)}
          className="border-green-200 text-green-600"
        >
          Previous
        </AnimatedButton>
      )}

      {signupStep < 3 ? (
        <AnimatedButton
          type="button"
          onClick={() => setSignupStep((step) => step + 1)}
          className="bg-green-600 hover:bg-green-700 text-white ml-auto"
        >
          Next Step
        </AnimatedButton>
      ) : (
        <AnimatedButton
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
        </AnimatedButton>
      )}
    </div>
  </form>
)

const SignupStep1 = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-4"
  >
    <AnimatedFormField>
      <Label htmlFor="name">Full Name</Label>
      <Input id="name" className="border-green-200 focus:ring-green-500" placeholder="Full Name" required />
    </AnimatedFormField>
    <AnimatedFormField>
      <Label htmlFor="phone">Phone Number</Label>
      <Input
        id="phone"
        type="tel"
        className="border-green-200 focus:ring-green-500"
        placeholder="Phone Number"
        required
      />
    </AnimatedFormField>
    <AnimatedFormField>
      <Label htmlFor="address">Address</Label>
      <Textarea id="address" className="border-green-200 focus:ring-green-500" placeholder="Address" required />
    </AnimatedFormField>
  </motion.div>
)

const SignupStep2 = ({ previewImage, handleImageUpload, documents, handleDocumentUpload, removeDocument }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-4"
  >
    <AnimatedFormField>
      <Label>Profile Image</Label>
      <div className="border-2 border-dashed border-green-200 rounded-lg p-4 text-center">
        <input type="file" accept="image/*" className="hidden" id="profileImage" onChange={handleImageUpload} />
        <Label htmlFor="profileImage" className="cursor-pointer block">
          {previewImage ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={previewImage || "/placeholder.svg"}
                alt="Profile preview"
                width={128}
                height={128}
                className="mx-auto h-32 w-32 rounded-full object-cover"
              />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-green-500" />
              <span className="mt-2 text-sm text-gray-600">Click to upload profile image</span>
            </div>
          )}
        </Label>
      </div>
    </AnimatedFormField>

    <AnimatedFormField>
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
        <Label htmlFor="documents" className="cursor-pointer block text-center">
          <Upload className="h-12 w-12 text-green-500 mx-auto" />
          <span className="mt-2 text-sm text-gray-600 block">Upload documents (PDF or Images)</span>
        </Label>

        {/* Document Preview Section */}
        <AnimatePresence>
          {documents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-2"
            >
              {documents.map((doc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between bg-green-50 p-2 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{doc.name}</span>
                    <span className="text-xs text-gray-500">({(doc.size / 1024).toFixed(1)} KB)</span>
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
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedFormField>
  </motion.div>
)

const SignupStep3 = ({ showPassword, setShowPassword, showSuccess }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-4"
  >
    <AnimatedFormField>
      <Label htmlFor="password">Create Password</Label>
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
          {showPassword ? <Eye className="h-4 w-4 text-gray-500" /> : <EyeOff className="h-4 w-4 text-gray-500" />}
        </button>
      </div>
    </AnimatedFormField>

    <AnimatePresence>
      {showSuccess && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription>Registration successful! Welcome to our farming community.</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
)

const AnimatedFormField = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-2"
  >
    {children}
  </motion.div>
)

const AnimatedButton = ({ children, ...props }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Button {...props}>{children}</Button>
  </motion.div>
)

export default AuthPage

