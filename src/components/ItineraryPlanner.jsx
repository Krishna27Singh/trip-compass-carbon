
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { MapPin, Clock, DollarSign, Map, Calendar, ListTodo, Settings, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import DailyItinerary from './DailyItinerary';
import ItineraryMap from './Map';
import ItinerarySummary from './ItinerarySummary';
import TripForm from './TripForm';
import amadeusAPI from '../services/amadeusAPI';
import { useToast } from "../hooks/use-toast";

const ItineraryPlanner = () => {
  const [currentItinerary, setCurrentItinerary] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [showAddActivityDialog, setShowAddActivityDialog] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [activityForm, setActivityForm] = useState({
    title: '',
    type: 'sightseeing',
    locationName: '',
    lat: 0,
    lng: 0,
    startTime: '09:00',
    endTime: '11:00',
    description: '',
    cost: 0
  });
  const [suggestedActivities, setSuggestedActivities] = useState([]);
  const [isCreatingItinerary, setIsCreatingItinerary] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const { toast } = useToast();
  
  // Mock function for calculating carbon footprint
  const calculateTotalCarbonFootprint = () => {
    // This would be implemented in a real app
    console.log("Calculating carbon footprint");
  };
  
  // Mock function for adding an activity
  const addActivity = (dayId, activity) => {
    if (!currentItinerary) return;
    
    // Create a new copy of the itinerary
    const updatedItinerary = {
      ...currentItinerary,
      days: currentItinerary.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            activities: [...day.activities, { ...activity, id: uuidv4() }]
          };
        }
        return day;
      })
    };
    
    setCurrentItinerary(updatedItinerary);
    toast({
      title: "Activity Added",
      description: `${activity.title} has been added to your itinerary.`,
    });
  };
  
  // Calculate total carbon footprint whenever the itinerary changes
  useEffect(() => {
    if (currentItinerary) {
      calculateTotalCarbonFootprint();
    }
  }, [currentItinerary]);
  
  // Fetch activities from real API or fall back to mock data
  const getActivitiesForDestination = async (destination) => {
    setIsLoading(true);
    setLoadingError(null);
    setSuggestedActivities([]);
    
    try {
      console.log('Fetching activities for destination:', destination);
      let activitiesFromAPI = [];
      
      // Try to get activities by destination name first
      if (destination && destination.name) {
        console.log(`Fetching activities by destination name: ${destination.name}`);
        activitiesFromAPI = await amadeusAPI.getActivitiesByDestination(destination.name);
      }
      
      // If that fails or returns no results, try by coordinates
      if ((!activitiesFromAPI || activitiesFromAPI.length === 0) && destination && destination.lat && destination.lng) {
        console.log(`Fetching activities by coordinates: ${destination.lat}, ${destination.lng}`);
        activitiesFromAPI = await amadeusAPI.getActivitiesByLocation(destination.lat, destination.lng);
      }
      
      if (activitiesFromAPI && activitiesFromAPI.length > 0) {
        console.log(`Got ${activitiesFromAPI.length} activities from API`);
        // Transform API data to match our application format if needed
        const formattedActivities = activitiesFromAPI.map(activity => {
          return {
            id: activity.id || uuidv4(),
            title: activity.title || activity.name || "Unnamed Activity",
            type: activity.type || getActivityTypeFromName(activity.title || ""),
            location: {
              name: activity.location?.name || "Unknown Location",
              lat: activity.location?.lat || destination.lat,
              lng: activity.location?.lng || destination.lng,
              address: activity.location?.address || ""
            },
            startTime: activity.startTime || "10:00",
            endTime: activity.endTime || "12:00",
            description: activity.description || "",
            cost: activity.cost ? parseFloat(activity.cost) : 0,
            currencyCode: activity.currencyCode || "USD",
            pictures: activity.pictures || []
          };
        });
        
        setIsLoading(false);
        setSuggestedActivities(formattedActivities);
        return formattedActivities;
      }
      
      // Fallback to mock data if API returns no results
      console.log('No activities found from API, using mock data');
      const mockActivities = getMockActivities(destination);
      setSuggestedActivities(mockActivities);
      setIsLoading(false);
      return mockActivities;
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoadingError(`Failed to fetch activities: ${error.message}`);
      const mockActivities = getMockActivities(destination);
      setSuggestedActivities(mockActivities);
      setIsLoading(false);
      return mockActivities;
    }
  };
  
  // Helper function to guess activity type from name
  const getActivityTypeFromName = (name) => {
    name = name.toLowerCase();
    if (name.includes('museum') || name.includes('gallery')) return 'museum';
    if (name.includes('park') || name.includes('garden') || name.includes('hiking')) return 'outdoors';
    if (name.includes('restaurant') || name.includes('food') || name.includes('dinner') || name.includes('lunch')) return 'dining';
    if (name.includes('shop') || name.includes('market') || name.includes('store')) return 'shopping';
    if (name.includes('show') || name.includes('theater') || name.includes('cinema')) return 'entertainment';
    if (name.includes('spa') || name.includes('massage') || name.includes('relax')) return 'relaxation';
    // Default to sightseeing
    return 'sightseeing';
  };
  
  // Mock activities if API fails
  const getMockActivities = (destination) => {
    const mockActivities = [
      {
        id: uuidv4(),
        title: `Visit ${destination?.name || 'Local'} Museum`,
        type: "museum",
        location: {
          name: `${destination?.name || 'City'} Museum`,
          lat: destination?.lat || 40.7128,
          lng: destination?.lng || -74.006,
          address: `123 Museum St, ${destination?.name || 'City Center'}`
        },
        startTime: "10:00",
        endTime: "12:00",
        description: "Explore local history and culture at this fascinating museum.",
        cost: 15
      },
      {
        id: uuidv4(),
        title: `${destination?.name || 'City'} Park Walk`,
        type: "outdoors",
        location: {
          name: `${destination?.name || 'Central'} Park`,
          lat: destination?.lat ? destination.lat + 0.01 : 40.7812,
          lng: destination?.lng ? destination.lng + 0.01 : -73.9665,
          address: `Park Avenue, ${destination?.name || 'City Center'}`
        },
        startTime: "14:00",
        endTime: "16:00",
        description: "Enjoy the beautiful scenery and fresh air in this urban oasis.",
        cost: 0
      },
      {
        id: uuidv4(),
        title: "Local Cuisine Dinner",
        type: "dining",
        location: {
          name: `${destination?.name || 'Traditional'} Restaurant`,
          lat: destination?.lat ? destination.lat - 0.01 : 40.7234,
          lng: destination?.lng ? destination.lng - 0.01 : -73.9878,
          address: `456 Food St, ${destination?.name || 'Downtown'}`
        },
        startTime: "19:00",
        endTime: "21:00",
        description: "Experience authentic local flavors and culinary traditions.",
        cost: 35
      }
    ];
    
    return mockActivities;
  };
  
  // Fetch suggested activities for the destination
  useEffect(() => {
    const fetchSuggestedActivities = async () => {
      if (currentItinerary && showAddActivityDialog) {
        try {
          console.log('Fetching suggested activities for:', currentItinerary.destination);
          const activities = await getActivitiesForDestination(currentItinerary.destination);
          console.log('Setting suggested activities:', activities);
        } catch (error) {
          console.error('Error in fetchSuggestedActivities:', error);
          setLoadingError(`Failed to load activities: ${error.message}`);
        }
      }
    };
    
    fetchSuggestedActivities();
  }, [currentItinerary, showAddActivityDialog]);
  
  // Handle opening the add activity dialog
  const handleAddActivity = (dayId) => {
    setSelectedDayId(dayId);
    setShowAddActivityDialog(true);
  };
  
  // Handle activity form input changes
  const handleActivityFormChange = (field, value) => {
    setActivityForm({ ...activityForm, [field]: value });
  };
  
  // Handle adding a new activity
  const handleSubmitActivity = () => {
    if (!selectedDayId) return;
    
    const { title, type, locationName, lat, lng, startTime, endTime, description, cost } = activityForm;
    
    // Calculate duration in hours for carbon footprint calculation
    const startHours = parseInt(startTime.split(':')[0]);
    const startMinutes = parseInt(startTime.split(':')[1]);
    const endHours = parseInt(endTime.split(':')[0]);
    const endMinutes = parseInt(endTime.split(':')[1]);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    const durationHours = (endTotalMinutes - startTotalMinutes) / 60;
    
    // Calculate carbon footprint based on activity type and duration
    const carbonFootprint = 5; // Simplified calculation
    
    // Create location object
    const location = {
      id: uuidv4(),
      name: locationName,
      lat,
      lng
    };
    
    // Add the activity
    addActivity(selectedDayId, {
      title,
      type,
      location,
      startTime,
      endTime,
      description,
      cost: typeof cost === 'string' ? parseFloat(cost) : cost,
      carbonFootprint
    });
    
    // Reset form and close dialog
    setActivityForm({
      title: '',
      type: 'sightseeing',
      locationName: '',
      lat: 0,
      lng: 0,
      startTime: '09:00',
      endTime: '11:00',
      description: '',
      cost: 0
    });
    setShowAddActivityDialog(false);
  };
  
  // Handle using a suggested activity
  const handleUseSuggestedActivity = (activity) => {
    setActivityForm({
      title: activity.title,
      type: activity.type,
      locationName: activity.location.name,
      lat: activity.location.lat,
      lng: activity.location.lng,
      startTime: activity.startTime,
      endTime: activity.endTime,
      description: activity.description || '',
      cost: activity.cost || 0
    });
  };
  
  // Handle trip form completion
  const handleTripFormComplete = (newItinerary) => {
    setCurrentItinerary(newItinerary);
    setIsCreatingItinerary(false);
  };
  
  // If creating a new itinerary, show the trip form
  if (isCreatingItinerary) {
    return (
      <div className="container mx-auto py-6">
        <TripForm onComplete={handleTripFormComplete} />
      </div>
    );
  }
  
  // If no itinerary exists, show a message
  if (!currentItinerary) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">No Itinerary Found</h2>
        <p className="mb-6">Create a new itinerary to get started</p>
        <Button onClick={() => setIsCreatingItinerary(true)}>
          Create New Itinerary
        </Button>
      </div>
    );
  }
  
  // Extract locations for the map
  const mapLocations = currentItinerary.days?.flatMap(day => 
    day.activities.map(activity => activity.location)
  ) || [];
  
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="itinerary" className="flex items-center gap-1.5">
              <ListTodo className="h-4 w-4" />
              Itinerary
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-1.5">
              <Map className="h-4 w-4" />
              Map
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-1.5">
              <Settings className="h-4 w-4" />
              Overview
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="itinerary" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {currentItinerary.days?.map((day) => (
                <DailyItinerary 
                  key={day.id} 
                  day={day}
                  onAddActivity={handleAddActivity}
                />
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <ItinerarySummary itinerary={currentItinerary} className="sticky top-6" />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="map">
          <Card>
            <CardContent className="p-6">
              <ItineraryMap
                locations={mapLocations}
                transportations={currentItinerary.transportations || []}
                height="600px"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overview">
          <Card>
            <CardContent className="p-6">
              <ItinerarySummary itinerary={currentItinerary} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Activity Dialog */}
      <Dialog open={showAddActivityDialog} onOpenChange={setShowAddActivityDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Activity</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4">
                <Label htmlFor="title">Activity Title</Label>
                <Input
                  id="title"
                  value={activityForm.title}
                  onChange={(e) => handleActivityFormChange('title', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-4 sm:col-span-2">
                <Label htmlFor="type">Activity Type</Label>
                <Select
                  value={activityForm.type}
                  onValueChange={(value) => handleActivityFormChange('type', value)}
                >
                  <SelectTrigger id="type" className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sightseeing">Sightseeing</SelectItem>
                    <SelectItem value="museum">Museum</SelectItem>
                    <SelectItem value="outdoors">Outdoors</SelectItem>
                    <SelectItem value="dining">Dining</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="relaxation">Relaxation</SelectItem>
                    <SelectItem value="freeTime">Free Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-4 sm:col-span-2">
                <Label htmlFor="cost">Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={activityForm.cost}
                  onChange={(e) => handleActivityFormChange('cost', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-4">
                <Label htmlFor="location">Location Name</Label>
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                  <Input
                    id="location"
                    value={activityForm.locationName}
                    onChange={(e) => handleActivityFormChange('locationName', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="0.000001"
                  value={activityForm.lat}
                  onChange={(e) => handleActivityFormChange('lat', parseFloat(e.target.value))}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="0.000001"
                  value={activityForm.lng}
                  onChange={(e) => handleActivityFormChange('lng', parseFloat(e.target.value))}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-2">
                <Label className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Start Time
                </Label>
                <Input
                  type="time"
                  value={activityForm.startTime}
                  onChange={(e) => handleActivityFormChange('startTime', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-2">
                <Label className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  End Time
                </Label>
                <Input
                  type="time"
                  value={activityForm.endTime}
                  onChange={(e) => handleActivityFormChange('endTime', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-4">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={activityForm.description}
                  onChange={(e) => handleActivityFormChange('description', e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
            
            {/* Show error message if there was a problem loading activities */}
            {loadingError && (
              <div className="rounded-md bg-red-50 p-4 mt-2">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error loading activities</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{loadingError}</p>
                      <p className="mt-1">Using fallback activity suggestions instead.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading suggested activities...</p>
              </div>
            )}
            
            {/* Suggested activities section */}
            {!isLoading && suggestedActivities.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Suggested Activities:</h3>
                <div className="max-h-48 overflow-y-auto border rounded-md">
                  {suggestedActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                      onClick={() => handleUseSuggestedActivity(activity)}
                    >
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <span className="capitalize">{activity.type}</span>
                        {activity.cost > 0 ? (
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {activity.cost} {activity.currencyCode || "USD"}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Price not available</span>
                        )}
                      </div>
                      {activity.description ? (
                        <div className="text-xs mt-1 line-clamp-2 text-muted-foreground">
                          {activity.description}
                        </div>
                      ) : (
                        <div className="text-xs mt-1 italic text-muted-foreground">
                          No description available
                        </div>
                      )}
                      {activity.location?.address && (
                        <div className="text-xs mt-1 text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {activity.location.address}
                        </div>
                      )}
                      {activity.pictures && activity.pictures.length > 0 && (
                        <div className="mt-2 h-20 relative overflow-hidden rounded-sm">
                          <img 
                            src={activity.pictures[0]} 
                            alt={activity.title}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder.svg'; 
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* No activities found message */}
            {!isLoading && suggestedActivities.length === 0 && !loadingError && (
              <div className="text-center py-4 border rounded-md">
                <p className="text-muted-foreground">No suggested activities found.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try entering activity details manually or check your connection.
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddActivityDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitActivity}
              disabled={!activityForm.title || !activityForm.locationName}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Add Activity
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItineraryPlanner;
