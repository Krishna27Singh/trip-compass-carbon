
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from '@/types/itinerary';
import { Clock, MapPin, DollarSign, Trash2, Edit } from 'lucide-react';
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
    try {
      const [hours, minutes] = time.split(':');
      const h = parseInt(hours);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedHours = h % 12 || 12;
      return `${formattedHours}:${minutes} ${ampm}`;
    } catch (error) {
      return time; // Return original if parsing fails
    }
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
        mb-3 overflow-hidden transition-all hover:shadow-md
        ${draggable ? 'cursor-move' : ''}
      `}
    >
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-teal-50 to-white">
            <h3 className="font-medium text-lg text-teal-800">{title}</h3>
            
            <div>
              <span className={`text-xs px-2 py-1 rounded-full ${typeColors[type] || 'bg-gray-100'}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </div>
          </div>
          
          {showDetails && (
            <div className="p-4">
              <div className="flex items-start mb-4">
                <div className="flex items-center justify-center bg-teal-100 rounded-full w-12 h-12 flex-shrink-0 mr-4">
                  <Clock className="h-5 w-5 text-teal-700" />
                </div>
                
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-600">Time</div>
                  <div className="font-medium">
                    {formatTime(startTime)} - {formatTime(endTime)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <div className="flex items-center justify-center bg-teal-100 rounded-full w-12 h-12 flex-shrink-0 mr-4">
                  <MapPin className="h-5 w-5 text-teal-700" />
                </div>
                
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-600">Location</div>
                  <div className="font-medium">{location.name}</div>
                </div>
              </div>
              
              {description && (
                <div className="mb-4 bg-gray-50 p-3 rounded-md text-gray-700">
                  {description}
                </div>
              )}
              
              <div className="flex items-center justify-between mt-2">
                {typeof cost === 'number' && (
                  <div className="flex items-center text-sm bg-gray-100 px-3 py-1 rounded-full">
                    <DollarSign className="h-4 w-4 text-gray-700 mr-1" />
                    <span>${cost.toLocaleString()}</span>
                  </div>
                )}
                
                {typeof carbonFootprint === 'number' && (
                  <CarbonFootprint footprint={carbonFootprint} />
                )}
              </div>
              
              {(onEdit || onDelete) && (
                <div className="flex justify-end gap-2 mt-4">
                  {onEdit && (
                    <button
                      onClick={onEdit}
                      className="text-xs flex items-center px-3 py-1.5 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-md transition-colors"
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </button>
                  )}
                  
                  {onDelete && (
                    <button
                      onClick={onDelete}
                      className="text-xs flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
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
