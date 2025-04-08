
import React, { useMemo } from 'react';
import { Itinerary } from '@/types/itinerary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import CarbonFootprint from './CarbonFootprint';
import { Plane, Train, Car, MapPin, Calendar, DollarSign } from 'lucide-react';

interface ItinerarySummaryProps {
  itinerary: Itinerary;
  className?: string;
}

const ItinerarySummary: React.FC<ItinerarySummaryProps> = ({ itinerary, className = '' }) => {
  // Calculate total days
  const totalDays = useMemo(() => {
    try {
      const start = new Date(itinerary.startDate);
      const end = new Date(itinerary.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays + 1; // Include both start and end day
    } catch (error) {
      return 0;
    }
  }, [itinerary.startDate, itinerary.endDate]);
  
  // Format date range
  const dateRange = useMemo(() => {
    try {
      const start = new Date(itinerary.startDate);
      const end = new Date(itinerary.endDate);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    } catch (error) {
      return 'Invalid date range';
    }
  }, [itinerary.startDate, itinerary.endDate]);
  
  // Calculate total activities
  const totalActivities = useMemo(() => {
    return itinerary.days.reduce((sum, day) => sum + day.activities.length, 0);
  }, [itinerary.days]);
  
  // Transportation icons
  const transportationIcons = {
    plane: <Plane className="h-5 w-5" />,
    train: <Train className="h-5 w-5" />,
    car: <Car className="h-5 w-5" />
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">{itinerary.title}</CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          {itinerary.destination}
          <Separator orientation="vertical" className="mx-1 h-4" />
          <Calendar className="h-4 w-4" />
          {dateRange} ({totalDays} days)
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Budget summary */}
        <div>
          <h3 className="text-md font-medium mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Budget Overview
          </h3>
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span>Total Budget:</span>
              <span className="font-medium">${itinerary.preferences.budget.total}</span>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Accommodations:</span>
                <span>${itinerary.preferences.budget.accommodations}</span>
              </div>
              <div className="flex justify-between">
                <span>Transportation:</span>
                <span>${itinerary.preferences.budget.transportation}</span>
              </div>
              <div className="flex justify-between">
                <span>Activities:</span>
                <span>${itinerary.preferences.budget.activities}</span>
              </div>
              <div className="flex justify-between">
                <span>Food:</span>
                <span>${itinerary.preferences.budget.food}</span>
              </div>
              {itinerary.preferences.budget.misc > 0 && (
                <div className="flex justify-between">
                  <span>Miscellaneous:</span>
                  <span>${itinerary.preferences.budget.misc}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Trip stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-semibold">{totalDays}</div>
            <div className="text-xs text-muted-foreground">Days</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-semibold">{totalActivities}</div>
            <div className="text-xs text-muted-foreground">Activities</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-semibold">{itinerary.accommodations.length}</div>
            <div className="text-xs text-muted-foreground">Accommodations</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-semibold">{itinerary.transportations.length}</div>
            <div className="text-xs text-muted-foreground">Transportations</div>
          </div>
        </div>
        
        {/* Preferences */}
        <div>
          <h3 className="text-md font-medium mb-2">Travel Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {itinerary.preferences.preferences.map((pref) => (
              <div key={pref} className="text-xs bg-accent rounded-full px-2 py-1">
                {pref.charAt(0).toUpperCase() + pref.slice(1)}
              </div>
            ))}
            <div className="text-xs bg-accent rounded-full px-2 py-1">
              {itinerary.preferences.pace.charAt(0).toUpperCase() + itinerary.preferences.pace.slice(1)} Pace
            </div>
          </div>
        </div>
        
        {/* Carbon footprint */}
        <CarbonFootprint footprint={itinerary.totalCarbonFootprint} showDetailed />
      </CardContent>
    </Card>
  );
};

export default ItinerarySummary;
