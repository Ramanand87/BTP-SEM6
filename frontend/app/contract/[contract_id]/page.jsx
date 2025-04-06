"use client";

import { useParams } from "next/navigation";
import { useState, useRef } from "react";
import {
  useGetContractQuery,
  useGetAllPaymentsQuery,
  useCreatePaymentMutation,
} from "@/redux/Service/contract";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export default function ContractPage() {
  const { contract_id } = useParams();
  const fileInputRef = useRef(null);

  // Fetch contract details
  const {
    data: contractData,
    isLoading: isLoadingContract,
    error: contractError,
  } = useGetContractQuery(contract_id);

  // Fetch all payments for this contract
  const { data: paymentsData, isLoading: isLoadingPayments } =
    useGetAllPaymentsQuery(contract_id);

  // Create payment mutation
  const [createPayment, { isLoading: isCreatingPayment }] =
    useCreatePaymentMutation();

  const [paymentDate, setPaymentDate] = useState(new Date());
  const [paymentForm, setPaymentForm] = useState({
    description: "",
    amount: "",
    receipt: null,
    receiptName: "",
    reference_number: "",
  });

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm({
      ...paymentForm,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentForm({
        ...paymentForm,
        receipt: file,
        receiptName: file.name,
      });
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("contract_id", contract_id);
      formData.append("description", paymentForm.description);
      formData.append("date", format(paymentDate, "yyyy-MM-dd"));
      formData.append("amount", paymentForm.amount);
      formData.append("reference_number", paymentForm.reference_number); // Add this line

      if (paymentForm.receipt) {
        formData.append("receipt", paymentForm.receipt);
      }

      await createPayment(formData).unwrap();

      // Reset form
      setPaymentForm({
        description: "",
        amount: "",
        receipt: null,
        receiptName: "",
        reference_number: "", // Reset this field too
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Payment added successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add payment. Please try again.");
    }
  };

  if (isLoadingContract || isLoadingPayments) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading contract details...</span>
      </div>
    );
  }

  if (contractError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Error Loading Contract
          </h2>
          <p className="mt-2">
            Failed to load contract details. Please try again later.
          </p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const contract = contractData?.data;
  if (!contract) return null;

  // Get payments array or empty array if no payments
  const payments = paymentsData?.data || [];
  const hasPayments = payments.length > 0;

  // Calculate total contract value
  const totalContractValue = contract.nego_price * contract.quantity;

  // Calculate total paid amount
  const totalPaid = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );

  // Calculate progress percentage
  const progressPercentage = Math.min(
    100,
    (totalPaid / totalContractValue) * 100
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contract Summary Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Contract Details
                </CardTitle>
                <CardDescription>
                  Contract ID: {contract.contract_id}
                </CardDescription>
              </div>
              <Badge variant={hasPayments ? "secondary" : "outline"}>
                {hasPayments ? "In Progress" : "Active"}
              </Badge>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Farmer
                  </h3>
                  <p className="text-lg font-semibold">
                    {contract.farmer_name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Buyer
                  </h3>
                  <p className="text-lg font-semibold">{contract.buyer_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Crop
                  </h3>
                  <p className="text-lg font-semibold">{contract.crop_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Quantity
                  </h3>
                  <p className="text-lg font-semibold">
                    {contract.quantity} kg
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Price per kg
                  </h3>
                  <p className="text-lg font-semibold">
                    ₹{contract.nego_price}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Total Value
                  </h3>
                  <p className="text-lg font-semibold">
                    ₹{totalContractValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Delivery Address
                  </h3>
                  <p className="text-lg font-semibold">
                    {contract.delivery_address}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Delivery Date
                  </h3>
                  <p className="text-lg font-semibold">
                    {new Date(contract.delivery_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Contract Terms
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {contract.terms.map((term, index) => (
                    <li key={index} className="text-sm">
                      {term}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Payment Progress
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>₹{totalPaid.toLocaleString()} paid</span>
                    <span>₹{totalContractValue.toLocaleString()} total</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {progressPercentage.toFixed(0)}% of contract value paid
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments Section */}
        <div className="lg:col-span-1">
          {!hasPayments ? (
            <Card>
              <CardHeader>
                <CardTitle>Advance Payment Required</CardTitle>
                <CardDescription>
                  An advance payment is required to start this contract
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Attention</AlertTitle>
                  <AlertDescription>
                    Please make an advance payment to activate this contract.
                  </AlertDescription>
                </Alert>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Advance Payment Amount (₹)</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={paymentForm.amount}
                      onChange={handlePaymentChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended: ₹
                      {Math.round(totalContractValue * 0.25).toLocaleString()}{" "}
                      (25% of total)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Payment Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Advance payment details"
                      value={paymentForm.description}
                      onChange={handlePaymentChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {paymentDate
                            ? format(paymentDate, "PPP")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={paymentDate}
                          onSelect={(date) => date && setPaymentDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receipt">Payment Receipt</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        ref={fileInputRef}
                        id="receipt"
                        name="receipt"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full justify-start"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {paymentForm.receiptName || "Upload receipt"}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reference_number">Reference Number</Label>
                    <Input
                      id="reference_number"
                      name="reference_number"
                      type="text"
                      placeholder="Enter payment reference number"
                      value={paymentForm.reference_number}
                      onChange={handlePaymentChange}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isCreatingPayment}
                  >
                    {isCreatingPayment && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit Advance Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="history">Payment History</TabsTrigger>
                <TabsTrigger value="add">Add Payment</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>
                      View all payments made for this contract
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {payments.map((payment) => (
                        <div key={payment.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                ₹{Number(payment.amount).toLocaleString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(payment.date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Confirmed
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm">
                            <p>{payment.description}</p>
                            {payment.receipt && (
                              <p className="flex items-center gap-1 text-muted-foreground mt-1">
                                <FileText className="h-3 w-3" />
                                {typeof payment.receipt === "string"
                                  ? payment.receipt.split("/").pop()
                                  : "Receipt attached"}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Paid:</span>
                      <span className="font-medium">
                        ₹{totalPaid.toLocaleString()}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="add" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Payment</CardTitle>
                    <CardDescription>
                      Record a new payment for this contract
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Payment Amount (₹)</Label>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          placeholder="Enter amount"
                          value={paymentForm.amount}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Payment Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Payment details"
                          value={paymentForm.description}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Payment Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {paymentDate
                                ? format(paymentDate, "PPP")
                                : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={paymentDate}
                              onSelect={(date) => date && setPaymentDate(date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="receipt">Payment Receipt</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            ref={fileInputRef}
                            id="receipt"
                            name="receipt"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full justify-start"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {paymentForm.receiptName || "Upload receipt"}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reference_number">
                          Reference Number
                        </Label>
                        <Input
                          id="reference_number"
                          name="reference_number"
                          type="text"
                          placeholder="Enter payment reference number"
                          value={paymentForm.reference_number}
                          onChange={handlePaymentChange}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isCreatingPayment}
                      >
                        {isCreatingPayment && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Record Payment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle>Contract Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Progress</span>
                    <span>{progressPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-start">
                  <div className="rounded-full p-1 bg-green-100 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">Contract Created</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(contract.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`rounded-full p-1 ${
                      hasPayments
                        ? "bg-green-100 text-green-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {hasPayments ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">Advance Payment</h4>
                    <p className="text-xs text-muted-foreground">
                      25% of total value
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`rounded-full p-1 ${
                      progressPercentage >= 50
                        ? "bg-green-100 text-green-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {progressPercentage >= 50 ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">Partial Payment</h4>
                    <p className="text-xs text-muted-foreground">
                      50% of total value
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`rounded-full p-1 ${
                      progressPercentage >= 100
                        ? "bg-green-100 text-green-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {progressPercentage >= 100 ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">Full Payment</h4>
                    <p className="text-xs text-muted-foreground">
                      100% of total value
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
