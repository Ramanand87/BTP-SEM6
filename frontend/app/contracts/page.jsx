"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2, Send, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const ContractsPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    pricePerUnit: '',
    totalPrice: '',
    deliveryAddress: '',
    paymentMethod: 'full',
    terms: ['quality_standard', 'delivery_timeframe'],
    additionalTerms: [],
    specialConditions: ''
  });

  const [deliveryDate, setDeliveryDate] = useState();
  const [newTerm, setNewTerm] = useState('');
  const [farmerSignature, setFarmerSignature] = useState(null);
  const [customerSignature, setCustomerSignature] = useState(null);
  const [farmerSignaturePreview, setFarmerSignaturePreview] = useState('');
  const [customerSignaturePreview, setCustomerSignaturePreview] = useState('');

  // Available crops
  const crops = [
    'Wheat',
    'Rice',
    'Corn',
    'Soybean',
    'Cotton',
    'Potatoes',
    'Tomatoes',
    'Sugarcane'
  ];

  // Standard terms
  const standardTerms = [
    { id: 'quality_standard', label: 'Quality standards must be met' },
    { id: 'delivery_timeframe', label: 'Delivery within agreed timeframe' },
    { id: 'payment_terms', label: 'Payment as per agreed terms' },
    { id: 'force_majeure', label: 'Force majeure clause applies' }
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate total price if quantity or price changes
    if (name === 'quantity' || name === 'pricePerUnit') {
      const quantity = name === 'quantity' ? value : formData.quantity;
      const price = name === 'pricePerUnit' ? value : formData.pricePerUnit;
      const total = quantity && price ? (parseFloat(quantity) * parseFloat(price)).toFixed(2) : '';
      setFormData(prev => ({ ...prev, totalPrice: total }));
    }
  };

  // Handle signature file upload
  const handleSignatureUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
      alert('Please upload an image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    // Set the file in state
    if (type === 'farmer') {
      setFarmerSignature(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFarmerSignaturePreview(reader.result);
      };
      reader.readAsDataURL(file);
      console.log('Farmer signature uploaded:', file.name);
    } else {
      setCustomerSignature(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomerSignaturePreview(reader.result);
      };
      reader.readAsDataURL(file);
      console.log('Customer signature uploaded:', file.name);
    }
  };

  // Handle term selection
  const handleTermToggle = (termId) => {
    setFormData(prev => {
      const newTerms = prev.terms.includes(termId)
        ? prev.terms.filter(id => id !== termId)
        : [...prev.terms, termId];
      return { ...prev, terms: newTerms };
    });
  };

  // Add new custom term
  const addCustomTerm = () => {
    if (newTerm.trim()) {
      setFormData(prev => ({
        ...prev,
        additionalTerms: [...prev.additionalTerms, newTerm.trim()]
      }));
      setNewTerm('');
    }
  };

  // Remove custom term
  const removeCustomTerm = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalTerms: prev.additionalTerms.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData object to send files
    const formDataToSend = new FormData();
    
    // Add all form fields
    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach(item => {
          formDataToSend.append(key, item);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
    
    // Add delivery date
    if (deliveryDate) {
      formDataToSend.append('deliveryDate', format(deliveryDate, 'yyyy-MM-dd'));
    }
    
    // Add signature files if available
    if (farmerSignature) {
      formDataToSend.append('farmerSignature', farmerSignature);
      console.log('Farmer signature added:', farmerSignature.name);
    }
    
    if (customerSignature) {
      formDataToSend.append('customerSignature', customerSignature);
      console.log('Customer signature added:', customerSignature.name);
    }
    
    // Add signature names and date
    formDataToSend.append('signatures[farmer]', 'Farmer Name');
    formDataToSend.append('signatures[customer]', 'Customer Name');
    formDataToSend.append('signatures[date]', new Date().toISOString());
    
    // Here you would typically send to your backend
    console.log('Contract submitted with signatures');
    
    // For demonstration, just show an alert
    alert('Contract created successfully!');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Create New Contract</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Crop Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name</label>
            <Select onValueChange={(value) => setFormData({...formData, cropName: value})}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a crop" />
              </SelectTrigger>
              <SelectContent>
                {crops.map(crop => (
                  <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
            <Input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              min="1"
            />
          </div>
        </div>

        {/* Price */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per kg (₹)</label>
            <Input
              type="number"
              name="pricePerUnit"
              value={formData.pricePerUnit}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Price (₹)</label>
            <Input
              type="text"
              name="totalPrice"
              value={formData.totalPrice}
              readOnly
              className="bg-gray-100"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <Select 
              onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
              defaultValue="full"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Payment</SelectItem>
                <SelectItem value="emi">EMI (Installments)</SelectItem>
                <SelectItem value="50_50">50% Advance, 50% on Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
            <Textarea
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              placeholder="Enter full delivery address"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deliveryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deliveryDate ? format(deliveryDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deliveryDate}
                  onSelect={setDeliveryDate}
                  initialFocus
                  fromDate={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Digital Signatures Section */}
        <div className="border-2 border-green-500 p-6 rounded-lg bg-green-50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-green-800">Digital Signatures</h3>
              <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Required</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">Please upload signature images for both parties to complete the contract. Accepted formats: JPEG, PNG, GIF (max 5MB)</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Farmer Signature Upload */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Farmer's Signature</label>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={(e) => handleSignatureUpload(e, 'farmer')}
                    className="hidden"
                    id="farmer-signature"
                  />
                  <label
                    htmlFor="farmer-signature"
                    className="flex items-center justify-center px-4 py-2 border border-green-300 rounded-md bg-white hover:bg-green-50 cursor-pointer transition-colors duration-150 text-sm font-medium text-green-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </label>
                  {farmerSignature && (
                    <span className="text-sm text-gray-500">{farmerSignature.name}</span>
                  )}
                </div>
                
                {farmerSignaturePreview ? (
                  <div className="border rounded-md p-2 bg-white">
                    <img 
                      src={farmerSignaturePreview} 
                      alt="Farmer Signature Preview" 
                      className="max-h-20 object-contain mx-auto"
                    />
                  </div>
                ) : (
                  <div className="border rounded-md p-4 bg-gray-50 text-center text-sm text-gray-500">
                    No signature uploaded
                  </div>
                )}
              </div>
            </div>
            
            {/* Customer Signature Upload */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Customer's Signature</label>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={(e) => handleSignatureUpload(e, 'customer')}
                    className="hidden"
                    id="customer-signature"
                  />
                  <label
                    htmlFor="customer-signature"
                    className="flex items-center justify-center px-4 py-2 border border-green-300 rounded-md bg-white hover:bg-green-50 cursor-pointer transition-colors duration-150 text-sm font-medium text-green-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </label>
                  {customerSignature && (
                    <span className="text-sm text-gray-500">{customerSignature.name}</span>
                  )}
                </div>
                
                {customerSignaturePreview ? (
                  <div className="border rounded-md p-2 bg-white">
                    <img 
                      src={customerSignaturePreview} 
                      alt="Customer Signature Preview" 
                      className="max-h-20 object-contain mx-auto"
                    />
                  </div>
                ) : (
                  <div className="border rounded-md p-4 bg-gray-50 text-center text-sm text-gray-500">
                    No signature uploaded
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Standard Terms and Conditions */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">Standard Terms</h3>
          <div className="space-y-2">
            {standardTerms.map(term => (
              <div key={term.id} className="flex items-center space-x-2">
                <Checkbox
                  id={term.id}
                  checked={formData.terms.includes(term.id)}
                  onCheckedChange={() => handleTermToggle(term.id)}
                />
                <label htmlFor={term.id} className="text-sm font-medium leading-none">
                  {term.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Terms */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">Additional Terms</h3>
          <div className="flex gap-2">
            <Input
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              placeholder="Add custom term"
              className="flex-1"
            />
            <Button type="button" onClick={addCustomTerm} variant="outline">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          
          <div className="space-y-2 mt-2">
            {formData.additionalTerms.map((term, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm">{term}</span>
                <Button
                  type="button"
                  onClick={() => removeCustomTerm(index)}
                  variant="ghost"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Special Conditions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Special Conditions</label>
          <Textarea
            name="specialConditions"
            value={formData.specialConditions}
            onChange={handleChange}
            placeholder="Any special conditions or notes"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            <Send className="h-4 w-4 mr-2" /> Create Contract
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContractsPage;