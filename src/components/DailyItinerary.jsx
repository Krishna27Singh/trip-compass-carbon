
import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { format, parse } from 'date-fns';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import ActivityCard from './ActivityCard';

const DailyItinerary = ({ day, onAddActivity }) => {
  const formatDate = (dateString) => {
    try {
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      return format(date, 'EEEE, MMMM do, yyyy');
    } catch (error) {
      console.error('Error parsing date:', error);
      return dateString;
    }
  };
  
  // Sort activities by start time
  const sortedActivities = [...day.activities].sort((a, b) => {
    const timeA = a.startTime.split(':').map(Number);
    const timeB = b.startTime.split(':').map(Number);
    
    if (timeA[0] !== timeB[0]) {
      return timeA[0] - timeB[0]; // Compare hours
    }
    return timeA[1] - timeB[1]; // Compare minutes
  });
  
  // Calculate total cost for the day
  const totalCost = day.activities.reduce((sum, activity) => sum + (activity.cost || 0), 0);
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{formatDate(day.date)}</h3>
          <div className="flex items-center mt-1">
            <span className="text-sm text-muted-foreground">
              {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'}
            </span>
            {day.isOverBudget && (
              <div className="ml-3 flex items-center text-amber-600 text-sm font-medium">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Over budget (₹{totalCost.toLocaleString()})
              </div>
            )}
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddActivity(day.id)}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Activity</span>
        </Button>
      </CardHeader>
      
      <CardContent>
        {sortedActivities.length > 0 ? (
          <div className="space-y-4">
            {sortedActivities.map(activity => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No activities scheduled for this day.</p>
            <p className="text-sm mt-1">Click "Add Activity" to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyItinerary;
