
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import popularDestinations from '../utils/destinations';

const ItineraryForm = ({ onCreateItinerary }) => {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: null,
    endDate: null,
    budget: '',
    interests: [],
    travelMode: 'flight',
    companions: 'solo',
    activities: [],
    pace: 'moderate'
  });
  
  const [step, setStep] = useState(1);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  
  // Handle destination search
  const handleDestinationSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    setFormData({ ...formData, destination: e.target.value });
    
    if (searchQuery.length > 1) {
      const filtered = popularDestinations.filter(
        dest => dest.name.toLowerCase().includes(searchQuery) || 
               dest.country.toLowerCase().includes(searchQuery)
      );
      setFilteredDestinations(filtered.slice(0, 5)); // Show top 5 results
    } else {
      setFilteredDestinations([]);
    }
  };
  
  // Handle destination selection
  const handleSelectDestination = (destination) => {
    setSelectedDestination(destination);
    setFormData({ ...formData, destination: destination.name });
    setFilteredDestinations([]);
  };
  
  // Handle checkbox change for interests
  const handleInterestChange = (interest) => {
    const updatedInterests = [...formData.interests];
    
    if (updatedInterests.includes(interest)) {
      // Remove if already selected
      const index = updatedInterests.indexOf(interest);
      updatedInterests.splice(index, 1);
    } else {
      // Add if not selected
      updatedInterests.push(interest);
    }
    
    setFormData({ ...formData, interests: updatedInterests });
  };
  
  // Handle form submission
  const handleCreateItinerary = () => {
    // Create a new itinerary object
    const newItinerary = {
      id: Date.now().toString(),
      ...formData,
      startDate: formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : null,
      endDate: formData.endDate ? format(formData.endDate, 'yyyy-MM-dd') : null,
      location: selectedDestination,
      days: [],
      accommodations: [],
      transportations: [],
      totalCarbonFootprint: 0
    };
    
    // Pass to parent component
    onCreateItinerary(newItinerary);
  };
  
  // Render form steps
  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="destination">Where would you like to go?</Label>
              <Input
                id="destination"
                placeholder="Search for a destination..."
                value={formData.destination}
                onChange={handleDestinationSearch}
              />
              
              {filteredDestinations.length > 0 && (
                <div className="bg-white rounded-md shadow-md border mt-1 absolute z-10 w-full max-w-md">
                  {filteredDestinations.map(dest => (
                    <div 
                      key={dest.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer border-b flex items-center"
                      onClick={() => handleSelectDestination(dest)}
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 mr-2 overflow-hidden">
                        {dest.image && (
                          <img src={`${dest.image}?w=100&h=100&fit=crop`} alt={dest.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{dest.name}</div>
                        <div className="text-xs text-gray-500">{dest.country}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {formData.startDate ? (
                        format(formData.startDate, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => setFormData({ ...formData, startDate: date })}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {formData.endDate ? (
                        format(formData.endDate, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => setFormData({ ...formData, endDate: date })}
                      disabled={(date) => date < (formData.startDate || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">Daily Budget (USD)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="Enter your daily budget..."
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={() => setStep(2)}
                disabled={!formData.destination || !formData.startDate || !formData.endDate || !formData.budget}
              >
                Next
              </Button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>What are your interests?</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['adventure', 'relaxation', 'culture', 'food', 'nature', 'art', 'nightlife', 'shopping'].map(interest => (
                  <div 
                    key={interest}
                    className={`border rounded-md p-2 cursor-pointer ${
                      formData.interests.includes(interest) ? 'bg-primary/10 border-primary' : ''
                    }`}
                    onClick={() => handleInterestChange(interest)}
                  >
                    <div className="text-sm font-medium capitalize">{interest}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pace">Travel Pace</Label>
              <Select
                value={formData.pace}
                onValueChange={(value) => setFormData({ ...formData, pace: value })}
              >
                <SelectTrigger id="pace">
                  <SelectValue placeholder="Select pace" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relaxed">Relaxed - Few activities per day</SelectItem>
                  <SelectItem value="moderate">Moderate - Balanced pace</SelectItem>
                  <SelectItem value="busy">Busy - Pack in as much as possible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="travelMode">Preferred Transportation</Label>
              <Select
                value={formData.travelMode}
                onValueChange={(value) => setFormData({ ...formData, travelMode: value })}
              >
                <SelectTrigger id="travelMode">
                  <SelectValue placeholder="Select transportation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flight">Flights</SelectItem>
                  <SelectItem value="train">Trains</SelectItem>
                  <SelectItem value="bus">Buses</SelectItem>
                  <SelectItem value="car">Car Rentals</SelectItem>
                  <SelectItem value="mixed">Mixed (Flexible)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companions">Travel Companions</Label>
              <Select
                value={formData.companions}
                onValueChange={(value) => setFormData({ ...formData, companions: value })}
              >
                <SelectTrigger id="companions">
                  <SelectValue placeholder="Select companions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo Travel</SelectItem>
                  <SelectItem value="couple">Couple</SelectItem>
                  <SelectItem value="family">Family with Kids</SelectItem>
                  <SelectItem value="friends">Friends Group</SelectItem>
                  <SelectItem value="business">Business Trip</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleCreateItinerary}>
                Create Itinerary
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create Your Dream Itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        {renderFormStep()}
      </CardContent>
    </Card>
  );
};

export default ItineraryForm;
