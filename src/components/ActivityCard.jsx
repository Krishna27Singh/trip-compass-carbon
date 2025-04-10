
import React from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Clock, MapPin, DollarSign, Leaf } from 'lucide-react';

const ActivityCard = ({ activity, onAddToItinerary }) => {
  // Helper functions
  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };
  
  const formatPrice = (price) => {
    if (!price) return 'Price currently not available';
    if (typeof price === 'number') return `$${price}`;
    if (price.amount && price.currencyCode) return `${price.amount} ${price.currencyCode}`;
    return 'Price currently not available';
  };
  
  // Image handling with proper fallback
  const renderImage = () => {
    // Check if pictures array exists and has at least one valid URL
    const hasValidImage = activity.pictures && 
                          Array.isArray(activity.pictures) && 
                          activity.pictures.length > 0 && 
                          typeof activity.pictures[0] === 'string';
    
    if (!hasValidImage) {
      return (
        <div className="h-40 bg-gradient-to-r from-teal-100 to-blue-100 flex items-center justify-center">
          <div className="text-teal-700 font-medium">No image available</div>
        </div>
      );
    }
    
    return (
      <div className="h-40 relative overflow-hidden">
        <img 
          src={activity.pictures[0]} 
          alt={activity.name || 'Activity image'} 
          className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder.svg';
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-20"></div>
      </div>
    );
  };
  
  // Activity type badge color
  const getTypeColorClass = (type) => {
    const typeColors = {
      sightseeing: 'bg-blue-100 text-blue-800',
      museum: 'bg-purple-100 text-purple-800',
      outdoors: 'bg-green-100 text-green-800',
      dining: 'bg-orange-100 text-orange-800',
      food: 'bg-orange-100 text-orange-800',
      shopping: 'bg-pink-100 text-pink-800',
      entertainment: 'bg-indigo-100 text-indigo-800',
      relaxation: 'bg-teal-100 text-teal-800',
      nightlife: 'bg-violet-100 text-violet-800'
    };
    
    return typeColors[type] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all border-teal-100">
      {renderImage()}
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-2 mr-2">{activity.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getTypeColorClass(activity.type)}`}>
            {activity.type ? activity.type.charAt(0).toUpperCase() + activity.type.slice(1) : 'Activity'}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span className="line-clamp-1">{activity.location || 'Location not specified'}</span>
        </div>
        
        {activity.startTime && activity.endTime && (
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{formatTime(activity.startTime)} - {formatTime(activity.endTime)}</span>
          </div>
        )}
        
        <div className="mb-3">
          {activity.description ? (
            <p className="text-sm text-gray-600 line-clamp-3">{activity.description}</p>
          ) : (
            <p className="text-sm text-gray-500 italic">No description available</p>
          )}
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <DollarSign className="h-3.5 w-3.5 mr-1 text-gray-500" />
            <span className="text-gray-600">{formatPrice(activity.price)}</span>
          </div>
          
          {activity.carbonFootprint && (
            <div className="flex items-center text-green-600">
              <Leaf className="h-3.5 w-3.5 mr-1" />
              <span>{activity.carbonFootprint} kg CO₂</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0">
        <Button 
          className="w-full bg-teal-600 hover:bg-teal-700 transition-colors" 
          onClick={() => onAddToItinerary(activity)}
        >
          Add to Itinerary
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityCard;
