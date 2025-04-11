
import React from 'react';
import { Card, CardContent } from './ui/card';
import { MapPin, Clock, DollarSign } from 'lucide-react';

const ActivityCard = ({ activity }) => {
  // Format time from 24-hour to 12-hour with AM/PM
  const formatTime = (time) => {
    if (!time) return '';
    
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };
  
  // Get activity type icon and color
  const getActivityTypeStyles = (type) => {
    switch (type) {
      case 'sightseeing':
        return { bg: 'bg-blue-100', text: 'text-blue-700' };
      case 'museum':
        return { bg: 'bg-purple-100', text: 'text-purple-700' };
      case 'outdoors':
        return { bg: 'bg-green-100', text: 'text-green-700' };
      case 'dining':
        return { bg: 'bg-orange-100', text: 'text-orange-700' };
      case 'shopping':
        return { bg: 'bg-pink-100', text: 'text-pink-700' };
      case 'entertainment':
        return { bg: 'bg-indigo-100', text: 'text-indigo-700' };
      case 'relaxation':
        return { bg: 'bg-teal-100', text: 'text-teal-700' };
      case 'freeTime':
        return { bg: 'bg-gray-100', text: 'text-gray-700' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700' };
    }
  };
  
  const typeStyles = getActivityTypeStyles(activity.type);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeStyles.bg} ${typeStyles.text} capitalize`}>
                  {activity.type}
                </div>
                <div className="text-sm flex items-center text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{formatTime(activity.startTime)} - {formatTime(activity.endTime)}</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-lg mt-1">{activity.title}</h3>
            </div>
            
            {activity.cost > 0 && (
              <div className="flex items-center text-sm font-medium">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                <span>₹{activity.cost.toLocaleString()}</span>
              </div>
            )}
          </div>
          
          {activity.location && (
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="truncate">{activity.location.name}</span>
            </div>
          )}
          
          {activity.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
          )}
        </div>
        
        {activity.pictures && activity.pictures.length > 0 && (
          <div className="h-36 overflow-hidden">
            <img 
              src={activity.pictures[0]} 
              alt={activity.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder.svg';
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
