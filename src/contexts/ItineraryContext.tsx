
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Itinerary,
  TravelPreference,
  TravelPace,
  Day,
  Activity,
  Accommodation,
  Transportation,
  Budget,
  TripPreferences,
  Location
} from '@/types/itinerary';

interface ItineraryContextType {
  currentItinerary: Itinerary | null;
  setCurrentItinerary: (itinerary: Itinerary | null) => void;
  savedItineraries: Itinerary[];
  saveItinerary: (itinerary: Itinerary) => void;
  createNewItinerary: (
    title: string,
    destination: string,
    startDate: string,
    endDate: string,
    preferences: TripPreferences
  ) => Itinerary;
  addDay: (date: string) => void;
  removeDay: (dayId: string) => void;
  addActivity: (dayId: string, activity: Omit<Activity, 'id'>) => void;
  updateActivity: (dayId: string, activity: Activity) => void;
  removeActivity: (dayId: string, activityId: string) => void;
  reorderActivities: (dayId: string, activityIds: string[]) => void;
  addAccommodation: (accommodation: Omit<Accommodation, 'id'>) => void;
  updateAccommodation: (accommodation: Accommodation) => void;
  removeAccommodation: (accommodationId: string) => void;
  addTransportation: (transportation: Omit<Transportation, 'id'>) => void;
  updateTransportation: (transportation: Transportation) => void;
  removeTransportation: (transportationId: string) => void;
  updatePreferences: (preferences: TripPreferences) => void;
  calculateTotalCarbonFootprint: () => number;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  if (context === undefined) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
};

