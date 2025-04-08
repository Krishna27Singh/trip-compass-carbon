
import React from 'react';
import { formatCarbonFootprint, getCarbonCategory } from '@/utils/carbonCalculator';
import { Leaf } from 'lucide-react';

interface CarbonFootprintProps {
  footprint: number;
  showDetailed?: boolean;
  className?: string;
}

const CarbonFootprint: React.FC<CarbonFootprintProps> = ({
  footprint,
  showDetailed = false,
  className = ''
}) => {
  const category = getCarbonCategory(footprint);
  const formattedFootprint = formatCarbonFootprint(footprint);
  
  // Information based on carbon category
  const categoryInfo = {
    low: {
      color: 'text-carbon-low',
      bgColor: 'bg-carbon-low/10',
      borderColor: 'border-carbon-low/30',
      icon: <Leaf className="h-5 w-5 text-carbon-low" />,
      description: 'Low carbon impact. Great job!'
    },
    medium: {
      color: 'text-carbon-medium',
      bgColor: 'bg-carbon-medium/10',
      borderColor: 'border-carbon-medium/30',
      icon: <Leaf className="h-5 w-5 text-carbon-medium" />,
      description: 'Medium carbon impact. Consider some eco-friendly alternatives.'
    },
    high: {
      color: 'text-carbon-high',
      bgColor: 'bg-carbon-high/10',
      borderColor: 'border-carbon-high/30',
      icon: <Leaf className="h-5 w-5 text-carbon-high" />,
      description: 'High carbon impact. Look for ways to reduce your footprint.'
    }
  };
  
  const info = categoryInfo[category];
  
  if (!showDetailed) {
    // Simple indicator for list items, cards, etc.
    return (
      <div className={`flex items-center gap-1 ${info.color} ${className}`}>
        {info.icon}
        <span>{formattedFootprint}</span>
      </div>
    );
  }
  
  // Detailed version for the itinerary summary
  return (
    <div className={`rounded-lg ${info.bgColor} ${info.borderColor} border p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {info.icon}
          Carbon Footprint
        </h3>
        <span className={`text-xl font-bold ${info.color}`}>
          {formattedFootprint}
        </span>
      </div>
      
      <div className="mt-2">
        <p className="text-sm text-gray-700">{info.description}</p>
        
        <div className="mt-4">
          <p className="text-sm font-medium mb-1">What you can do:</p>
          <ul className="text-sm space-y-1 list-disc pl-5">
            {category === 'high' && (
              <>
                <li>Consider public transportation instead of private vehicles</li>
                <li>Choose direct flights when possible</li>
                <li>Opt for eco-friendly accommodations</li>
              </>
            )}
            {(category === 'high' || category === 'medium') && (
              <>
                <li>Use walking or cycling for short distances</li>
                <li>Choose train travel over flying when possible</li>
              </>
            )}
            <li>Offset your carbon footprint by planting trees or donating to environmental causes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CarbonFootprint;
