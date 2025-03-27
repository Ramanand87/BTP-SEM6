"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2, Send } from 'lucide-react';
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
    const contract = {
      ...formData,
      deliveryDate: deliveryDate ? format(deliveryDate, 'yyyy-MM-dd') : null
    };
    console.log('Contract submitted:', contract);
    // Here you would typically send to your backend
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