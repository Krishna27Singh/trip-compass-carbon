
import React from 'react';
import { ItineraryProvider } from '@/contexts/ItineraryContext';
import ItineraryPlanner from '@/components/ItineraryPlanner';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="bg-travel-blue text-white p-1.5 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
            </div>
            <h1 className="text-xl font-bold text-travel-blue">Trip Compass</h1>
          </div>
          
          <div className="flex items-center text-sm">
            <span className="mr-4 font-medium">Travel Smart, Travel Green</span>
            <div className="flex items-center gap-1 text-carbon-low">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
              <span className="font-medium">Carbon Conscious</span>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        <ItineraryProvider>
          <ItineraryPlanner />
        </ItineraryProvider>
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
            
            <div className="flex items-center gap-4">
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
  );
};

export default Index;
