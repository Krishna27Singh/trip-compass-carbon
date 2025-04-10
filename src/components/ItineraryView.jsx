
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar, Clock, MapPin, Plus, Trash2, FilePlus, Save, AlertTriangle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ItineraryMap from './Map';
import ActivityCard from './ActivityCard';
import amadeusAPI from '../services/amadeusAPI';
import weatherAPI from '../services/weatherAPI';
import databaseAPI from '../services/databaseAPI';

const ItineraryView = ({ itinerary: initialItinerary, onBack, onSave, onDelete }) => {
  const [itinerary, setItinerary] = useState(initialItinerary);
  const [currentTab, setCurrentTab] = useState('overview');
  const [localActivities, setLocalActivities] = useState([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [activityForm, setActivityForm] = useState({
    name: '',
    type: 'sightseeing',
    location: '',
    lat: 0,
    lng: 0,
    startTime: '09:00',
    endTime: '11:00',
    description: '',
    price: ''
  });
  const [weatherData, setWeatherData] = useState({});
  
  // Initialize days when the itinerary is loaded
  useEffect(() => {
    if (initialItinerary && !initialItinerary.days?.length) {
      initializeDays();
    }
    
    // Load activities from Amadeus API
    loadLocalActivities();
    
    // Load weather data
    loadWeatherData();
  }, [initialItinerary]);
  
  // Initialize days based on start and end dates
  const initializeDays = () => {
    if (!initialItinerary.startDate || !initialItinerary.endDate) return;
    
    const startDate = new Date(initialItinerary.startDate);
    const endDate = new Date(initialItinerary.endDate);
    const numberOfDays = differenceInDays(endDate, startDate) + 1;
    
    const days = [];
    for (let i = 0; i < numberOfDays; i++) {
      const currentDate = addDays(startDate, i);
      days.push({
        id: uuidv4(),
        date: format(currentDate, 'yyyy-MM-dd'),
        activities: []
      });
    }
    
    setItinerary({
      ...initialItinerary,
      days
    });
  };
  
  // Load activities from Amadeus API
  const loadLocalActivities = async () => {
    if (!initialItinerary.location) return;
    
    setIsLoadingActivities(true);
    try {
      const activities = await amadeusAPI.getActivitiesByLocation(
        initialItinerary.location.lat,
        initialItinerary.location.lng
      );
      
      // Process and map activities
      const mappedActivities = activities.map(activity => ({
        id: activity.id,
        name: activity.name,
        description: activity.shortDescription || activity.description,
        location: activity.location?.name,
        lat: activity.geoCode?.latitude || initialItinerary.location.lat,
        lng: activity.geoCode?.longitude || initialItinerary.location.lng,
        price: activity.price,
        pictures: activity.pictures ? [activity.pictures.url] : [],
        type: mapCategoryToType(activity.categoryGroups?.[0]?.groupCode),
        startTime: '09:00',
        endTime: '12:00',
        carbonFootprint: Math.floor(Math.random() * 20) // Mock footprint for demo
      }));
      
      setLocalActivities(mappedActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
      // Load some mock activities if API fails
      setLocalActivities([
        {
          id: uuidv4(),
          name: 'Visit Local Museum',
          description: 'Explore the history and culture of the region.',
          location: initialItinerary.location.name,
          lat: initialItinerary.location.lat,
          lng: initialItinerary.location.lng,
          price: { amount: '15', currencyCode: 'USD' },
          pictures: ['https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3'],
          type: 'museum',
          startTime: '09:00',
          endTime: '12:00',
          carbonFootprint: 3
        },
        {
          id: uuidv4(),
          name: 'Local Food Tour',
          description: 'Taste the local cuisine and learn about culinary traditions.',
          location: initialItinerary.location.name,
          lat: initialItinerary.location.lat + 0.01,
          lng: initialItinerary.location.lng + 0.01,
          price: { amount: '45', currencyCode: 'USD' },
          pictures: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836'],
          type: 'food',
          startTime: '13:00',
          endTime: '16:00',
          carbonFootprint: 8
        },
        {
          id: uuidv4(),
          name: 'Sunset Boat Trip',
          description: 'Enjoy the beautiful sunset from the water.',
          location: initialItinerary.location.name,
          lat: initialItinerary.location.lat - 0.01,
          lng: initialItinerary.location.lng - 0.01,
          price: { amount: '30', currencyCode: 'USD' },
          pictures: ['https://images.unsplash.com/photo-1468581264429-2548ef9eb732'],
          type: 'outdoors',
          startTime: '17:00',
          endTime: '20:00',
          carbonFootprint: 12
        }
      ]);
    } finally {
      setIsLoadingActivities(false);
    }
  };
  
  // Load weather data for the itinerary days
  const loadWeatherData = async () => {
    if (!initialItinerary.location || !initialItinerary.days?.length) return;
    
    try {
      const forecastData = await weatherAPI.getWeatherForecast(
        initialItinerary.location.lat,
        initialItinerary.location.lng
      );
      
      if (!forecastData || !forecastData.forecast || !forecastData.forecast.forecastday) {
        return;
      }
      
      // Create a map of date to weather data
      const weatherByDate = {};
      forecastData.forecast.forecastday.forEach(day => {
        weatherByDate[day.date] = {
          condition: day.day.condition.text,
          icon: day.day.condition.icon,
          maxTemp: day.day.maxtemp_c,
          minTemp: day.day.mintemp_c,
          chanceOfRain: day.day.daily_chance_of_rain
        };
      });
      
      setWeatherData(weatherByDate);
    } catch (error) {
      console.error('Error loading weather data:', error);
    }
  };
  
  // Map Amadeus category to activity type
  const mapCategoryToType = (categoryCode) => {
    const categoryMap = {
      SIGHTS: 'sightseeing',
      SHOPPING: 'shopping',
      RESTAURANT: 'food',
      SPORTS: 'outdoors',
      NIGHTLIFE: 'nightlife',
      EXHIBITION: 'museum'
    };
    
    return categoryMap[categoryCode] || 'sightseeing';
  };
  
  // Calculate total carbon footprint
  const calculateTotalCarbonFootprint = () => {
    let total = 0;
    
    // Add up all activity footprints
    itinerary.days?.forEach(day => {
      day.activities.forEach(activity => {
        if (activity.carbonFootprint) {
          total += activity.carbonFootprint;
        }
      });
    });
    
    // Add transportation footprint if exists
    itinerary.transportations?.forEach(transport => {
      if (transport.carbonFootprint) {
        total += transport.carbonFootprint;
      }
    });
    
    // Add accommodation footprint if exists
    itinerary.accommodations?.forEach(accommodation => {
      if (accommodation.carbonFootprint) {
        total += accommodation.carbonFootprint;
      }
    });
    
    return total;
  };
  
  // Save the updated itinerary
  const saveItinerary = () => {
    const updatedItinerary = {
      ...itinerary,
      totalCarbonFootprint: calculateTotalCarbonFootprint()
    };
    
    setItinerary(updatedItinerary);
    onSave(updatedItinerary);
  };
  
  // Handle adding an activity to the itinerary
  const handleAddActivity = (dayId) => {
    setSelectedDayId(dayId);
    const day = itinerary.days.find(d => d.id === dayId);
    setSelectedDay(day);
    setShowActivityDialog(true);
  };
  
  // Handle adding from suggested activities
  const handleAddToItinerary = (activity) => {
    if (!selectedDayId) return;
    
    // Format the activity for our itinerary
    const newActivity = {
      id: uuidv4(),
      name: activity.name,
      type: activity.type || 'sightseeing',
      location: {
        id: uuidv4(),
        name: activity.location || initialItinerary.location.name,
        lat: activity.lat || initialItinerary.location.lat,
        lng: activity.lng || initialItinerary.location.lng,
      },
      startTime: activity.startTime || '09:00',
      endTime: activity.endTime || '12:00',
      description: activity.description || '',
      price: activity.price || { amount: '0', currencyCode: 'USD' },
      carbonFootprint: activity.carbonFootprint || 5,
      pictures: activity.pictures || []
    };
    
    // Add to the selected day
    const updatedDays = itinerary.days.map(day => {
      if (day.id === selectedDayId) {
        return {
          ...day,
          activities: [...day.activities, newActivity]
        };
      }
      return day;
    });
    
    setItinerary({
      ...itinerary,
      days: updatedDays
    });
    
    setShowActivityDialog(false);
  };
  
  // Handle custom activity form submission
  const handleSubmitCustomActivity = () => {
    const { name, type, location, lat, lng, startTime, endTime, description, price } = activityForm;
    
    const newActivity = {
      id: uuidv4(),
      name,
      type,
      location: {
        id: uuidv4(),
        name: location || initialItinerary.location.name,
        lat: lat || initialItinerary.location.lat,
        lng: lng || initialItinerary.location.lng,
      },
      startTime,
      endTime,
      description,
      price: { amount: price, currencyCode: 'USD' },
      carbonFootprint: Math.floor(Math.random() * 15) + 2, // Random carbon footprint for demo
    };
    
    // Add to the selected day
    const updatedDays = itinerary.days.map(day => {
      if (day.id === selectedDayId) {
        return {
          ...day,
          activities: [...day.activities, newActivity]
        };
      }
      return day;
    });
    
    setItinerary({
      ...itinerary,
      days: updatedDays
    });
    
    // Reset form
    setActivityForm({
      name: '',
      type: 'sightseeing',
      location: '',
      lat: 0,
      lng: 0,
      startTime: '09:00',
      endTime: '11:00',
      description: '',
      price: ''
    });
    
    setShowActivityDialog(false);
  };
  
  // Handle removing an activity
  const handleRemoveActivity = (dayId, activityId) => {
    const updatedDays = itinerary.days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: day.activities.filter(activity => activity.id !== activityId)
        };
      }
      return day;
    });
    
    setItinerary({
      ...itinerary,
      days: updatedDays
    });
  };
  
  // Generate locations for the map
  const getMapLocations = () => {
    const locations = [];
    
    // Add all activity locations
    itinerary.days?.forEach(day => {
      day.activities.forEach(activity => {
        if (activity.location) {
          locations.push({
            id: activity.id,
            name: activity.name,
            lat: activity.location.lat,
            lng: activity.location.lng,
            description: activity.description
          });
        }
      });
    });
    
    // Add main destination if no activities
    if (locations.length === 0 && itinerary.location) {
      locations.push({
        id: 'destination',
        name: itinerary.location.name,
        lat: itinerary.location.lat,
        lng: itinerary.location.lng
      });
    }
    
    return locations;
  };
  
  // Format activity price for display
  const formatPrice = (price) => {
    if (!price) return 'Free';
    
    if (typeof price === 'object') {
      return `${price.amount} ${price.currencyCode}`;
    }
    
    return `${price} USD`;
  };
  
  // Get a weather icon and condition text for a specific date
  const getWeatherForDay = (date) => {
    return weatherData[date] || null;
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{itinerary.destination}</h1>
          <p className="text-gray-500">
            {itinerary.startDate} to {itinerary.endDate} · {itinerary.days?.length || 0} days
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={saveItinerary}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="destructive" onClick={() => onDelete(itinerary.id)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4 bg-green-50 p-3 rounded-md">
        <div className="flex items-center">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <Leaf className="h-5 w-5 text-green-700" />
          </div>
          <div>
            <h3 className="font-medium">Carbon Footprint</h3>
            <p className="text-sm text-gray-600">This trip's estimated impact</p>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-2xl font-bold">{calculateTotalCarbonFootprint()}</span>
          <span className="ml-1 text-sm">kg CO₂</span>
        </div>
      </div>
      
      <Tabs defaultValue={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="itinerary">Daily Itinerary</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="activities">Suggested Activities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Trip Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Destination</h3>
                      <p className="text-gray-600">{itinerary.destination}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Travel Dates</h3>
                      <p className="text-gray-600">{itinerary.startDate} to {itinerary.endDate}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Budget</h3>
                      <p className="text-gray-600">${itinerary.budget} per day</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Travel Mode</h3>
                      <p className="text-gray-600 capitalize">{itinerary.travelMode}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Companions</h3>
                      <p className="text-gray-600 capitalize">{itinerary.companions}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Pace</h3>
                      <p className="text-gray-600 capitalize">{itinerary.pace}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {itinerary.interests?.map(interest => (
                        <span 
                          key={interest}
                          className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs capitalize"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Environmental Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded-md">
                    <div className="text-3xl font-bold text-center mb-2">
                      {calculateTotalCarbonFootprint()} kg
                    </div>
                    <p className="text-center text-sm text-gray-600">
                      Total estimated CO₂ emissions
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">How does this compare?</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>Average one-way flight (1000km)</span>
                        <span className="font-medium">250 kg</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Average car trip (100km)</span>
                        <span className="font-medium">20 kg</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Average daily emissions per person</span>
                        <span className="font-medium">22 kg</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="itinerary">
          <div className="space-y-6">
            {itinerary.days?.map(day => (
              <Card key={day.id} className="overflow-hidden">
                <CardHeader className="pb-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                      <CardTitle className="text-lg">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </CardTitle>
                    </div>
                    
                    {getWeatherForDay(day.date) && (
                      <div className="flex items-center bg-white px-3 py-1 rounded-full text-sm border">
                        <img 
                          src={getWeatherForDay(day.date).icon} 
                          alt="Weather" 
                          className="w-6 h-6 mr-1"
                        />
                        <span>{getWeatherForDay(day.date).maxTemp}°C</span>
                        {getWeatherForDay(day.date).chanceOfRain > 20 && (
                          <span className="ml-1 text-blue-500">({getWeatherForDay(day.date).chanceOfRain}% rain)</span>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="py-4">
                  {day.activities.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-2">No activities planned for this day yet.</p>
                      <Button onClick={() => handleAddActivity(day.id)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Activity
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {day.activities.map((activity, index) => (
                        <div 
                          key={activity.id}
                          className="flex border-b last:border-0 pb-4 last:pb-0"
                        >
                          <div className="w-20 min-w-[5rem] text-center">
                            <div className="font-medium">{activity.startTime}</div>
                            <div className="text-xs text-gray-500">to {activity.endTime}</div>
                          </div>
                          
                          <div className="ml-4 flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{activity.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                
                                <div className="flex items-center text-xs text-gray-500 mt-2">
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  <span>{activity.location.name}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">
                                  {formatPrice(activity.price)}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRemoveActivity(day.id, activity.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                                </Button>
                              </div>
                            </div>
                            
                            {activity.carbonFootprint && (
                              <div className="flex items-center mt-2">
                                <div className="flex items-center text-xs text-green-600">
                                  <Leaf className="h-3.5 w-3.5 mr-1" />
                                  <span>{activity.carbonFootprint} kg CO₂</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-center pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAddActivity(day.id)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Another Activity
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="map">
          <Card>
            <CardContent className="p-0 overflow-hidden rounded-lg">
              <div className="h-[600px]">
                <ItineraryMap
                  locations={getMapLocations()}
                  transportations={itinerary.transportations || []}
                  height="600px"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Suggested Activities</h2>
            <p className="text-gray-600">
              Explore these activities in {itinerary.destination} based on your interests.
            </p>
          </div>
          
          {isLoadingActivities ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2 text-gray-600">Loading activities...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {localActivities.length > 0 ? (
                localActivities.map(activity => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onAddToItinerary={() => {
                      if (!selectedDayId && itinerary.days?.length > 0) {
                        setSelectedDayId(itinerary.days[0].id);
                        setSelectedDay(itinerary.days[0]);
                      }
                      handleAddToItinerary(activity);
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-2" />
                  <h3 className="text-lg font-semibold mb-1">No activities found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find activities for this destination.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => handleAddActivity(itinerary.days[0]?.id)}
                  >
                    <FilePlus className="h-4 w-4 mr-2" />
                    Create Custom Activity
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Add Activity Dialog */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Add Activity to {selectedDay && new Date(selectedDay.date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric' 
              })}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4">
                <Label htmlFor="name">Activity Name</Label>
                <Input
                  id="name"
                  value={activityForm.name}
                  onChange={(e) => setActivityForm({ ...activityForm, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-4 sm:col-span-2">
                <Label htmlFor="type">Activity Type</Label>
                <Select
                  value={activityForm.type}
                  onValueChange={(value) => setActivityForm({ ...activityForm, type: value })}
                >
                  <SelectTrigger id="type" className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sightseeing">Sightseeing</SelectItem>
                    <SelectItem value="museum">Museum</SelectItem>
                    <SelectItem value="outdoors">Outdoors</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="relaxation">Relaxation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-4 sm:col-span-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  value={activityForm.price}
                  onChange={(e) => setActivityForm({ ...activityForm, price: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-4">
                <Label htmlFor="location">Location Name</Label>
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                  <Input
                    id="location"
                    value={activityForm.location}
                    onChange={(e) => setActivityForm({ ...activityForm, location: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={activityForm.startTime}
                  onChange={(e) => setActivityForm({ ...activityForm, startTime: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={activityForm.endTime}
                  onChange={(e) => setActivityForm({ ...activityForm, endTime: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-4">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
            
            {/* Show suggested activities list */}
            {localActivities.length > 0 && (
              <div>
                <Label className="mb-2 block">Quick Add from Suggestions</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {localActivities.slice(0, 6).map((activity) => (
                    <div
                      key={activity.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer border rounded-md text-xs"
                      onClick={() => handleAddToItinerary(activity)}
                    >
                      <div className="font-medium truncate">{activity.name}</div>
                      <div className="flex justify-between mt-1">
                        <span className="capitalize">{activity.type}</span>
                        <span>{formatPrice(activity.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivityDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitCustomActivity}
              disabled={!activityForm.name}
            >
              Add to Itinerary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItineraryView;
