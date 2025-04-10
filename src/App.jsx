
import React, { useState, useEffect } from 'react';
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useToast } from "./hooks/use-toast";
import databaseAPI from './services/databaseAPI';
import ItineraryForm from './components/ItineraryForm';
import ItineraryView from './components/ItineraryView';
import PastItineraries from './components/PastItineraries';

const queryClient = new QueryClient();

const App = () => {
  const { toast } = useToast();
  const [itineraries, setItineraries] = useState([]);
  const [currentItinerary, setCurrentItinerary] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'create', 'view'

  // Load itineraries from localStorage on initial load
  useEffect(() => {
    const loadItineraries = () => {
      try {
        const savedItineraries = databaseAPI.getAllItineraries();
        setItineraries(savedItineraries);
      } catch (error) {
        console.error('Error loading itineraries:', error);
        toast({
          title: "Error",
          description: "Failed to load saved itineraries",
          variant: "destructive",
        });
      }
    };

    loadItineraries();
  }, []);

  // Fix for default marker icon in React Leaflet (needs to be done globally)
  useEffect(() => {
    // We need to defer import until after mount as Leaflet assumes a DOM
    import("leaflet").then(L => {
      delete L.Icon.Default.prototype._getIconUrl;
      
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });
  }, []);

  // Handle creating a new itinerary
  const handleCreateItinerary = (newItinerary) => {
    try {
      // Save to database
      const savedItinerary = databaseAPI.saveItinerary(newItinerary);
      
      // Update state
      setItineraries([...itineraries, savedItinerary]);
      setCurrentItinerary(savedItinerary);
      setView('view');
      
      toast({
        title: "Itinerary Created",
        description: `Your ${savedItinerary.destination} itinerary has been created.`,
      });
    } catch (error) {
      console.error('Error creating itinerary:', error);
      toast({
        title: "Error",
        description: "Failed to create itinerary",
        variant: "destructive",
      });
    }
  };

  // Handle saving an itinerary
  const handleSaveItinerary = (updatedItinerary) => {
    try {
      // Save to database
      const savedItinerary = databaseAPI.saveItinerary(updatedItinerary);
      
      // Update state
      setItineraries(itineraries.map(item => 
        item.id === savedItinerary.id ? savedItinerary : item
      ));
      setCurrentItinerary(savedItinerary);
      
      toast({
        title: "Itinerary Saved",
        description: `Your ${savedItinerary.destination} itinerary has been updated.`,
      });
    } catch (error) {
      console.error('Error saving itinerary:', error);
      toast({
        title: "Error",
        description: "Failed to save itinerary",
        variant: "destructive",
      });
    }
  };

  // Handle deleting an itinerary
  const handleDeleteItinerary = (itineraryId) => {
    try {
      // Delete from database
      databaseAPI.deleteItinerary(itineraryId);
      
      // Update state
      const updatedItineraries = itineraries.filter(item => item.id !== itineraryId);
      setItineraries(updatedItineraries);
      
      // If we're currently viewing the deleted itinerary, go back to the list
      if (currentItinerary && currentItinerary.id === itineraryId) {
        setCurrentItinerary(null);
        setView('list');
      }
      
      toast({
        title: "Itinerary Deleted",
        description: "Your itinerary has been deleted.",
      });
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      toast({
        title: "Error",
        description: "Failed to delete itinerary",
        variant: "destructive",
      });
    }
  };

  // Handle editing an itinerary
  const handleEditItinerary = (itinerary) => {
    setCurrentItinerary(itinerary);
    setView('view');
  };

  // Render the main content based on current view
  const renderContent = () => {
    switch (view) {
      case 'create':
        return (
          <ItineraryForm 
            onCreateItinerary={handleCreateItinerary}
          />
        );
        
      case 'view':
        return (
          <ItineraryView 
            itinerary={currentItinerary}
            onBack={() => {
              setCurrentItinerary(null);
              setView('list');
            }}
            onSave={handleSaveItinerary}
            onDelete={handleDeleteItinerary}
          />
        );
        
      case 'list':
      default:
        return (
          <PastItineraries 
            itineraries={itineraries}
            onDelete={handleDeleteItinerary}
            onEdit={handleEditItinerary}
            onCreate={() => setView('create')}
          />
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white border-b">
            <div className="container mx-auto flex items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 text-white p-1.5 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
                </div>
                <h1 className="text-xl font-bold text-blue-600">
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    setCurrentItinerary(null);
                    setView('list');
                  }}>
                    Trip Compass
                  </a>
                </h1>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  className="text-sm text-gray-600 hover:text-gray-900"
                  onClick={() => {
                    setCurrentItinerary(null);
                    setView('list');
                  }}
                >
                  My Itineraries
                </button>
                <button
                  className="text-sm text-gray-600 hover:text-gray-900"
                  onClick={() => setView('create')}
                >
                  Plan New Trip
                </button>
              </div>
            </div>
          </header>
          
          <main className="py-6">
            {renderContent()}
          </main>
          
          <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-2">
                    <div className="bg-white p-1 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
                    </div>
                    <span className="font-bold">Trip Compass</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Plan your journey, minimize your footprint
                  </p>
                </div>
                
                <div className="flex items-center gap-8">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Features</h3>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>Itinerary Planning</li>
                      <li>Carbon Footprint Tracker</li>
                      <li>Interactive Maps</li>
                      <li>Weather Integration</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold mb-2">About</h3>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>How It Works</li>
                      <li>Carbon Calculation</li>
                      <li>Privacy Policy</li>
                      <li>Terms of Service</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-700 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} Trip Compass. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
