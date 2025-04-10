
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Clock, MapPin, DollarSign, Leaf } from 'lucide-react';

const ActivityCard = ({ activity, onAddToItinerary, showAddButton = true }) => {
  const getCarbonLabel = (footprint) => {
    if (footprint < 5) return 'Low Carbon Impact';
    if (footprint < 15) return 'Medium Carbon Impact';
    return 'High Carbon Impact';
  };
  
  const getCarbonColor = (footprint) => {
    if (footprint < 5) return 'text-green-600';
    if (footprint < 15) return 'text-amber-600';
    return 'text-red-600';
  };
  
  return (
    <Card className="h-full flex flex-col">
      <div className="h-40 overflow-hidden relative">
        {activity.pictures && activity.pictures.length > 0 ? (
          <img 
            src={activity.pictures[0]} 
            alt={activity.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        
        {activity.type && (
          <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
            {activity.type}
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-base line-clamp-2">{activity.name}</CardTitle>
      </CardHeader>
      
      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {activity.shortDescription || activity.description || 'No description available'}
        </p>
        
        <div className="space-y-1 mt-2">
          {activity.location && (
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span className="truncate">{activity.location}</span>
            </div>
          )}
          
          {(activity.startTime && activity.endTime) && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{activity.startTime} - {activity.endTime}</span>
            </div>
          )}
          
          {activity.price && (
            <div className="flex items-center text-xs text-gray-500">
              <DollarSign className="h-3.5 w-3.5 mr-1" />
              <span>
                {typeof activity.price === 'object' 
                  ? `${activity.price.amount} ${activity.price.currencyCode}` 
                  : activity.price}
              </span>
            </div>
          )}
          
          {activity.carbonFootprint !== undefined && (
            <div className={`flex items-center text-xs ${getCarbonColor(activity.carbonFootprint)}`}>
              <Leaf className="h-3.5 w-3.5 mr-1" />
              <span>{getCarbonLabel(activity.carbonFootprint)}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      {showAddButton && (
        <CardFooter className="pt-2">
          <Button 
            className="w-full" 
            size="sm"
            onClick={() => onAddToItinerary(activity)}
          >
            Add to Itinerary
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ActivityCard;