export const ItineraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);
  const [savedItineraries, setSavedItineraries] = useState<Itinerary[]>([]);

  // Helper function to create dates between start and end
  const getDaysBetweenDates = (startDate: string, endDate: string): Day[] => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days: Day[] = [];
    
    const currentDate = new Date(start);
    while (currentDate <= end) {
      days.push({
        id: uuidv4(),
        date: currentDate.toISOString().split('T')[0],
        activities: []
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const createNewItinerary = (
    title: string,
    destination: string,
    startDate: string,
    endDate: string,
    preferences: TripPreferences
  ): Itinerary => {
    const newItinerary: Itinerary = {
      id: uuidv4(),
      title,
      destination,
      startDate,
      endDate,
      days: getDaysBetweenDates(startDate, endDate),
      accommodations: [],
      transportations: [],
      preferences,
      totalCarbonFootprint: 0
    };
    
    setCurrentItinerary(newItinerary);
    return newItinerary;
  };

  const saveItinerary = (itinerary: Itinerary) => {
    setSavedItineraries([...savedItineraries, itinerary]);
  };

  const addDay = (date: string) => {
    if (!currentItinerary) return;
    
    setCurrentItinerary({
      ...currentItinerary,
      days: [
        ...currentItinerary.days,
        { id: uuidv4(), date, activities: [] }
      ]
    });
  };

  const removeDay = (dayId: string) => {
    if (!currentItinerary) return;
    
    setCurrentItinerary({
      ...currentItinerary,
      days: currentItinerary.days.filter(day => day.id !== dayId)
    });
  };

  const addActivity = (dayId: string, activityData: Omit<Activity, 'id'>) => {
    if (!currentItinerary) return;
    
    const newActivity: Activity = {
      ...activityData,
      id: uuidv4()
    };
    
    setCurrentItinerary({
      ...currentItinerary,
      days: currentItinerary.days.map(day => 
        day.id === dayId
          ? { ...day, activities: [...day.activities, newActivity] }
          : day
      )
    });
  };

  const updateActivity = (dayId: string, updatedActivity: Activity) => {
    if (!currentItinerary) return;
    
    setCurrentItinerary({
      ...currentItinerary,
      days: currentItinerary.days.map(day => 
        day.id === dayId
          ? {
              ...day,
              activities: day.activities.map(activity => 
                activity.id === updatedActivity.id ? updatedActivity : activity
              )
            }
          : day
      )
    });
  };

  const removeActivity = (dayId: string, activityId: string) => {
    if (!currentItinerary) return;
    
    setCurrentItinerary({
      ...currentItinerary,
      days: currentItinerary.days.map(day => 
        day.id === dayId
          ? {
              ...day,
              activities: day.activities.filter(activity => activity.id !== activityId)
            }
          : day
      )
    });
  };

  const reorderActivities = (dayId: string, activityIds: string[]) => {
    if (!currentItinerary) return;
    
    const day = currentItinerary.days.find(d => d.id === dayId);
    if (!day) return;
    
    const reorderedActivities = activityIds.map(activityId => 
      day.activities.find(activity => activity.id === activityId)
    ).filter((activity): activity is Activity => activity !== undefined);
    
    setCurrentItinerary({
      ...currentItinerary,
      days: currentItinerary.days.map(d => 
        d.id === dayId
          ? { ...d, activities: reorderedActivities }
          : d
      )
    });
  };

  const addAccommodation = (accommodationData: Omit<Accommodation, 'id'>) => {
    if (!currentItinerary) return;
    
    const newAccommodation: Accommodation = {
      ...accommodationData,
      id: uuidv4()
    };
    
    setCurrentItinerary({
      ...currentItinerary,
      accommodations: [...currentItinerary.accommodations, newAccommodation]
    });
  };

  const updateAccommodation = (updatedAccommodation: Accommodation) => {
    if (!currentItinerary) return;
    
    setCurrentItinerary({
      ...currentItinerary,
      accommodations: currentItinerary.accommodations.map(accommodation => 
        accommodation.id === updatedAccommodation.id ? updatedAccommodation : accommodation
      )
    });
  };

  const removeAccommodation = (accommodationId: string) => {
    if (!currentItinerary) return;
    
    setCurrentItinerary({
      ...currentItinerary,
      accommodations: currentItinerary.accommodations.filter(
        accommodation => accommodation.id !== accommodationId
      )
    });
  };

  const addTransportation = (transportationData: Omit<Transportation, 'id'>) => {
    if (!currentItinerary) return;
    
    const newTransportation: Transportation = {
      ...transportationData,
      id: uuidv4()
    };
    
    setCurrentItinerary({
      ...currentItinerary,
      transportations: [...currentItinerary.transportations, newTransportation]
    });
  };

  const updateTransportation = (updatedTransportation: Transportation) => {
    if (!currentItinerary) return;
    
    setCurrentItinerary({
      ...currentItinerary,
      transportations: currentItinerary.transportations.map(transportation => 
        transportation.id === updatedTransportation.id ? updatedTransportation : transportation
      )
    });
  };

  const removeTransportation = (transportationId: string) => {
    if (!currentItinerary) return;
    
    setCurrentItinerary({
      ...currentItinerary,
      transportations: currentItinerary.transportations.filter(
        transportation => transportation.id !== transportationId
      )
    });
  };

  const updatePreferences = (preferences: TripPreferences) => {
    if (!currentItinerary) return;
    
    setCurrentItinerary({
      ...currentItinerary,
      preferences
    });
  };

  const calculateTotalCarbonFootprint = (): number => {
    if (!currentItinerary) return 0;
    
    const transportationFootprint = currentItinerary.transportations.reduce(
      (total, transport) => total + (transport.carbonFootprint || 0),
      0
    );
    
    const accommodationFootprint = currentItinerary.accommodations.reduce(
      (total, accommodation) => total + (accommodation.carbonFootprint || 0),
      0
    );
    
    const activitiesFootprint = currentItinerary.days.reduce(
      (dayTotal, day) => 
        dayTotal + 
        day.activities.reduce(
          (activityTotal, activity) => activityTotal + (activity.carbonFootprint || 0),
          0
        ),
      0
    );
    
    const totalFootprint = transportationFootprint + accommodationFootprint + activitiesFootprint;
    
    // Update the itinerary with the new carbon footprint
    setCurrentItinerary({
      ...currentItinerary,
      totalCarbonFootprint: totalFootprint
    });
    
    return totalFootprint;
  };

  return (
    <ItineraryContext.Provider
      value={{
        currentItinerary,
        setCurrentItinerary,
        savedItineraries,
        saveItinerary,
        createNewItinerary,
        addDay,
        removeDay,
        addActivity,
        updateActivity,
        removeActivity,
        reorderActivities,
        addAccommodation,
        updateAccommodation,
        removeAccommodation,
        addTransportation,
        updateTransportation,
        removeTransportation,
        updatePreferences,
        calculateTotalCarbonFootprint
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};
