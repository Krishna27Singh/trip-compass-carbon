
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Trash2, FileEdit, Calendar, MapPin } from 'lucide-react';

const PastItineraries = ({ itineraries, onDelete, onEdit, onCreate }) => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Travel Itineraries</h1>
        <Button onClick={onCreate}>Create New Itinerary</Button>
      </div>
      
      {itineraries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-5xl mb-4">✈️</div>
          <h2 className="text-xl font-semibold mb-2">No Itineraries Yet</h2>
          <p className="text-gray-600 mb-6">
            Start planning your next adventure by creating your first itinerary.
          </p>
          <Button onClick={onCreate}>Create New Itinerary</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map(itinerary => (
            <Card key={itinerary.id} className="overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 relative flex items-end">
                <div className="absolute inset-0 overflow-hidden">
                  {itinerary.location?.image && (
                    <img 
                      src={`${itinerary.location.image}?w=500&h=300&fit=crop`} 
                      alt={itinerary.destination} 
                      className="w-full h-full object-cover opacity-70"
                    />
                  )}
                </div>
                <div className="relative p-4 text-white w-full">
                  <div className="flex items-center space-x-1 bg-black bg-opacity-30 inline-block px-2 py-1 rounded text-xs mb-1">
                    <Calendar className="h-3 w-3" />
                    <span>{itinerary.startDate} - {itinerary.endDate}</span>
                  </div>
                  <h2 className="text-xl font-bold">{itinerary.destination}</h2>
                </div>
              </div>
              
              <CardContent className="py-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{itinerary.location?.name || itinerary.destination}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {itinerary.interests?.map(interest => (
                      <span 
                        key={interest} 
                        className="bg-gray-100 px-2 py-0.5 rounded text-xs capitalize"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-600">
                        {itinerary.days?.length || 0} days
                      </div>
                      <div className="text-sm text-gray-600">
                        {itinerary.activities?.length || itinerary.days?.reduce((sum, day) => sum + day.activities.length, 0) || 0} activities
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <div className="text-sm font-medium">{itinerary.totalCarbonFootprint || 0}</div>
                      <div className="text-xs text-gray-500">kg CO₂</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDelete(itinerary.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button 
                  size="sm"
                  onClick={() => onEdit(itinerary)}
                >
                  <FileEdit className="h-4 w-4 mr-1" />
                  View & Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastItineraries;
