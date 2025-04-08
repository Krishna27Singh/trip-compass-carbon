
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from '@/types/itinerary';
import { Clock, MapPin, DollarSign } from 'lucide-react';
import CarbonFootprint from './CarbonFootprint';

interface ActivityItemProps {
  activity: Activity;
  showDetails?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  draggable?: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  showDetails = false,
  onEdit,
  onDelete,
  draggable = false
}) => {
  const { title, type, location, startTime, endTime, description, cost, carbonFootprint } = activity;
  
  // Format time
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };
  
  // Activity type badge color
  const typeColors: Record<string, string> = {
    sightseeing: 'bg-blue-100 text-blue-800',
    museum: 'bg-purple-100 text-purple-800',
    outdoors: 'bg-green-100 text-green-800',
    dining: 'bg-orange-100 text-orange-800',
    shopping: 'bg-pink-100 text-pink-800',
    entertainment: 'bg-indigo-100 text-indigo-800',
    relaxation: 'bg-teal-100 text-teal-800',
    freeTime: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <Card 
      className={`
        mb-3 overflow-hidden transition-all
        ${draggable ? 'cursor-move' : ''}
        ${onEdit || onDelete ? 'hover:shadow-md' : ''}
      `}
    >
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <h3 className="font-medium">{title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>
                    {formatTime(startTime)} - {formatTime(endTime)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${typeColors[type] || 'bg-gray-100'}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </div>
          </div>
          
          {showDetails && (
            <div className="p-4">
              <div className="flex items-start gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <span className="text-sm">{location.name}</span>
              </div>
              
              {description && (
                <p className="text-sm text-gray-600 mb-3">{description}</p>
              )}
              
              <div className="flex items-center justify-between mt-2">
                {typeof cost === 'number' && (
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                    <span>${cost}</span>
                  </div>
                )}
                
                {typeof carbonFootprint === 'number' && (
                  <CarbonFootprint footprint={carbonFootprint} />
                )}
              </div>
              
              {(onEdit || onDelete) && (
                <div className="flex justify-end gap-2 mt-3">
                  {onEdit && (
                    <button
                      onClick={onEdit}
                      className="text-xs px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  
                  {onDelete && (
                    <button
                      onClick={onDelete}
                      className="text-xs px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityItem;
